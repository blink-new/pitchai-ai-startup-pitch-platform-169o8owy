import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Star,
  Building2,
  FileText
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalPitches: number
    averageScore: number
    highQualityPitches: number
    contactedStartups: number
    conversionRate: number
    totalFunding: string
  }
  trends: {
    pitchVolume: Array<{ month: string; count: number }>
    scoreDistribution: Array<{ range: string; count: number; percentage: number }>
    industryBreakdown: Array<{ industry: string; count: number; avgScore: number }>
    stageDistribution: Array<{ stage: string; count: number; funding: string }>
  }
  performance: {
    topPerformers: Array<{
      company: string
      founder: string
      score: number
      industry: string
      funding: string
      status: string
    }>
    recentActivity: Array<{
      action: string
      company: string
      date: string
      impact: 'positive' | 'neutral' | 'negative'
    }>
  }
}

export const InvestorAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('3m')
  const [selectedMetric, setSelectedMetric] = useState('score')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Mock analytics data
        const mockAnalytics: AnalyticsData = {
          overview: {
            totalPitches: 127,
            averageScore: 7.6,
            highQualityPitches: 23,
            contactedStartups: 15,
            conversionRate: 11.8,
            totalFunding: '$47.2M'
          },
          trends: {
            pitchVolume: [
              { month: 'Oct', count: 18 },
              { month: 'Nov', count: 24 },
              { month: 'Dec', count: 31 },
              { month: 'Jan', count: 54 }
            ],
            scoreDistribution: [
              { range: '9.0-10.0', count: 8, percentage: 6.3 },
              { range: '8.0-8.9', count: 15, percentage: 11.8 },
              { range: '7.0-7.9', count: 42, percentage: 33.1 },
              { range: '6.0-6.9', count: 38, percentage: 29.9 },
              { range: '5.0-5.9', count: 18, percentage: 14.2 },
              { range: '< 5.0', count: 6, percentage: 4.7 }
            ],
            industryBreakdown: [
              { industry: 'AI/ML', count: 28, avgScore: 8.2 },
              { industry: 'FinTech', count: 22, avgScore: 7.8 },
              { industry: 'HealthTech', count: 19, avgScore: 8.1 },
              { industry: 'CleanTech', count: 16, avgScore: 7.4 },
              { industry: 'EdTech', count: 14, avgScore: 7.6 },
              { industry: 'FoodTech', count: 12, avgScore: 7.2 },
              { industry: 'Other', count: 16, avgScore: 7.0 }
            ],
            stageDistribution: [
              { stage: 'Pre-Seed', count: 45, funding: '$12.4M' },
              { stage: 'Seed', count: 38, funding: '$18.7M' },
              { stage: 'Series A', count: 32, funding: '$24.1M' },
              { stage: 'Series B+', count: 12, funding: '$8.9M' }
            ]
          },
          performance: {
            topPerformers: [
              {
                company: 'HealthTech Pro',
                founder: 'Dr. Emily Watson',
                score: 9.2,
                industry: 'HealthTech',
                funding: '$1.5M',
                status: 'contacted'
              },
              {
                company: 'TechFlow AI',
                founder: 'Sarah Chen',
                score: 8.7,
                industry: 'AI/ML',
                funding: '$2M',
                status: 'reviewed'
              },
              {
                company: 'EduTech Innovations',
                founder: 'Lisa Park',
                score: 8.1,
                industry: 'EdTech',
                funding: '$800K',
                status: 'pending'
              },
              {
                company: 'GreenEnergy Solutions',
                founder: 'Michael Rodriguez',
                score: 7.9,
                industry: 'CleanTech',
                funding: '$500K',
                status: 'pending'
              }
            ],
            recentActivity: [
              {
                action: 'Contacted startup',
                company: 'HealthTech Pro',
                date: '2 hours ago',
                impact: 'positive'
              },
              {
                action: 'Downloaded report',
                company: 'TechFlow AI',
                date: '5 hours ago',
                impact: 'neutral'
              },
              {
                action: 'Pitch reviewed',
                company: 'EduTech Innovations',
                date: '1 day ago',
                impact: 'positive'
              },
              {
                action: 'Added to watchlist',
                company: 'GreenEnergy Solutions',
                date: '2 days ago',
                impact: 'positive'
              }
            ]
          }
        }

        setAnalytics(mockAnalytics)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

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

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'negative':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Analytics not available</h2>
        <p className="text-muted-foreground mt-2">Unable to load analytics data.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into pitch quality, trends, and investment opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pitches</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalPitches}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Star className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(analytics.overview.averageScore)}`}>
              {analytics.overview.averageScore}/10
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Quality</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.overview.highQualityPitches}</div>
            <p className="text-xs text-muted-foreground">
              Score ≥ 8.5 ({((analytics.overview.highQualityPitches / analytics.overview.totalPitches) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.contactedStartups}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+25%</span> engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Target className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Contact to investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalFunding}</div>
            <p className="text-xs text-muted-foreground">
              Across all pitches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pitch Volume Trend
                </CardTitle>
                <CardDescription>Monthly pitch submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.trends.pitchVolume.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(item.count / 60) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Industry Performance
                </CardTitle>
                <CardDescription>Average scores by industry sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.trends.industryBreakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.industry}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getScoreBgColor(item.avgScore)}>
                            {item.avgScore}/10
                          </Badge>
                          <span className="text-xs text-muted-foreground">({item.count})</span>
                        </div>
                      </div>
                      <Progress value={item.avgScore * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Distribution
                </CardTitle>
                <CardDescription>Distribution of pitch quality scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.trends.scoreDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.range}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.count} pitches</span>
                          <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Funding Stage Breakdown
                </CardTitle>
                <CardDescription>Distribution by funding stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.trends.stageDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.stage}</div>
                        <div className="text-sm text-muted-foreground">{item.count} companies</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{item.funding}</div>
                        <div className="text-xs text-muted-foreground">total funding</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Pitches
                </CardTitle>
                <CardDescription>Highest scoring pitches in your pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.topPerformers.map((pitch, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{pitch.company}</div>
                        <div className="text-sm text-muted-foreground">{pitch.founder}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{pitch.industry}</Badge>
                          <Badge variant="secondary" className="text-xs">{pitch.status}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getScoreBgColor(pitch.score)}>
                          {pitch.score}/10
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">{pitch.funding}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions and engagements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getImpactIcon(activity.impact)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.company}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Key trends and recommendations based on your activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Quality Trend Improving</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Average pitch quality has increased by 0.3 points over the last 3 months. 
                          AI/ML and HealthTech sectors are showing the strongest improvement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Opportunity Alert</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          3 high-scoring pitches (8.5+) in your preferred sectors are awaiting review. 
                          Consider prioritizing HealthTech Pro and TechFlow AI for immediate contact.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900">Portfolio Diversification</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Your current focus is heavily weighted toward AI/ML (35%). Consider exploring 
                          opportunities in CleanTech and EdTech for better portfolio balance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">Engagement Optimization</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Your conversion rate from contact to investment is 11.8%, above industry average. 
                          Focus on pitches scoring 8.0+ for optimal ROI on your time investment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}