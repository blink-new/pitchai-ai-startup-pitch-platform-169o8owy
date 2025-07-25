import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Upload, 
  FileText, 
  Video, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Play,
  BarChart3,
  MessageSquare,
  Download
} from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { UploadService } from '../services/uploadService'
import { AIService } from '../services/aiService'
import { useAuth } from '../hooks/useAuth'
import { PitchDeck, PitchVideo, PitchAnalysis, VideoAnalysis, InvestorQA } from '../types'

interface UploadItem {
  id: string
  fileName: string
  fileType: 'deck' | 'video'
  progress: number
  status: 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error'
  error?: string
  result?: {
    deck?: PitchDeck
    video?: PitchVideo
    analysis?: PitchAnalysis | VideoAnalysis
  }
}

export const EnhancedUploadPage: React.FC = () => {
  const { user } = useAuth()
  const [dragActive, setDragActive] = useState(false)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [title, setTitle] = useState('')
  const [activeTab, setActiveTab] = useState('upload')
  const [analysisResults, setAnalysisResults] = useState<{
    deckAnalysis?: PitchAnalysis
    videoAnalysis?: VideoAnalysis
    investorQA?: InvestorQA
  }>({})

  const updateUploadProgress = (id: string, updates: Partial<UploadItem>) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, ...updates } : upload
    ))
  }

  const handleFiles = useCallback(async (files: File[]) => {
    if (!user) return

    for (const file of files) {
      const fileType = file.type.includes('video') ? 'video' : 'deck'
      const validation = UploadService.validateFile(file, fileType)
      
      if (!validation.valid) {
        alert(validation.error)
        continue
      }

      const uploadId = `upload_${Date.now()}_${Math.random()}`
      const uploadItem: UploadItem = {
        id: uploadId,
        fileName: file.name,
        fileType,
        progress: 0,
        status: 'uploading'
      }

      setUploads(prev => [...prev, uploadItem])

      try {
        if (fileType === 'deck') {
          const result = await UploadService.uploadPitchDeck(
            file,
            title || file.name,
            user.id,
            (progress) => updateUploadProgress(uploadId, { progress, status: progress < 100 ? 'uploading' : 'processing' })
          )
          
          updateUploadProgress(uploadId, {
            status: 'completed',
            progress: 100,
            result: { deck: result.deck, analysis: result.analysis }
          })
          
          setAnalysisResults(prev => ({ ...prev, deckAnalysis: result.analysis }))
        } else {
          const result = await UploadService.uploadPitchVideo(
            file,
            title || file.name,
            user.id,
            (progress) => updateUploadProgress(uploadId, { 
              progress, 
              status: progress < 50 ? 'uploading' : progress < 90 ? 'processing' : 'analyzing'
            })
          )
          
          updateUploadProgress(uploadId, {
            status: 'completed',
            progress: 100,
            result: { video: result.video, analysis: result.analysis }
          })
          
          setAnalysisResults(prev => ({ ...prev, videoAnalysis: result.analysis }))
        }
      } catch (error) {
        updateUploadProgress(uploadId, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        })
      }
    }
  }, [user, title])

  const generateInvestorQA = async () => {
    if (!user) return

    try {
      const deckText = analysisResults.deckAnalysis ? 'Pitch deck analyzed' : undefined
      const videoText = analysisResults.videoAnalysis ? 'Video analyzed' : undefined
      
      const qa = await AIService.generateInvestorQA(deckText, videoText)
      qa.userId = user.id
      
      setAnalysisResults(prev => ({ ...prev, investorQA: qa }))
      setActiveTab('qa')
    } catch (error) {
      console.error('Error generating Q&A:', error)
      alert('Failed to generate investor Q&A')
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [handleFiles])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id))
  }

  const getFileIcon = (fileType: string) => {
    return fileType === 'video' ? 
      <Video className="h-5 w-5 text-green-600" /> : 
      <FileText className="h-5 w-5 text-blue-600" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
      case 'analyzing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Badge className="bg-blue-100 text-blue-800">Uploading</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case 'analyzing':
        return <Badge className="bg-purple-100 text-purple-800">AI Analysis</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const hasCompletedUploads = uploads.some(u => u.status === 'completed')
  const hasAnalysisResults = analysisResults.deckAnalysis || analysisResults.videoAnalysis

  return (
    <Layout title="Upload & Analyze Pitch">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Upload & Analyze Your Pitch</h1>
          <p className="text-muted-foreground">
            Upload your pitch deck and video for comprehensive AI-powered analysis and feedback
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={!hasAnalysisResults} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="qa" disabled={!analysisResults.investorQA} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Q&A Simulation
            </TabsTrigger>
            <TabsTrigger value="report" disabled={!hasAnalysisResults} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Upload your pitch deck (PDF/PPT) and pitch video (MP4/MOV) for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title">Pitch Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., TechStart Series A Pitch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Upload Zone */}
                <div
                  className={`upload-zone ${dragActive ? 'dragover' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">
                        Drag and drop your files here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse from your computer
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.ppt,.pptx,.mp4,.mov,.avi"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Browse Files
                      </label>
                    </Button>
                  </div>
                </div>

                {/* File Type Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Pitch Decks</h4>
                          <p className="text-sm text-muted-foreground">
                            PDF, PPT, PPTX (max 10MB)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <Video className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-medium">Pitch Videos</h4>
                          <p className="text-sm text-muted-foreground">
                            MP4, MOV, AVI (max 100MB, 5 min)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploads.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Progress</CardTitle>
                  <CardDescription>
                    Track the progress of your file uploads and AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="flex items-center space-x-4 rounded-lg border p-4">
                        <div className="flex-shrink-0">
                          {getFileIcon(upload.fileType)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium truncate">{upload.fileName}</p>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(upload.status)}
                              {getStatusBadge(upload.status)}
                            </div>
                          </div>
                          
                          {(upload.status === 'uploading' || upload.status === 'processing' || upload.status === 'analyzing') && (
                            <div className="space-y-1">
                              <Progress value={upload.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {upload.status === 'uploading' && `${Math.round(upload.progress)}% uploaded`}
                                {upload.status === 'processing' && 'Processing file...'}
                                {upload.status === 'analyzing' && 'Running AI analysis...'}
                              </p>
                            </div>
                          )}
                          
                          {upload.status === 'completed' && (
                            <p className="text-sm text-green-600">
                              ✓ Analysis complete! View results in the Analysis tab.
                            </p>
                          )}
                          
                          {upload.error && (
                            <p className="text-sm text-red-600">{upload.error}</p>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUpload(upload.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {hasCompletedUploads && (
                    <div className="mt-6 flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab('analysis')}
                        disabled={!hasAnalysisResults}
                      >
                        View Analysis
                      </Button>
                      <Button 
                        onClick={generateInvestorQA}
                        disabled={!hasAnalysisResults}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Generate Q&A Simulation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Analysis Results */}
            {analysisResults.deckAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Pitch Deck Analysis
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis of your pitch deck content and structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {analysisResults.deckAnalysis.overallScore}/10
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">Overall Score</h3>
                  </div>

                  {/* Category Scores */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {analysisResults.deckAnalysis.clarity.score}/10
                          </div>
                          <h4 className="font-medium mb-2">Clarity</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysisResults.deckAnalysis.clarity.feedback}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {analysisResults.deckAnalysis.storytelling.score}/10
                          </div>
                          <h4 className="font-medium mb-2">Storytelling</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysisResults.deckAnalysis.storytelling.feedback}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            {analysisResults.deckAnalysis.flow.score}/10
                          </div>
                          <h4 className="font-medium mb-2">Flow</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysisResults.deckAnalysis.flow.feedback}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Feedback Sections */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">Key Strengths</h4>
                      <ul className="space-y-2">
                        {analysisResults.deckAnalysis.keyStrengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-600 mb-3">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {analysisResults.deckAnalysis.areasForImprovement.map((area, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-3">Actionable Recommendations</h4>
                    <ul className="space-y-2">
                      {analysisResults.deckAnalysis.actionableRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Analysis */}
            {analysisResults.videoAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Pitch Video Analysis
                  </CardTitle>
                  <CardDescription>
                    AI analysis of your speech delivery, pace, and presentation style
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        {analysisResults.videoAnalysis.overallScore}/10
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">Delivery Score</h3>
                  </div>

                  {/* Speech Metrics */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {analysisResults.videoAnalysis.speechPace.score}/10
                          </div>
                          <h4 className="font-medium mb-1">Speech Pace</h4>
                          <p className="text-xs text-muted-foreground">
                            {analysisResults.videoAnalysis.speechPace.wordsPerMinute} WPM
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600 mb-2">
                            {analysisResults.videoAnalysis.fillerWords.percentage}%
                          </div>
                          <h4 className="font-medium mb-1">Filler Words</h4>
                          <p className="text-xs text-muted-foreground">
                            {analysisResults.videoAnalysis.fillerWords.count} total
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {analysisResults.videoAnalysis.confidence.score}/10
                          </div>
                          <h4 className="font-medium mb-1">Confidence</h4>
                          <p className="text-xs text-muted-foreground">
                            Voice analysis
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            {analysisResults.videoAnalysis.tone.score}/10
                          </div>
                          <h4 className="font-medium mb-1">Tone</h4>
                          <p className="text-xs text-muted-foreground">
                            Engagement level
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Video Feedback */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">Delivery Strengths</h4>
                      <ul className="space-y-2">
                        {analysisResults.videoAnalysis.keyStrengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-600 mb-3">Delivery Improvements</h4>
                      <ul className="space-y-2">
                        {analysisResults.videoAnalysis.areasForImprovement.map((area, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="qa" className="space-y-6">
            {analysisResults.investorQA && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Investor Q&A Simulation
                  </CardTitle>
                  <CardDescription>
                    Practice with AI-generated investor questions based on your pitch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analysisResults.investorQA.questions.map((qa, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center flex-shrink-0">
                                  Q{index + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{qa.question}</h4>
                                </div>
                              </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4">
                              <h5 className="font-medium text-green-600 mb-2">Suggested Answer:</h5>
                              <p className="text-sm mb-3">{qa.suggestedAnswer}</p>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-medium">Answer Quality:</span>
                                <div className="flex items-center gap-1">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${(qa.answerQuality / 10) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium">{qa.answerQuality}/10</span>
                                </div>
                              </div>

                              <div>
                                <h6 className="font-medium text-blue-600 mb-2">Tips for Success:</h6>
                                <ul className="space-y-1">
                                  {qa.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="text-xs flex items-start gap-2">
                                      <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Report
                </CardTitle>
                <CardDescription>
                  Export your complete pitch analysis report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Report Generation</h3>
                    <p className="text-muted-foreground mb-6">
                      Generate a comprehensive PDF report with all your analysis results
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full max-w-sm" disabled>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Report
                    </Button>
                    <Button variant="outline" className="w-full max-w-sm" disabled>
                      Generate Shareable Link
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Report generation feature coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}