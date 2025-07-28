import React, { useEffect, useState } from 'react'
import { User } from '../types'
import blink from '../lib/blink'
import { apiClient } from '../lib/api-config'
import { AuthContext, AuthContextType } from '../lib/auth-context'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setIsLoading(state.isLoading)
      
      if (state.user) {
        // Transform Blink user to our User type - always set role as 'founder'
        const userData: User = {
          id: state.user.id,
          email: state.user.email,
          displayName: state.user.displayName || state.user.email,
          role: 'founder', // Fixed role for founder-only platform
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setUser(userData)
        
        // Set token for API client
        if (state.tokens?.accessToken) {
          apiClient.setToken(state.tokens.accessToken)
        }
      } else {
        setUser(null)
        apiClient.setToken('')
      }
    })

    return unsubscribe
  }, [])

  const login = () => {
    blink.auth.login()
  }

  const logout = () => {
    blink.auth.logout()
    setUser(null)
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return
    
    try {
      // Update in Blink
      await blink.auth.updateMe({
        displayName: userData.displayName
      })
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null)
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}