import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Upload, FileText, Video, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { blink } from '../lib/blink'
import { useAuth } from '../hooks/useAuth'

interface TestStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message: string
  error?: string
}

export const TestUploadPage: React.FC = () => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [steps, setSteps] = useState<TestStep[]>([])

  const updateStep = (index: number, updates: Partial<TestStep>) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, ...updates } : step
    ))
  }

  const addStep = (step: TestStep) => {
    setSteps(prev => [...prev, step])
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setSteps([])

    // Initialize steps
    const initialSteps: TestStep[] = [
      { name: 'File Upload', status: 'pending', message: 'Waiting to start...' },
      { name: 'Text Extraction', status: 'pending', message: 'Waiting to start...' },
      { name: 'AI Analysis', status: 'pending', message: 'Waiting to start...' },
      { name: 'Database Save', status: 'pending', message: 'Waiting to start...' }
    ]
    setSteps(initialSteps)

    try {
      // Step 1: File Upload
      updateStep(0, { status: 'running', message: 'Uploading file to storage...' })
      
      const { publicUrl } = await blink.storage.upload(
        file,
        `test-uploads/${user.id}/${Date.now()}-${file.name}`,
        { upsert: true }
      )
      
      updateStep(0, { 
        status: 'success', 
        message: `File uploaded successfully: ${publicUrl.substring(0, 50)}...` 
      })

      // Step 2: Text Extraction (only for documents)
      if (file.type.includes('pdf') || file.type.includes('presentation')) {
        updateStep(1, { status: 'running', message: 'Extracting text from document...' })
        
        try {
          const extractedText = await blink.data.extractFromUrl(publicUrl)
          updateStep(1, { 
            status: 'success', 
            message: `Text extracted successfully (${extractedText.length} characters)` 
          })
          
          // Step 3: AI Analysis
          updateStep(2, { status: 'running', message: 'Running AI analysis...' })
          
          try {
            const { text: analysis } = await blink.ai.generateText({
              prompt: `Analyze this pitch deck content and provide a brief summary and score out of 10:\n\n${extractedText.substring(0, 1000)}`,
              model: 'gpt-4o-mini',
              maxTokens: 500
            })
            
            updateStep(2, { 
              status: 'success', 
              message: `AI Analysis completed: ${analysis.substring(0, 100)}...` 
            })
            
          } catch (aiError) {
            console.error('AI Analysis error:', aiError)
            updateStep(2, { 
              status: 'error', 
              message: 'AI analysis failed',
              error: aiError instanceof Error ? aiError.message : 'Unknown AI error'
            })
          }
          
        } catch (extractError) {
          console.error('Text extraction error:', extractError)
          updateStep(1, { 
            status: 'error', 
            message: 'Text extraction failed',
            error: extractError instanceof Error ? extractError.message : 'Unknown extraction error'
          })
          // Skip AI analysis if extraction fails
          updateStep(2, { status: 'error', message: 'Skipped due to extraction failure' })
        }
      } else {
        updateStep(1, { status: 'success', message: 'Skipped (not a document)' })
        updateStep(2, { status: 'success', message: 'Skipped (video file)' })
      }

      // Step 4: Database Save
      updateStep(3, { status: 'running', message: 'Saving to database...' })
      
      try {
        const testRecord = {
          id: `test_${Date.now()}`,
          userId: user.id,
          title: file.name,
          fileName: file.name,
          fileUrl: publicUrl,
          fileType: file.type.includes('pdf') ? 'pdf' as const : 
                    file.type.includes('presentation') ? 'pptx' as const : 'ppt' as const,
          uploadedAt: new Date().toISOString(),
          analysisStatus: 'completed' as const
        }

        await blink.db.pitchDecks.create(testRecord)
        updateStep(3, { status: 'success', message: 'Database record created successfully!' })
        
      } catch (dbError) {
        console.error('Database error:', dbError)
        updateStep(3, { 
          status: 'error', 
          message: 'Database save failed',
          error: dbError instanceof Error ? dbError.message : 'Unknown database error'
        })
      }

    } catch (err) {
      console.error('Upload test error:', err)
      // Update any pending steps to error
      setSteps(prev => prev.map(step => 
        step.status === 'pending' || step.status === 'running' 
          ? { ...step, status: 'error' as const, message: 'Failed due to previous error' }
          : step
      ))
    } finally {
      setUploading(false)
    }
  }

  const getStepIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getStepColor = (status: TestStep['status']) => {
    switch (status) {
      case 'running':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Layout title="Test Upload">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Test Upload & Analysis</h1>
          <p className="text-muted-foreground">
            Test the upload and analysis functionality step by step
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Test</CardTitle>
            <CardDescription>
              Upload a file to test each step of the process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-file">Select File</Label>
              <Input
                id="test-file"
                type="file"
                accept=".pdf,.ppt,.pptx,.mp4,.mov,.avi"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>

            {steps.length > 0 && (
              <Card className="bg-gray-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-4">Test Progress:</h4>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {getStepIcon(step.status)}
                        <div className="flex-1">
                          <div className={`font-medium ${getStepColor(step.status)}`}>
                            {step.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {step.message}
                          </div>
                          {step.error && (
                            <div className="text-sm text-red-600 mt-1">
                              Error: {step.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-sm text-gray-600">
              <p><strong>Supported formats:</strong></p>
              <ul className="list-disc list-inside mt-1">
                <li>Documents: PDF, PPT, PPTX (will extract text and run AI analysis)</li>
                <li>Videos: MP4, MOV, AVI (will skip text extraction and AI analysis)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}