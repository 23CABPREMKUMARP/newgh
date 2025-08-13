"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GitHubStats {
  commits: number
  repositories: number
  contributions: number
  lastUpdate: string
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats>({
    commits: 0,
    repositories: 0,
    contributions: 0,
    lastUpdate: new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate real-time GitHub stats (replace with actual API call)
    const fetchStats = () => {
      setTimeout(() => {
        setStats({
          commits: Math.floor(Math.random() * 1000) + 500,
          repositories: Math.floor(Math.random() * 50) + 20,
          contributions: Math.floor(Math.random() * 2000) + 1000,
          lastUpdate: new Date().toISOString(),
        })
        setIsLoading(false)
      }, 2000)
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-slate-800/90 border-violet-500/30 holographic">
        <CardHeader>
          <CardTitle className="text-violet-300">Loading GitHub Stats...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-violet-500/20 rounded"></div>
            <div className="h-4 bg-violet-500/20 rounded w-3/4"></div>
            <div className="h-4 bg-violet-500/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/90 border-violet-500/30 holographic neon-glow">
      <CardHeader>
        <CardTitle className="text-violet-300 font-mono">Live GitHub Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.commits}</div>
            <div className="text-sm text-slate-400">Commits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.repositories}</div>
            <div className="text-sm text-slate-400">Repositories</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-violet-400">{stats.contributions}</div>
          <div className="text-sm text-slate-400">Total Contributions</div>
        </div>
        <div className="text-xs text-slate-500 text-center font-mono">
          Last updated: {new Date(stats.lastUpdate).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
