'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  userName: string | null
  login: (name: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const login = (name: string, password: string): boolean => {
    // Simple password check
    if (password === 'Meditate123@') {
      setIsAdmin(true)
      setIsAuthenticated(true)
      setUserName('Admin')
      return true
    } else if (password === 'HM') {
      setIsAdmin(false)
      setIsAuthenticated(true)
      setUserName(name)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    setUserName(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
