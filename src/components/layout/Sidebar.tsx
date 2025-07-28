import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { 
  BarChart3, 
  FileText, 
  Home, 
  MessageSquare, 
  Upload, 
  Video
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      title: 'Upload & Analyze',
      href: '/upload',
      icon: Upload
    },
    {
      title: 'My Pitches',
      href: '/pitches',
      icon: FileText
    },
    {
      title: 'Video Analysis',
      href: '/videos',
      icon: Video
    },
    {
      title: 'Q&A Simulation',
      href: '/qa-simulation',
      icon: MessageSquare
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: BarChart3
    }
  ]

  return (
    <div className={cn('flex h-full w-64 flex-col bg-card border-r', className)}>
      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}