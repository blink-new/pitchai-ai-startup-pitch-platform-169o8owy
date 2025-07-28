import { blink } from '../lib/blink'
import { PitchReport, PitchAnalysis, VideoAnalysis, InvestorQA } from '../types'
import { AIService } from './aiService'

export class ReportService {
  // Generate comprehensive pitch report
  static async generatePitchReport(
    userId: string,
    title: string,
    pitchDeckId?: string,
    pitchVideoId?: string
  ): Promise<PitchReport> {
    try {
      let deckAnalysis: PitchAnalysis | undefined
      let videoAnalysis: VideoAnalysis | undefined
      let investorQA: InvestorQA | undefined

      // Get deck analysis if provided
      if (pitchDeckId) {
        const analyses = await blink.db.pitchAnalyses.list({
          where: { pitchDeckId },
          limit: 1
        })
        deckAnalysis = analyses[0]
      }

      // Get video analysis if provided
      if (pitchVideoId) {
        const analyses = await blink.db.videoAnalyses.list({
          where: { pitchVideoId },
          limit: 1
        })
        videoAnalysis = analyses[0]
      }

      // Generate investor Q&A based on available content
      if (deckAnalysis || videoAnalysis) {
        // Get original content for Q&A generation
        let deckText = ''
        let videoTranscription = ''

        if (pitchDeckId) {
          const decks = await blink.db.pitchDecks.list({
            where: { id: pitchDeckId },
            limit: 1
          })
          if (decks[0]?.fileUrl) {
            try {
              deckText = await AIService.extractTextFromDocument(decks[0].fileUrl)
            } catch (error) {
              console.warn('Could not extract deck text for Q&A generation')
            }
          }
        }

        if (pitchVideoId) {
          const videos = await blink.db.pitchVideos.list({
            where: { id: pitchVideoId },
            limit: 1
          })
          videoTranscription = videos[0]?.transcription || ''
        }

        if (deckText || videoTranscription) {
          investorQA = await AIService.generateInvestorQA(deckText, videoTranscription)
          investorQA.userId = userId
          investorQA.pitchDeckId = pitchDeckId
          investorQA.pitchVideoId = pitchVideoId

          // Save Q&A to database
          await blink.db.investorQAs.create(investorQA)
        }
      }

      // Calculate overall score
      const scores = [
        deckAnalysis?.overallScore,
        videoAnalysis?.overallScore
      ].filter(Boolean) as number[]

      const overallScore = scores.length > 0 
        ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
        : 0

      // Create report
      const report: PitchReport = {
        id: `report_${Date.now()}`,
        userId,
        pitchDeckId,
        pitchVideoId,
        title,
        overallScore,
        deckAnalysis,
        videoAnalysis,
        investorQA,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isShared: false
      }

      // Save report to database
      await blink.db.pitchReports.create(report)

      return report
    } catch (error) {
      console.error('Error generating pitch report:', error)
      throw new Error('Failed to generate pitch report')
    }
  }

  // Get user's reports
  static async getUserReports(userId: string): Promise<PitchReport[]> {
    try {
      const reports = await blink.db.pitchReports.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
      return reports
    } catch (error) {
      console.error('Error fetching user reports:', error)
      return []
    }
  }

  // Get report by ID
  static async getReportById(reportId: string): Promise<PitchReport | null> {
    try {
      const reports = await blink.db.pitchReports.list({
        where: { id: reportId },
        limit: 1
      })
      return reports[0] || null
    } catch (error) {
      console.error('Error fetching report:', error)
      return null
    }
  }

  // Share report (generate share token)
  static async shareReport(reportId: string): Promise<string> {
    try {
      const shareToken = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await blink.db.pitchReports.update(reportId, {
        isShared: true,
        shareToken,
        updatedAt: new Date().toISOString()
      })

      return shareToken
    } catch (error) {
      console.error('Error sharing report:', error)
      throw new Error('Failed to share report')
    }
  }

  // Get shared report by token
  static async getSharedReport(shareToken: string): Promise<PitchReport | null> {
    try {
      const reports = await blink.db.pitchReports.list({
        where: { shareToken, isShared: true },
        limit: 1
      })
      return reports[0] || null
    } catch (error) {
      console.error('Error fetching shared report:', error)
      return null
    }
  }

  // Export report as PDF (placeholder - would need PDF generation library)
  static async exportReportAsPDF(report: PitchReport): Promise<Blob> {
    // This is a placeholder implementation
    // In production, you'd use a library like jsPDF or html2pdf
    const htmlContent = ReportService.generateReportHTML(report)
    
    // For now, return as HTML blob
    return new Blob([htmlContent], { type: 'text/html' })
  }

  // Generate HTML content for report
  private static generateReportHTML(report: PitchReport): string {
    const { deckAnalysis, videoAnalysis, investorQA } = report
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>PitchAI Report - ${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .score { font-size: 2em; color: #6366F1; font-weight: bold; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1F2937; border-bottom: 2px solid #6366F1; padding-bottom: 10px; }
        .feedback { background: #F9FAFB; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .recommendations { background: #FEF3C7; padding: 15px; border-radius: 8px; }
        .qa-item { margin-bottom: 20px; padding: 15px; border: 1px solid #E5E7EB; border-radius: 8px; }
        .question { font-weight: bold; color: #1F2937; margin-bottom: 10px; }
        .answer { color: #4B5563; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PitchAI Analysis Report</h1>
        <h2>${report.title}</h2>
        <div class="score">Overall Score: ${report.overallScore}/10</div>
        <p>Generated on ${new Date(report.createdAt).toLocaleDateString()}</p>
    </div>

    ${deckAnalysis ? `
    <div class="section">
        <h2>Pitch Deck Analysis</h2>
        <div class="feedback">
            <h3>Clarity (${deckAnalysis.clarity.score}/10)</h3>
            <p>${deckAnalysis.clarity.feedback}</p>
        </div>
        <div class="feedback">
            <h3>Storytelling (${deckAnalysis.storytelling.score}/10)</h3>
            <p>${deckAnalysis.storytelling.feedback}</p>
        </div>
        <div class="feedback">
            <h3>Flow (${deckAnalysis.flow.score}/10)</h3>
            <p>${deckAnalysis.flow.feedback}</p>
        </div>
        
        <h3>Key Strengths</h3>
        <ul>
            ${deckAnalysis.keyStrengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
        
        <h3>Areas for Improvement</h3>
        <ul>
            ${deckAnalysis.areasForImprovement.map(area => `<li>${area}</li>`).join('')}
        </ul>
        
        <div class="recommendations">
            <h3>Actionable Recommendations</h3>
            <ul>
                ${deckAnalysis.actionableRecommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
    ` : ''}

    ${videoAnalysis ? `
    <div class="section">
        <h2>Video Delivery Analysis</h2>
        <div class="feedback">
            <h3>Speech Pace (${videoAnalysis.speechPace.score}/10)</h3>
            <p>Words per minute: ${videoAnalysis.speechPace.wordsPerMinute}</p>
            <p>${videoAnalysis.speechPace.feedback}</p>
        </div>
        <div class="feedback">
            <h3>Filler Words</h3>
            <p>Count: ${videoAnalysis.fillerWords.count} (${videoAnalysis.fillerWords.percentage}%)</p>
            <p>${videoAnalysis.fillerWords.feedback}</p>
        </div>
        <div class="feedback">
            <h3>Confidence (${videoAnalysis.confidence.score}/10)</h3>
            <p>${videoAnalysis.confidence.feedback}</p>
        </div>
        <div class="feedback">
            <h3>Tone (${videoAnalysis.tone.score}/10)</h3>
            <p>${videoAnalysis.tone.feedback}</p>
        </div>
        
        <h3>Key Strengths</h3>
        <ul>
            ${videoAnalysis.keyStrengths.map(strength => `<li>${strength}</li>`).join('')}
        </ul>
        
        <h3>Areas for Improvement</h3>
        <ul>
            ${videoAnalysis.areasForImprovement.map(area => `<li>${area}</li>`).join('')}
        </ul>
        
        <div class="recommendations">
            <h3>Actionable Recommendations</h3>
            <ul>
                ${videoAnalysis.actionableRecommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
    ` : ''}

    ${investorQA ? `
    <div class="section">
        <h2>Investor Q&A Simulation</h2>
        <p>Practice these common investor questions to improve your pitch readiness:</p>
        ${investorQA.questions.map((qa, index) => `
            <div class="qa-item">
                <div class="question">Q${index + 1}: ${qa.question}</div>
                <div class="answer"><strong>Suggested Answer:</strong> ${qa.suggestedAnswer}</div>
                <div><strong>Answer Quality Score:</strong> ${qa.answerQuality}/10</div>
                <div><strong>Tips:</strong></div>
                <ul>
                    ${qa.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <p><em>This report was generated by PitchAI - AI-powered pitch analysis platform</em></p>
    </div>
</body>
</html>
    `
  }
}