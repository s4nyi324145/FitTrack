'use client'

import { LayoutDashboard, Dumbbell, Utensils, TrendingUp, ScrollText, Trophy } from 'lucide-react'
import { useDynamicRouteParams } from 'next/dist/server/app-render/dynamic-rendering'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { name: "Workouts",  icon: <Dumbbell size={18} />,        href: "/workouts"  },
  { name: "Nutrition", icon: <Utensils size={18} />,        href: "/nutrition" },
  { name: "Progress",  icon: <TrendingUp size={18} />,      href: "/progress"  },
  { name: "Exercises", icon: <ScrollText size={18} />,      href: "/exercises" },
  { name: "Goals",     icon: <Trophy size={18} />,          href: "/goals"     },
]

const Navbar = () => {
  const pathname = usePathname()
  
  

  return (
    <div className="flex flex-col w-[200] max-h-screen  shrink-0 min-h-screen bg-sidebar p-4 justify-between">
      
      {/* Logo */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Dumbbell size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">FitTrack</p>
            <p className="text-xs text-text-muted">Elite Performance</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href 
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-foreground hover:bg-text-muted/10"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

     
      <Link
        href="/workouts/new"
        className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover transition-colors text-white font-bold text-sm rounded-md py-3"
      >
        + Log Workout
      </Link>

    </div>
  )
}

export default Navbar