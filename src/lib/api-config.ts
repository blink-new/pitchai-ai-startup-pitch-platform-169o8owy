import { APIConfig } from '../types'

// Configurable API endpoints - easily replaceable for different backend deployments
export const apiConfig: APIConfig = {
  baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
  endpoints: {
    auth: '/api/auth',
    upload: '/api/upload',
    analysis: '/api/analysis',
    reports: '/api/reports',
    users: '/api/users'
  }
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: keyof APIConfig['endpoints'], path?: string): string => {
  const baseEndpoint = apiConfig.endpoints[endpoint]
  const fullPath = path ? `${baseEndpoint}${path}` : baseEndpoint
  return `${apiConfig.baseUrl}${fullPath}`
}

// API client with configurable base URL
export class APIClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || apiConfig.baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    return headers
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  async uploadFile(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (error) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('POST', `${this.baseUrl}${endpoint}`)
      
      if (this.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`)
      }
      
      xhr.send(formData)
    })
  }
}

export const apiClient = new APIClient()