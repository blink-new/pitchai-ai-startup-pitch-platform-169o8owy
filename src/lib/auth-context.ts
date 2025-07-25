import { createContext } from 'react'
import { User, UserRole } from '../types'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  switchRole: (role: UserRole) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)