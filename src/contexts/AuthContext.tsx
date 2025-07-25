import React, { useEffect, useState } from 'react'
import { User, UserRole } from '../types'
import blink from '../lib/blink'
import { apiClient } from '../lib/api-config'
import { AuthContext, AuthContextType } from '../lib/auth-context'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get role from localStorage or default to 'founder'
  const getStoredRole = (): UserRole => {
    const stored = localStorage.getItem('pitchai-user-role')
    return (stored as UserRole) || 'founder'
  }

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setIsLoading(state.isLoading)
      
      if (state.user) {
        // Transform Blink user to our User type
        const userData: User = {
          id: state.user.id,
          email: state.user.email,
          displayName: state.user.displayName || state.user.email,
          role: getStoredRole(), // Get role from localStorage
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

  const switchRole = (newRole: UserRole) => {
    if (!user) return
    
    // Store role in localStorage
    localStorage.setItem('pitchai-user-role', newRole)
    
    // Update user state
    setUser(prev => prev ? { ...prev, role: newRole } : null)
    
    // Optionally refresh the page to update the sidebar and other role-dependent UI
    window.location.reload()
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    switchRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}