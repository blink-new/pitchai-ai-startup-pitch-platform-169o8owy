import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { 
  BarChart3, 
  FileText, 
  Home, 
  MessageSquare, 
  Settings, 
  Upload, 
  Users, 
  Video,
  TrendingUp,
  Search
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user } = useAuth()

  const getNavigationItems = () => {
    const commonItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home
      }
    ]

    if (user?.role === 'founder') {
      return [
        ...commonItems,
        {
          title: 'Upload Pitch',
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
    }

    if (user?.role === 'investor') {
      return [
        ...commonItems,
        {
          title: 'Browse Pitches',
          href: '/browse',
          icon: Search
        },
        {
          title: 'Pitch Reports',
          href: '/pitch-reports',
          icon: BarChart3
        },
        {
          title: 'Analytics',
          href: '/analytics',
          icon: TrendingUp
        }
      ]
    }

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        {
          title: 'User Management',
          href: '/admin/users',
          icon: Users
        },
        {
          title: 'Platform Analytics',
          href: '/admin/analytics',
          icon: BarChart3
        },
        {
          title: 'Content Management',
          href: '/admin/content',
          icon: FileText
        },
        {
          title: 'Settings',
          href: '/admin/settings',
          icon: Settings
        }
      ]
    }

    return commonItems
  }

  const navigationItems = getNavigationItems()

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