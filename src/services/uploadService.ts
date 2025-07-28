import { blink } from '../lib/blink'
import { AIService } from './aiService'
import { PitchDeck, PitchVideo, PitchAnalysis, VideoAnalysis } from '../types'

export class UploadService {
  // Upload and process pitch deck
  static async uploadPitchDeck(
    file: File, 
    title: string, 
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<{ deck: PitchDeck; analysis: PitchAnalysis }> {
    try {
      // Step 1: Upload file to storage
      if (onProgress) onProgress(10)
      
      const { publicUrl } = await blink.storage.upload(
        file,
        `pitch-decks/${userId}/${Date.now()}-${file.name}`,
        { upsert: true }
      )
      
      if (onProgress) onProgress(30)

      // Step 2: Create pitch deck record
      const deckData = {
        id: `deck_${Date.now()}`,
        userId,
        title,
        fileName: file.name,
        fileUrl: publicUrl,
        fileType: file.type.includes('pdf') ? 'pdf' as const : 
                  file.type.includes('presentation') ? 'pptx' as const : 'ppt' as const,
        uploadedAt: new Date().toISOString(),
        analysisStatus: 'processing' as const
      }

      await blink.db.pitchDecks.create(deckData)
      
      if (onProgress) onProgress(50)

      // Step 3: Extract text from document
      const extractedText = await AIService.extractTextFromDocument(publicUrl)
      
      if (onProgress) onProgress(70)

      // Step 4: Run AI analysis
      const analysis = await AIService.analyzePitchDeck(extractedText, title)
      analysis.pitchDeckId = deckData.id

      if (onProgress) onProgress(90)

      // Step 5: Save analysis and update deck status
      await blink.db.pitchAnalyses.create(analysis)
      await blink.db.pitchDecks.update(deckData.id, {
        analysisStatus: 'completed',
        analysisResult: analysis
      })

      if (onProgress) onProgress(100)

      return {
        deck: { ...deckData, analysisStatus: 'completed', analysisResult: analysis },
        analysis
      }
    } catch (error) {
      console.error('Error uploading pitch deck:', error)
      throw new Error('Failed to upload and analyze pitch deck')
    }
  }

  // Upload and process pitch video
  static async uploadPitchVideo(
    file: File,
    title: string,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<{ video: PitchVideo; analysis: VideoAnalysis }> {
    try {
      // Step 1: Upload video file
      if (onProgress) onProgress(10)
      
      const { publicUrl } = await blink.storage.upload(
        file,
        `pitch-videos/${userId}/${Date.now()}-${file.name}`,
        { upsert: true }
      )
      
      if (onProgress) onProgress(25)

      // Step 2: Create video record
      const videoData = {
        id: `video_${Date.now()}`,
        userId,
        title,
        fileName: file.name,
        fileUrl: publicUrl,
        duration: await UploadService.getVideoDuration(file),
        uploadedAt: new Date().toISOString(),
        transcriptionStatus: 'processing' as const,
        analysisStatus: 'processing' as const
      }

      await blink.db.pitchVideos.create(videoData)
      
      if (onProgress) onProgress(40)

      // Step 3: Extract audio and transcribe
      const audioData = await UploadService.extractAudioFromVideo(file)
      
      if (onProgress) onProgress(60)
      
      const transcription = await AIService.transcribeVideo(audioData)
      
      if (onProgress) onProgress(75)

      // Step 4: Update video with transcription
      await blink.db.pitchVideos.update(videoData.id, {
        transcription,
        transcriptionStatus: 'completed'
      })

      // Step 5: Run speech analysis
      const analysis = await AIService.analyzePitchVideo(transcription, videoData.duration || 0)
      analysis.pitchVideoId = videoData.id

      if (onProgress) onProgress(90)

      // Step 6: Save analysis and update video status
      await blink.db.videoAnalyses.create(analysis)
      await blink.db.pitchVideos.update(videoData.id, {
        analysisStatus: 'completed',
        analysisResult: analysis
      })

      if (onProgress) onProgress(100)

      return {
        video: { 
          ...videoData, 
          transcription,
          transcriptionStatus: 'completed',
          analysisStatus: 'completed',
          analysisResult: analysis 
        },
        analysis
      }
    } catch (error) {
      console.error('Error uploading pitch video:', error)
      throw new Error('Failed to upload and analyze pitch video')
    }
  }

  // Get video duration
  private static async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        resolve(Math.round(video.duration))
      }
      
      video.onerror = () => {
        resolve(0) // Default duration if unable to determine
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  // Extract audio from video file
  private static async extractAudioFromVideo(file: File): Promise<ArrayBuffer> {
    // For now, we'll pass the video file directly to the transcription service
    // In a production environment, you might want to extract audio on the backend
    return file.arrayBuffer()
  }

  // Validate file type and size
  static validateFile(file: File, type: 'deck' | 'video'): { valid: boolean; error?: string } {
    if (type === 'deck') {
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ]
      
      if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Please upload a PDF, PPT, or PPTX file' }
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        return { valid: false, error: 'File size must be less than 10MB' }
      }
    } else if (type === 'video') {
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
      
      if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Please upload an MP4, MOV, or AVI file' }
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB
        return { valid: false, error: 'Video file size must be less than 100MB' }
      }
    }
    
    return { valid: true }
  }

  // Get user's pitch decks
  static async getUserPitchDecks(userId: string): Promise<PitchDeck[]> {
    try {
      const decks = await blink.db.pitchDecks.list({
        where: { userId },
        orderBy: { uploadedAt: 'desc' }
      })
      return decks
    } catch (error) {
      console.error('Error fetching pitch decks:', error)
      return []
    }
  }

  // Get user's pitch videos
  static async getUserPitchVideos(userId: string): Promise<PitchVideo[]> {
    try {
      const videos = await blink.db.pitchVideos.list({
        where: { userId },
        orderBy: { uploadedAt: 'desc' }
      })
      return videos
    } catch (error) {
      console.error('Error fetching pitch videos:', error)
      return []
    }
  }
}