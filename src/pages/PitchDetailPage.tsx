import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'
import { Separator } from '../components/ui/separator'
import { 
  ArrowLeft,
  Download,
  Share2,
  Star,
  TrendingUp,
  FileText,
  Video,
  MessageSquare,
  Calendar,
  Building2,
  User,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Play
} from 'lucide-react'
import { blink } from '../lib/blink'

interface PitchDetail {
  id: string
  companyName: string
  founder: string
  founderEmail: string
  industry: string
  stage: string
  fundingAmount: string
  uploadDate: string
  status: string
  overallScore: number
  deckAnalysis: {
    clarityScore: number
    storytellingScore: number
    flowScore: number
    feedback: string[]
    strengths: string[]
    improvements: string[]
  }
  videoAnalysis?: {
    deliveryScore: number
    paceScore: number
    confidenceScore: number
    fillerWords: number
    transcript: string
    feedback: string[]
  }
  qaSimulation: {
    questions: Array<{
      question: string
      suggestedAnswer: string
      importance: 'high' | 'medium' | 'low'
    }>
  }
  businessMetrics: {
    marketSize: string
    revenue: string
    growth: string
    team: number
  }
}

export const PitchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pitch, setPitch] = useState<PitchDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPitchDetail = async () => {
      try {
        // In a real app, this would fetch from the database
        // For now, we'll use mock data
        const mockPitch: PitchDetail = {
          id: id || '1',
          companyName: 'TechFlow AI',
          founder: 'Sarah Chen',
          founderEmail: 'sarah.chen@techflow.ai',
          industry: 'AI/ML',
          stage: 'Series A',
          fundingAmount: '$2M',
          uploadDate: '2024-01-20',
          status: 'reviewed',
          overallScore: 8.7,
          deckAnalysis: {
            clarityScore: 9.2,
            storytellingScore: 8.5,
            flowScore: 8.4,
            feedback: [
              'Excellent problem definition and market opportunity presentation',
              'Strong technical differentiation clearly explained',
              'Financial projections are realistic and well-supported'
            ],
            strengths: [
              'Clear value proposition',
              'Strong market validation',
              'Experienced team',
              'Scalable business model'
            ],
            improvements: [
              'Add more competitive analysis details',
              'Include customer testimonials',
              'Clarify go-to-market strategy timeline'
            ]
          },
          videoAnalysis: {
            deliveryScore: 8.3,
            paceScore: 7.8,
            confidenceScore: 9.1,
            fillerWords: 12,
            transcript: 'Hi everyone, I\'m Sarah Chen, founder and CEO of TechFlow AI. We\'re revolutionizing how businesses process and analyze unstructured data using advanced AI algorithms...',
            feedback: [
              'Confident and engaging delivery style',
              'Good eye contact and professional presence',
              'Consider slowing down slightly in technical sections'
            ]
          },
          qaSimulation: {
            questions: [
              {
                question: 'What is your customer acquisition cost and how do you plan to scale it?',
                suggestedAnswer: 'Our current CAC is $150 with an LTV of $2,400, giving us a healthy 16:1 ratio. We plan to scale through content marketing and strategic partnerships.',
                importance: 'high'
              },
              {
                question: 'How do you differentiate from existing solutions in the market?',
                suggestedAnswer: 'Our proprietary AI model processes unstructured data 10x faster than competitors while maintaining 95% accuracy, backed by 3 patents.',
                importance: 'high'
              },
              {
                question: 'What are your biggest risks and how are you mitigating them?',
                suggestedAnswer: 'Key risks include data privacy regulations and competition from big tech. We\'re mitigating through SOC2 compliance and building defensible IP.',
                importance: 'medium'
              }
            ]
          },
          businessMetrics: {
            marketSize: '$50B',
            revenue: '$2.4M ARR',
            growth: '15% MoM',
            team: 12
          }
        }

        setPitch(mockPitch)
      } catch (error) {
        console.error('Error fetching pitch detail:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPitchDetail()
  }, [id])

  const handleDownloadReport = async () => {
    try {
      // In a real app, this would generate and download a PDF report
      console.log('Downloading report for pitch:', id)
      // Mock download
      const element = document.createElement('a')
      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Pitch Analysis Report - ' + pitch?.companyName)
      element.download = `${pitch?.companyName}_Analysis_Report.pdf`
      element.click()
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }

  const handleShareReport = async () => {
    try {
      const shareUrl = `${window.location.origin}/shared-report/${id}`
      await navigator.clipboard.writeText(shareUrl)
      // In a real app, you'd show a toast notification
      alert('Share link copied to clipboard!')
    } catch (error) {
      console.error('Error sharing report:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600'
    if (score >= 7.0) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-100 text-green-800'
    if (score >= 7.0) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-amber-100 text-amber-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!pitch) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Pitch not found</h2>
        <p className="text-muted-foreground mt-2">The requested pitch could not be found.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{pitch.companyName}</h1>
            <p className="text-muted-foreground">
              Founded by {pitch.founder} • {pitch.industry} • {pitch.stage}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShareReport}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Star className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(pitch.overallScore)}`}>
              {pitch.overallScore}/10
            </div>
            <Badge className={getScoreBgColor(pitch.overallScore)}>
              {pitch.overallScore >= 8.5 ? 'Excellent' : pitch.overallScore >= 7.0 ? 'Good' : 'Needs Work'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funding Target</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pitch.fundingAmount}</div>
            <p className="text-xs text-muted-foreground">
              {pitch.stage} round
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Size</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pitch.businessMetrics.marketSize}</div>
            <p className="text-xs text-muted-foreground">
              Total addressable market
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pitch.businessMetrics.revenue}</div>
            <p className="text-xs text-muted-foreground">
              Growing {pitch.businessMetrics.growth}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="deck" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deck" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Deck Analysis
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Analysis
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Q&A Simulation
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deck" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clarity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(pitch.deckAnalysis.clarityScore)}`}>
                  {pitch.deckAnalysis.clarityScore}/10
                </div>
                <Progress value={pitch.deckAnalysis.clarityScore * 10} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Storytelling Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(pitch.deckAnalysis.storytellingScore)}`}>
                  {pitch.deckAnalysis.storytellingScore}/10
                </div>
                <Progress value={pitch.deckAnalysis.storytellingScore * 10} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Flow Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(pitch.deckAnalysis.flowScore)}`}>
                  {pitch.deckAnalysis.flowScore}/10
                </div>
                <Progress value={pitch.deckAnalysis.flowScore * 10} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pitch.deckAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pitch.deckAnalysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>Detailed analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pitch.deckAnalysis.feedback.map((feedback, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          {pitch.videoAnalysis ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${getScoreColor(pitch.videoAnalysis.deliveryScore)}`}>
                      {pitch.videoAnalysis.deliveryScore}/10
                    </div>
                    <Progress value={pitch.videoAnalysis.deliveryScore * 10} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pace Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${getScoreColor(pitch.videoAnalysis.paceScore)}`}>
                      {pitch.videoAnalysis.paceScore}/10
                    </div>
                    <Progress value={pitch.videoAnalysis.paceScore * 10} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Confidence Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${getScoreColor(pitch.videoAnalysis.confidenceScore)}`}>
                      {pitch.videoAnalysis.confidenceScore}/10
                    </div>
                    <Progress value={pitch.videoAnalysis.confidenceScore * 10} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Speech Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Filler Words</span>
                        <Badge variant="outline">{pitch.videoAnalysis.fillerWords} instances</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Speaking Pace</span>
                        <Badge variant="outline">Optimal</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Confidence Level</span>
                        <Badge variant="outline">High</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pitch.videoAnalysis.feedback.map((feedback, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feedback}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Transcript
                  </CardTitle>
                  <CardDescription>AI-generated transcript of the pitch video</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm leading-relaxed">{pitch.videoAnalysis.transcript}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Video Analysis Available</h3>
                <p className="text-muted-foreground">This pitch doesn't include video analysis.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="qa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investor Q&A Simulation</CardTitle>
              <CardDescription>
                AI-generated questions investors are likely to ask, with suggested answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pitch.qaSimulation.questions.map((qa, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-lg">{qa.question}</h4>
                      <Badge className={getImportanceColor(qa.importance)}>
                        {qa.importance} priority
                      </Badge>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Suggested Answer:</p>
                      <p className="text-sm leading-relaxed">{qa.suggestedAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Founder Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{pitch.founder}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{pitch.founderEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{pitch.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Industry</p>
                    <Badge variant="outline">{pitch.industry}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Size</span>
                    <span className="font-medium">{pitch.businessMetrics.marketSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Revenue</span>
                    <span className="font-medium">{pitch.businessMetrics.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Growth Rate</span>
                    <span className="font-medium text-green-600">{pitch.businessMetrics.growth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Team Size</span>
                    <span className="font-medium">{pitch.businessMetrics.team} people</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pitch Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pitch Uploaded</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pitch.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI Analysis Completed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pitch.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Available for Review</p>
                    <p className="text-xs text-muted-foreground">Current status</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}