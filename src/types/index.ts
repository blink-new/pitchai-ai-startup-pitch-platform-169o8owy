export interface User {
  id: string
  email: string
  displayName?: string
  role: 'founder' | 'investor' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface PitchDeck {
  id: string
  userId: string
  title: string
  fileName: string
  fileUrl: string
  fileType: 'pdf' | 'ppt' | 'pptx'
  uploadedAt: string
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed'
  analysisResult?: PitchAnalysis
}

export interface PitchVideo {
  id: string
  userId: string
  title: string
  fileName: string
  fileUrl: string
  duration?: number
  uploadedAt: string
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed'
  transcription?: string
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed'
  analysisResult?: VideoAnalysis
}

export interface PitchAnalysis {
  id: string
  pitchDeckId: string
  overallScore: number
  clarity: {
    score: number
    feedback: string
  }
  storytelling: {
    score: number
    feedback: string
  }
  flow: {
    score: number
    feedback: string
  }
  keyStrengths: string[]
  areasForImprovement: string[]
  actionableRecommendations: string[]
  createdAt: string
}

export interface VideoAnalysis {
  id: string
  pitchVideoId: string
  overallScore: number
  speechPace: {
    score: number
    wordsPerMinute: number
    feedback: string
  }
  fillerWords: {
    count: number
    percentage: number
    feedback: string
  }
  confidence: {
    score: number
    feedback: string
  }
  tone: {
    score: number
    feedback: string
  }
  keyStrengths: string[]
  areasForImprovement: string[]
  actionableRecommendations: string[]
  createdAt: string
}

export interface InvestorQA {
  id: string
  userId: string
  pitchDeckId?: string
  pitchVideoId?: string
  questions: QAItem[]
  createdAt: string
}

export interface QAItem {
  question: string
  suggestedAnswer: string
  answerQuality: number
  tips: string[]
}

export interface PitchReport {
  id: string
  userId: string
  pitchDeckId?: string
  pitchVideoId?: string
  title: string
  overallScore: number
  deckAnalysis?: PitchAnalysis
  videoAnalysis?: VideoAnalysis
  investorQA?: InvestorQA
  createdAt: string
  updatedAt: string
  isShared: boolean
  shareToken?: string
}

export interface APIConfig {
  baseUrl: string
  endpoints: {
    auth: string
    upload: string
    analysis: string
    reports: string
    users: string
  }
}

export interface UploadProgress {
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}