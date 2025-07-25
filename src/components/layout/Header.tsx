import React from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Badge } from '../ui/badge'
import { Brain, LogOut, Settings, User, UserCheck, Building2, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types'

interface HeaderProps {
  title?: string
}

export const Header: React.FC<HeaderProps> = ({ title = 'PitchAI' }) => {
  const { user, logout, switchRole } = useAuth()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'investor':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'admin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'founder':
        return <UserCheck className="mr-2 h-4 w-4" />
      case 'investor':
        return <Building2 className="mr-2 h-4 w-4" />
      case 'admin':
        return <Shield className="mr-2 h-4 w-4" />
      default:
        return <User className="mr-2 h-4 w-4" />
    }
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    if (switchRole) {
      switchRole(newRole)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.displayName} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Role Switcher */}
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Switch Role
                  </div>
                  <DropdownMenuItem 
                    onClick={() => handleRoleSwitch('founder')}
                    className={user.role === 'founder' ? 'bg-accent' : ''}
                  >
                    {getRoleIcon('founder')}
                    <span>Founder</span>
                    {user.role === 'founder' && <Badge variant="secondary" className="ml-auto">Current</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleSwitch('investor')}
                    className={user.role === 'investor' ? 'bg-accent' : ''}
                  >
                    {getRoleIcon('investor')}
                    <span>Investor</span>
                    {user.role === 'investor' && <Badge variant="secondary" className="ml-auto">Current</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleSwitch('admin')}
                    className={user.role === 'admin' ? 'bg-accent' : ''}
                  >
                    {getRoleIcon('admin')}
                    <span>Admin</span>
                    {user.role === 'admin' && <Badge variant="secondary" className="ml-auto">Current</Badge>}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}