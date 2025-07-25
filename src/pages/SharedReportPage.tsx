import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { 
  FileText, 
  Video, 
  MessageSquare, 
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { ReportService } from '../services/reportService'
import { PitchReport } from '../types'

export const SharedReportPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>()
  const [report, setReport] = useState<PitchReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      if (!shareToken) {
        setError('Invalid share link')
        setLoading(false)
        return
      }

      try {
        const sharedReport = await ReportService.getSharedReport(shareToken)
        if (sharedReport) {
          setReport(sharedReport)
        } else {
          setError('Report not found or no longer shared')
        }
      } catch (err) {
        setError('Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [shareToken])

  const downloadReport = async () => {
    if (!report) return

    try {
      const blob = await ReportService.exportReportAsPDF(report)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.title}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Failed to download report. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Report Not Available</h3>
              <p className="text-muted-foreground">
                {error || 'This report could not be found or is no longer shared.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">PitchAI Analysis Report</h1>
              <p className="text-muted-foreground">Shared pitch analysis report</p>
            </div>
            <Button onClick={downloadReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Overall Score */}
        <Card>
          <CardHeader>
            <div className="text-center">
              <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
              <CardDescription>
                Generated on {new Date(report.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-primary mb-4">
                {report.overallScore}/10
              </div>
              <p className="text-xl text-muted-foreground">Overall Pitch Score</p>
            </div>
          </CardContent>
        </Card>

        {/* Pitch Deck Analysis */}
        {report.deckAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Pitch Deck Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scores */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {report.deckAnalysis.clarity.score}/10
                  </div>
                  <p className="font-medium mb-2">Clarity</p>
                  <p className="text-sm text-muted-foreground">
                    {report.deckAnalysis.clarity.feedback}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {report.deckAnalysis.storytelling.score}/10
                  </div>
                  <p className="font-medium mb-2">Storytelling</p>
                  <p className="text-sm text-muted-foreground">
                    {report.deckAnalysis.storytelling.feedback}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {report.deckAnalysis.flow.score}/10
                  </div>
                  <p className="font-medium mb-2">Flow</p>
                  <p className="text-sm text-muted-foreground">
                    {report.deckAnalysis.flow.feedback}
                  </p>
                </div>
              </div>
              
              {/* Strengths and Improvements */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-green-700 mb-3">Key Strengths</h4>
                  <ul className="space-y-2">
                    {report.deckAnalysis.keyStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-amber-700 mb-3">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {report.deckAnalysis.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Actionable Recommendations</h4>
                <ul className="space-y-2">
                  {report.deckAnalysis.actionableRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-blue-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Analysis */}
        {report.videoAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-green-600" />
                <span>Video Delivery Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scores */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {report.videoAnalysis.speechPace.score}/10
                  </div>
                  <p className="font-medium text-sm mb-1">Speech Pace</p>
                  <p className="text-xs text-muted-foreground">
                    {report.videoAnalysis.speechPace.wordsPerMinute} WPM
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {report.videoAnalysis.confidence.score}/10
                  </div>
                  <p className="font-medium text-sm">Confidence</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {report.videoAnalysis.tone.score}/10
                  </div>
                  <p className="font-medium text-sm">Tone</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    {report.videoAnalysis.fillerWords.count}
                  </div>
                  <p className="font-medium text-sm mb-1">Filler Words</p>
                  <p className="text-xs text-muted-foreground">
                    {report.videoAnalysis.fillerWords.percentage}%
                  </p>
                </div>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-green-700 mb-3">Delivery Strengths</h4>
                  <ul className="space-y-2">
                    {report.videoAnalysis.keyStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-amber-700 mb-3">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {report.videoAnalysis.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investor Q&A */}
        {report.investorQA && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span>Investor Q&A Simulation</span>
              </CardTitle>
              <CardDescription>
                Common investor questions with suggested answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.investorQA.questions.slice(0, 8).map((qa, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="font-medium text-gray-900">
                      <span className="text-purple-600 font-bold">Q{index + 1}:</span> {qa.question}
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <strong className="text-gray-900">Suggested Answer:</strong> {qa.suggestedAnswer}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Answer Quality: {qa.answerQuality}/10
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {qa.tips.length} preparation tips included
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>This report was generated by <strong>PitchAI</strong> - AI-powered pitch analysis platform</p>
              <p className="mt-2">Visit <a href="/" className="text-primary hover:underline">PitchAI</a> to analyze your own pitch</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}