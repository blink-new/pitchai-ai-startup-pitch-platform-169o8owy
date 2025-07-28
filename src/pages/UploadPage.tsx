import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { 
  Upload, 
  FileText, 
  Video, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { UploadProgress } from '../types'

export const UploadPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false)
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [title, setTitle] = useState('')

  const simulateUpload = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      
      setUploads(prev => prev.map(upload => 
        upload.fileName === fileName 
          ? { ...upload, progress: Math.min(progress, 100) }
          : upload
      ))

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setUploads(prev => prev.map(upload => 
            upload.fileName === fileName 
              ? { ...upload, status: 'processing' }
              : upload
          ))
          
          // Simulate processing
          setTimeout(() => {
            setUploads(prev => prev.map(upload => 
              upload.fileName === fileName 
                ? { ...upload, status: 'completed' }
                : upload
            ))
          }, 3000)
        }, 500)
      }
    }, 200)
  }

  const handleFiles = useCallback((files: File[]) => {
    files.forEach(file => {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo'
      ]

      if (!validTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please upload PDF, PPT, PPTX, MP4, MOV, or AVI files.`)
        return
      }

      // Check file size (max 100MB for videos, 10MB for documents)
      const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`File size too large. Maximum size is ${file.type.startsWith('video/') ? '100MB' : '10MB'}.`)
        return
      }

      // Add to uploads
      const uploadItem: UploadProgress = {
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }

      setUploads(prev => [...prev, uploadItem])

      // Simulate upload progress
      simulateUpload(file.name)
    })
  }, [])

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

  const removeUpload = (fileName: string) => {
    setUploads(prev => prev.filter(upload => upload.fileName !== fileName))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['mp4', 'mov', 'avi'].includes(extension || '')) {
      return <Video className="h-5 w-5 text-green-600" />
    }
    return <FileText className="h-5 w-5 text-blue-600" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
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
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Ready for Analysis</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <Layout title="Upload Pitch">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Upload Your Pitch</h1>
          <p className="text-muted-foreground">
            Upload your pitch deck (PDF/PPT) and pitch video for AI-powered analysis
          </p>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Drag and drop your files or click to browse. Supported formats: PDF, PPT, PPTX, MP4, MOV, AVI
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
                Track the progress of your file uploads and processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploads.map((upload, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(upload.fileName)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium truncate">{upload.fileName}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(upload.status)}
                          {getStatusBadge(upload.status)}
                        </div>
                      </div>
                      
                      {upload.status === 'uploading' && (
                        <div className="space-y-1">
                          <Progress value={upload.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {Math.round(upload.progress)}% uploaded
                          </p>
                        </div>
                      )}
                      
                      {upload.status === 'processing' && (
                        <p className="text-sm text-muted-foreground">
                          Processing file for analysis...
                        </p>
                      )}
                      
                      {upload.status === 'completed' && (
                        <p className="text-sm text-green-600">
                          Ready for analysis! Click "Start Analysis" to begin.
                        </p>
                      )}
                      
                      {upload.error && (
                        <p className="text-sm text-red-600">{upload.error}</p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.fileName)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {uploads.some(u => u.status === 'completed') && (
                <div className="mt-6 flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    Start Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}