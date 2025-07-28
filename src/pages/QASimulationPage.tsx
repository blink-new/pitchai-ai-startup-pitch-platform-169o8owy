import React from 'react'
import { Layout } from '../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { MessageSquare, Play, Brain, Clock, CheckCircle, Star } from 'lucide-react'

export const QASimulationPage: React.FC = () => {
  // Mock data - replace with real data from API
  const simulations = [
    {
      id: '1',
      title: 'Series A Q&A Simulation',
      basedOn: 'TechStart Pitch Deck v3',
      questionsCount: 8,
      status: 'completed',
      score: 8.4,
      completedAt: '2024-01-20T10:30:00Z',
      duration: '12:45'
    },
    {
      id: '2',
      title: 'Demo Day Practice Session',
      basedOn: 'Demo Day Presentation',
      questionsCount: 5,
      status: 'in-progress',
      score: null,
      completedAt: null,
      duration: null
    },
    {
      id: '3',
      title: 'Investor Meeting Prep',
      basedOn: 'Series A Pitch Deck',
      questionsCount: 10,
      status: 'completed',
      score: 7.8,
      completedAt: '2024-01-18T09:15:00Z',
      duration: '15:20'
    }
  ]

  const sampleQuestions = [
    {
      category: 'Business Model',
      question: 'How do you plan to monetize your platform and what are your revenue projections for the next 3 years?',
      difficulty: 'Medium'
    },
    {
      category: 'Market Analysis',
      question: 'What is your total addressable market and how do you plan to capture market share?',
      difficulty: 'Hard'
    },
    {
      category: 'Competition',
      question: 'Who are your main competitors and what is your competitive advantage?',
      difficulty: 'Easy'
    },
    {
      category: 'Team',
      question: 'What experience does your team have in this industry and what key hires are you planning?',
      difficulty: 'Medium'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Badge className="bg-green-100 text-green-800">Easy</Badge>
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'Hard':
        return <Badge className="bg-red-100 text-red-800">Hard</Badge>
      default:
        return <Badge variant="secondary">{difficulty}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Layout title="Q&A Simulation">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Q&A Simulation</h1>
            <p className="text-muted-foreground">
              Practice with AI-generated investor questions based on your pitch.
            </p>
          </div>
          <Button>
            <Brain className="mr-2 h-4 w-4" />
            Start New Simulation
          </Button>
        </div>

        {/* How it Works */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">How Q&A Simulation Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-purple-900 mb-2">AI Analysis</h4>
                <p className="text-purple-700">
                  AI analyzes your pitch deck to generate relevant investor questions
                </p>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-blue-900 mb-2">Practice Session</h4>
                <p className="text-blue-700">
                  Answer questions and receive real-time feedback on your responses
                </p>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-green-900 mb-2">Improvement</h4>
                <p className="text-green-700">
                  Get detailed feedback and suggestions to improve your answers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Questions Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Questions</CardTitle>
            <CardDescription>
              Examples of AI-generated questions based on typical investor concerns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleQuestions.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{item.category}</Badge>
                    {getDifficultyBadge(item.difficulty)}
                  </div>
                  <p className="text-sm font-medium">{item.question}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Previous Simulations */}
        <Card>
          <CardHeader>
            <CardTitle>Previous Simulations</CardTitle>
            <CardDescription>
              Your Q&A practice sessions and performance history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {simulations.map((simulation) => (
                <div key={simulation.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-purple-100 p-2">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{simulation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Based on: {simulation.basedOn}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>{simulation.questionsCount} questions</span>
                          {simulation.duration && <span>Duration: {simulation.duration}</span>}
                          {simulation.completedAt && (
                            <span>Completed: {formatDate(simulation.completedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {simulation.score && (
                        <div className="text-right mr-4">
                          <div className="font-medium">{simulation.score}/10</div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                      )}
                      {getStatusBadge(simulation.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                      {simulation.status === 'completed' ? (
                        <Button variant="outline" size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          Review Session
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          Continue
                        </Button>
                      )}
                    </div>
                    
                    {simulation.status === 'completed' && (
                      <Button size="sm">
                        View Detailed Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {simulations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No simulations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first Q&A simulation to practice with AI-generated investor questions.
              </p>
              <Button>
                <Brain className="mr-2 h-4 w-4" />
                Start Your First Simulation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}