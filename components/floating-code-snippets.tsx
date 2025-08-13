"use client"

import { useEffect, useState } from "react"

const codeSnippets = [
  "const magic = () => { return 'Hello World'; }",
  "function createAwesome() { return innovation; }",
  "const future = await buildTomorrow();",
  "import { creativity } from 'imagination';",
  "export default function Dream() {}",
  "const possibilities = [...infinite];",
  "async function transform() { return reality; }",
  "const code = poetry.compile();",
]

export default function FloatingCodeSnippets() {
  const [snippets, setSnippets] = useState<
    Array<{
      id: number
      text: string
      x: number
      y: number
      delay: number
    }>
  >([])

  useEffect(() => {
    const generateSnippets = () => {
      const newSnippets = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        text: codeSnippets[i % codeSnippets.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
      }))
      setSnippets(newSnippets)
    }

    generateSnippets()
    const interval = setInterval(generateSnippets, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snippets.map((snippet) => (
        <div
          key={snippet.id}
          className="absolute text-violet-400/30 text-sm font-mono float-code"
          style={{
            left: `${snippet.x}%`,
            top: `${snippet.y}%`,
            animationDelay: `${snippet.delay}s`,
          }}
        >
          {snippet.text}
        </div>
      ))}
    </div>
  )
}
