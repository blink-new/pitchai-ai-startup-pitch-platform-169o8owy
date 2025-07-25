import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Star, 
  Search, 
  Filter,
  Download,
  Eye,
  Calendar,
  Building2,
  ArrowUpRight,
  Mail,
  Phone
} from 'lucide-react'
import { blink } from '../lib/blink'

export const InvestorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all')
  const [pitches, setPitches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for investor dashboard
  const stats = [
    {
      title: 'Pitches Reviewed',
      value: '127',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'High-Quality Pitches',
      value: '23',
      change: '+8%',
      icon: Star,
      color: 'text-amber-600'
    },
    {
      title: 'Startups Contacted',
      value: '15',
      change: '+25%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Investment Pipeline',
      value: '$2.4M',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ]

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        // In a real app, this would fetch from the database
        // For now, we'll use mock data
        const mockPitches = [
          {
            id: 1,
            companyName: 'TechFlow AI',
            founder: 'Sarah Chen',
            founderEmail: 'sarah.chen@techflow.ai',
            industry: 'AI/ML',
            stage: 'Series A',
            score: 8.7,
            funding: '$2M',
            uploadDate: '2024-01-20',
            status: 'reviewed',
            description: 'AI-powered data processing platform for enterprises'
          },
          {
            id: 2,
            companyName: 'GreenEnergy Solutions',
            founder: 'Michael Rodriguez',
            founderEmail: 'michael@greenenergy.com',
            industry: 'CleanTech',
            stage: 'Seed',
            score: 7.9,
            funding: '$500K',
            uploadDate: '2024-01-19',
            status: 'pending',
            description: 'Renewable energy solutions for residential markets'
          },
          {
            id: 3,
            companyName: 'HealthTech Pro',
            founder: 'Dr. Emily Watson',
            founderEmail: 'emily@healthtechpro.com',
            industry: 'HealthTech',
            stage: 'Pre-Seed',
            score: 9.2,
            funding: '$1.5M',
            uploadDate: '2024-01-18',
            status: 'contacted',
            description: 'AI-driven diagnostic tools for healthcare providers'
          },
          {
            id: 4,
            companyName: 'FinanceBot',
            founder: 'Alex Thompson',
            founderEmail: 'alex@financebot.ai',
            industry: 'FinTech',
            stage: 'Series A',
            score: 6.8,
            funding: '$3M',
            uploadDate: '2024-01-17',
            status: 'reviewed',
            description: 'Automated financial advisory platform'
          },
          {
            id: 5,
            companyName: 'EduTech Innovations',
            founder: 'Lisa Park',
            founderEmail: 'lisa@edutech.com',
            industry: 'EdTech',
            stage: 'Seed',
            score: 8.1,
            funding: '$800K',
            uploadDate: '2024-01-16',
            status: 'pending',
            description: 'Personalized learning platform for K-12 education'
          },
          {
            id: 6,
            companyName: 'FoodTech Labs',
            founder: 'James Wilson',
            founderEmail: 'james@foodtechlabs.com',
            industry: 'FoodTech',
            stage: 'Pre-Seed',
            score: 7.3,
            funding: '$400K',
            uploadDate: '2024-01-15',
            status: 'reviewed',
            description: 'Sustainable food production using vertical farming'
          }
        ]
        
        setPitches(mockPitches)
      } catch (error) {
        console.error('Error fetching pitches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPitches()
  }, [])

  const filteredPitches = pitches.filter(pitch => {
    const matchesSearch = pitch.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pitch.founder.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || pitch.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
    const matchesStage = selectedStage === 'all' || pitch.stage.toLowerCase().replace('-', ' ').includes(selectedStage.toLowerCase().replace('-', ' '))
    
    return matchesSearch && matchesIndustry && matchesStage
  })

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-100 text-green-800'
    if (score >= 7.0) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investor Dashboard</h1>
        <p className="text-muted-foreground">
          Discover and evaluate high-quality startup pitches with AI-powered insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Startup Pitches
          </CardTitle>
          <CardDescription>
            Browse and filter startup pitches based on AI analysis scores and criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies, founders..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="ai">AI/ML</SelectItem>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthtech">HealthTech</SelectItem>
                  <SelectItem value="cleantech">CleanTech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="foodtech">FoodTech</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B+</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pitches Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Company
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Industry
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Stage
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    AI Score
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Funding
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground mt-2">Loading pitches...</p>
                    </td>
                  </tr>
                ) : filteredPitches.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <p className="text-muted-foreground">No pitches found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPitches.map((pitch) => (
                    <tr key={pitch.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{pitch.companyName}</div>
                          <div className="text-sm text-muted-foreground">{pitch.founder}</div>
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                            {pitch.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{pitch.industry}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{pitch.stage}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getScoreColor(pitch.score)}>
                          {pitch.score}/10
                        </Badge>
                      </td>
                      <td className="p-4 font-medium">{pitch.funding}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(pitch.uploadDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(pitch.status)}>
                          {pitch.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/pitch/${pitch.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Mock download functionality
                              const element = document.createElement('a')
                              element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Pitch Report - ${pitch.companyName}`)
                              element.download = `${pitch.companyName}_Report.pdf`
                              element.click()
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`mailto:${pitch.founderEmail}?subject=Interest in ${pitch.companyName}`)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investment Pipeline</CardTitle>
            <CardDescription>
              Track your investment opportunities and decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Due Diligence</span>
                <Badge variant="secondary">8 companies</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Term Sheet Sent</span>
                <Badge variant="secondary">3 companies</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Negotiating</span>
                <Badge variant="secondary">2 companies</Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Full Pipeline
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Insights</CardTitle>
            <CardDescription>
              Latest AI analysis trends and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Top Performing Sectors:</span>
                <div className="mt-1 flex gap-1">
                  <Badge variant="outline" className="text-xs">AI/ML</Badge>
                  <Badge variant="outline" className="text-xs">HealthTech</Badge>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Average Pitch Score:</span>
                <span className="ml-2 font-mono">7.6/10</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Quality Trend:</span>
                <span className="ml-2 text-green-600">↗ Improving</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}