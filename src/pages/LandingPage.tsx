import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Brain, 
  FileText, 
  Video, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export const LandingPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth()

  const features = [
    {
      icon: FileText,
      title: 'Pitch Deck Analysis',
      description: 'AI-powered analysis of your slide content for clarity, storytelling, and impact.',
      color: 'text-blue-600'
    },
    {
      icon: Video,
      title: 'Video Speech Analysis',
      description: 'Analyze delivery quality, pace, confidence, and eliminate filler words.',
      color: 'text-green-600'
    },
    {
      icon: MessageSquare,
      title: 'Investor Q&A Simulation',
      description: 'Practice with AI-generated investor questions and get feedback on your answers.',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Reports',
      description: 'Detailed analytics and actionable recommendations to improve your pitch.',
      color: 'text-orange-600'
    },
    {
      icon: Users,
      title: 'Investor Screening',
      description: 'Investors get automated quality reports to efficiently screen startups.',
      color: 'text-red-600'
    },
    {
      icon: Zap,
      title: 'Real-time Feedback',
      description: 'Get instant AI-powered insights and iterate quickly on your pitch.',
      color: 'text-yellow-600'
    }
  ]

  const benefits = [
    'Improve pitch clarity and storytelling',
    'Practice delivery and build confidence',
    'Get investor-ready with Q&A preparation',
    'Save time with automated analysis',
    'Track progress across iterations',
    'Share professional reports with investors'
  ]

  if (isAuthenticated) {
    window.location.href = '/dashboard'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">PitchAI</h1>
          </div>
          <Button onClick={login} className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Pitch Analysis
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Perfect Your Startup Pitch with{' '}
            <span className="gradient-bg bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Upload your pitch deck and video to get instant AI-powered feedback on content, 
            delivery, and investor readiness. Practice with simulated Q&A sessions and 
            track your progress.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              onClick={login}
              className="bg-primary hover:bg-primary/90"
            >
              Start Analyzing Your Pitch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Everything You Need to Nail Your Pitch
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive AI analysis for both founders and investors
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className={`mb-2 w-fit rounded-lg bg-muted p-2 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold">
                  Why Choose PitchAI?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Get the competitive edge you need to succeed in today's startup landscape. 
                  Our AI analyzes thousands of successful pitches to give you actionable insights.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Card className="border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>Sample Analysis Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Score</span>
                      <Badge className="bg-green-100 text-green-800">8.5/10</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Clarity</span>
                        <span>9/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[90%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storytelling</span>
                        <span>8/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[80%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Delivery</span>
                        <span>8.5/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[85%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Perfect Your Pitch?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of founders who have improved their pitch success rate with PitchAI.
          </p>
          <Button 
            size="lg" 
            onClick={login}
            className="bg-primary hover:bg-primary/90"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">PitchAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 PitchAI. All rights reserved. Powered by advanced AI technology.
          </p>
        </div>
      </footer>
    </div>
  )
}