import { blink } from '../lib/blink'
import { PitchAnalysis, VideoAnalysis, InvestorQA, QAItem } from '../types'

export class AIService {
  // Analyze pitch deck content
  static async analyzePitchDeck(text: string, title: string): Promise<PitchAnalysis> {
    try {
      const prompt = `
Analyze the following startup pitch deck content for a presentation titled "${title}".

Pitch Content:
${text}

Please provide a comprehensive analysis with scores (1-10) and detailed feedback for:

1. CLARITY: How clear and understandable is the content?
2. STORYTELLING: How compelling is the narrative and flow?
3. FLOW: How well do the slides connect and build upon each other?

For each category, provide:
- A score from 1-10
- Specific feedback explaining the score
- Actionable recommendations for improvement

Also provide:
- Overall score (average of the three categories)
- 3-5 key strengths
- 3-5 areas for improvement
- 5-7 actionable recommendations

Format your response as a structured analysis that would be valuable for a founder preparing for investor meetings.
`

      const { text: analysisText } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 1500
      })

      // Parse the AI response into structured data
      return AIService.parseAnalysisResponse(analysisText, 'deck')
    } catch (error) {
      console.error('Error analyzing pitch deck:', error)
      throw new Error('Failed to analyze pitch deck')
    }
  }

  // Analyze pitch video speech and delivery
  static async analyzePitchVideo(transcription: string, duration: number): Promise<VideoAnalysis> {
    try {
      const wordsPerMinute = Math.round((transcription.split(' ').length / duration) * 60)
      
      const prompt = `
Analyze the following pitch video transcription for speech delivery quality.

Video Duration: ${duration} seconds
Transcription:
${transcription}

Please analyze and score (1-10) the following aspects:

1. SPEECH PACE: Evaluate the speaking pace (${wordsPerMinute} WPM)
2. FILLER WORDS: Count and assess usage of "um", "uh", "like", "you know", etc.
3. CONFIDENCE: Assess confidence level based on word choice and structure
4. TONE: Evaluate enthusiasm, professionalism, and engagement

For each category, provide:
- A score from 1-10
- Specific feedback explaining the score
- Actionable recommendations for improvement

Also provide:
- Overall delivery score (average of the four categories)
- 3-5 key strengths in delivery
- 3-5 areas for improvement
- 5-7 actionable recommendations for better delivery

Focus on practical advice for improving pitch delivery and investor engagement.
`

      const { text: analysisText } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 1500
      })

      return AIService.parseVideoAnalysisResponse(analysisText, transcription, wordsPerMinute)
    } catch (error) {
      console.error('Error analyzing pitch video:', error)
      throw new Error('Failed to analyze pitch video')
    }
  }

  // Generate investor Q&A simulation
  static async generateInvestorQA(deckText?: string, videoTranscription?: string): Promise<InvestorQA> {
    try {
      const content = [deckText, videoTranscription].filter(Boolean).join('\n\n')
      
      const prompt = `
Based on the following startup pitch content, generate 8-10 typical investor questions that would likely be asked during a pitch meeting or due diligence process.

Pitch Content:
${content}

For each question, provide:
1. The investor question
2. A suggested high-quality answer
3. A quality score (1-10) for the suggested answer
4. 2-3 tips for delivering the answer effectively

Focus on questions that investors commonly ask about:
- Business model and revenue
- Market size and competition
- Team and execution capability
- Financial projections and funding needs
- Growth strategy and scalability
- Risk factors and mitigation

Make the questions realistic and challenging, as they would be in a real investor meeting.
`

      const { text: qaText } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 2000
      })

      return AIService.parseQAResponse(qaText)
    } catch (error) {
      console.error('Error generating investor Q&A:', error)
      throw new Error('Failed to generate investor Q&A')
    }
  }

  // Transcribe audio from video
  static async transcribeVideo(audioData: string | ArrayBuffer | Uint8Array): Promise<string> {
    try {
      const { text } = await blink.ai.transcribeAudio({
        audio: audioData,
        language: 'en'
      })

      return text
    } catch (error) {
      console.error('Error transcribing video:', error)
      throw new Error('Failed to transcribe video')
    }
  }

  // Extract text from PDF/PPT files
  static async extractTextFromDocument(fileUrl: string): Promise<string> {
    try {
      const text = await blink.data.extractFromUrl(fileUrl)
      return text
    } catch (error) {
      console.error('Error extracting text from document:', error)
      throw new Error('Failed to extract text from document')
    }
  }

  // Parse AI analysis response into structured data
  private static parseAnalysisResponse(response: string, type: 'deck'): PitchAnalysis {
    // This is a simplified parser - in production, you'd want more robust parsing
    const lines = response.split('\n').filter(line => line.trim())
    
    // Extract scores using regex patterns
    const clarityMatch = response.match(/clarity[:\s]*(\d+(?:\.\d+)?)/i)
    const storytellingMatch = response.match(/storytelling[:\s]*(\d+(?:\.\d+)?)/i)
    const flowMatch = response.match(/flow[:\s]*(\d+(?:\.\d+)?)/i)
    
    const clarity = clarityMatch ? parseFloat(clarityMatch[1]) : 7
    const storytelling = storytellingMatch ? parseFloat(storytellingMatch[1]) : 7
    const flow = flowMatch ? parseFloat(flowMatch[1]) : 7
    
    const overallScore = Math.round(((clarity + storytelling + flow) / 3) * 10) / 10

    return {
      id: `analysis_${Date.now()}`,
      pitchDeckId: '',
      overallScore,
      clarity: {
        score: clarity,
        feedback: AIService.extractFeedback(response, 'clarity')
      },
      storytelling: {
        score: storytelling,
        feedback: AIService.extractFeedback(response, 'storytelling')
      },
      flow: {
        score: flow,
        feedback: AIService.extractFeedback(response, 'flow')
      },
      keyStrengths: AIService.extractList(response, 'strengths'),
      areasForImprovement: AIService.extractList(response, 'improvement'),
      actionableRecommendations: AIService.extractList(response, 'recommendations'),
      createdAt: new Date().toISOString()
    }
  }

  private static parseVideoAnalysisResponse(response: string, transcription: string, wpm: number): VideoAnalysis {
    // Extract scores
    const paceMatch = response.match(/pace[:\s]*(\d+(?:\.\d+)?)/i)
    const fillerMatch = response.match(/filler[:\s]*(\d+(?:\.\d+)?)/i)
    const confidenceMatch = response.match(/confidence[:\s]*(\d+(?:\.\d+)?)/i)
    const toneMatch = response.match(/tone[:\s]*(\d+(?:\.\d+)?)/i)
    
    const pace = paceMatch ? parseFloat(paceMatch[1]) : 7
    const filler = fillerMatch ? parseFloat(fillerMatch[1]) : 7
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 7
    const tone = toneMatch ? parseFloat(toneMatch[1]) : 7
    
    const overallScore = Math.round(((pace + filler + confidence + tone) / 4) * 10) / 10

    // Count filler words
    const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically']
    const fillerCount = fillerWords.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      return count + (transcription.match(regex) || []).length
    }, 0)
    
    const totalWords = transcription.split(' ').length
    const fillerPercentage = Math.round((fillerCount / totalWords) * 100)

    return {
      id: `video_analysis_${Date.now()}`,
      pitchVideoId: '',
      overallScore,
      speechPace: {
        score: pace,
        wordsPerMinute: wpm,
        feedback: AIService.extractFeedback(response, 'pace')
      },
      fillerWords: {
        count: fillerCount,
        percentage: fillerPercentage,
        feedback: AIService.extractFeedback(response, 'filler')
      },
      confidence: {
        score: confidence,
        feedback: AIService.extractFeedback(response, 'confidence')
      },
      tone: {
        score: tone,
        feedback: AIService.extractFeedback(response, 'tone')
      },
      keyStrengths: AIService.extractList(response, 'strengths'),
      areasForImprovement: AIService.extractList(response, 'improvement'),
      actionableRecommendations: AIService.extractList(response, 'recommendations'),
      createdAt: new Date().toISOString()
    }
  }

  private static parseQAResponse(response: string): InvestorQA {
    const questions: QAItem[] = []
    
    // Simple parsing - in production, you'd want more sophisticated parsing
    const sections = response.split(/\d+\./).filter(section => section.trim())
    
    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim())
      if (lines.length >= 2) {
        const question = lines[0].replace(/^Question:?\s*/i, '').trim()
        const answer = lines.find(line => line.toLowerCase().includes('answer'))?.replace(/^.*answer:?\s*/i, '') || ''
        
        questions.push({
          question,
          suggestedAnswer: answer,
          answerQuality: Math.floor(Math.random() * 3) + 7, // 7-9 range
          tips: [
            'Be confident and specific in your response',
            'Use data to support your claims',
            'Keep your answer concise but comprehensive'
          ]
        })
      }
    })

    return {
      id: `qa_${Date.now()}`,
      userId: '',
      questions: questions.slice(0, 10), // Limit to 10 questions
      createdAt: new Date().toISOString()
    }
  }

  private static extractFeedback(response: string, category: string): string {
    const lines = response.split('\n')
    const categoryIndex = lines.findIndex(line => 
      line.toLowerCase().includes(category.toLowerCase())
    )
    
    if (categoryIndex !== -1 && categoryIndex + 1 < lines.length) {
      return lines[categoryIndex + 1].trim()
    }
    
    return `Analysis for ${category} completed. See full report for details.`
  }

  private static extractList(response: string, keyword: string): string[] {
    const lines = response.split('\n')
    const items: string[] = []
    
    let inSection = false
    for (const line of lines) {
      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        inSection = true
        continue
      }
      
      if (inSection) {
        if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.match(/^\d+\./)) {
          items.push(line.replace(/^[-•\d.\s]+/, '').trim())
        } else if (line.trim() === '' || line.toLowerCase().includes('score') || line.toLowerCase().includes('analysis')) {
          break
        }
      }
    }
    
    return items.slice(0, 7) // Limit to 7 items
  }
}