"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TerminalProjectCardProps {
  title: string
  description: string
  techStack: string[]
  isTerminalMode: boolean
}

export default function TerminalProjectCard({
  title,
  description,
  techStack,
  isTerminalMode,
}: TerminalProjectCardProps) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  const terminalText = `
$ cat project_info.txt
Project: ${title}
Description: ${description}
Tech Stack: ${techStack.join(", ")}
Status: Active
$ _`

  useEffect(() => {
    if (isTerminalMode) {
      let i = 0
      const timer = setInterval(() => {
        if (i < terminalText.length) {
          setDisplayText(terminalText.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 50)
      return () => clearInterval(timer)
    }
  }, [isTerminalMode, terminalText])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  if (isTerminalMode) {
    return (
      <Card className="bg-slate-900/90 border-violet-500/30 holographic">
        <CardContent className="p-6">
          <div className="font-mono text-green-400 text-sm whitespace-pre-wrap">
            {displayText}
            {showCursor && <span className="terminal-cursor">|</span>}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/90 border-violet-500/30 hover:border-violet-400/50 transition-all duration-300 neon-glow">
      <CardHeader>
        <h3 className="text-xl font-bold text-violet-300">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded border border-violet-500/30"
            >
              {tech}
            </span>
          ))}
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">View Project</Button>
      </CardContent>
    </Card>
  )
}
