"use client"

import { useState } from "react"
import ProfessionalWhiteHero from "@/components/professional-white-hero"
import HolographicSkillGlobe from "@/components/holographic-skill-globe"
import FloatingCodeSnippets from "@/components/floating-code-snippets"
import TerminalProjectCard from "@/components/terminal-project-card"
import GitHubStats from "@/components/github-stats"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function Home() {
  const [isTerminalMode, setIsTerminalMode] = useState(false)

  const projects = [
    {
      title: "Neural Network Dashboard",
      description: "AI-powered analytics platform with real-time data visualization and machine learning insights.",
      techStack: ["React", "Python", "TensorFlow", "D3.js"],
    },
    {
      title: "Quantum Computing Simulator",
      description: "Interactive quantum circuit builder with advanced quantum algorithm implementations.",
      techStack: ["Next.js", "WebGL", "Quantum.js", "TypeScript"],
    },
    {
      title: "Blockchain Explorer",
      description: "Decentralized application for exploring blockchain transactions with 3D network visualization.",
      techStack: ["Web3", "Three.js", "Solidity", "React"],
    },
  ]

  return (
    <main className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
      <FloatingCodeSnippets />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <ProfessionalWhiteHero />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-800">
            Welcome to My Digital Lab
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-600 font-light">
            Explore my journey through code and innovation.
          </p>
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-lg neon-glow">
            Dive into Projects
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-violet-700">About the Lab</h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Welcome to my digital laboratory where I experiment with cutting-edge technologies, push the boundaries of
            what's possible, and transform abstract concepts into tangible solutions.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-violet-700">Tech Arsenal</h2>
          <HolographicSkillGlobe />
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-violet-700">Project Archives</h2>
            <div className="flex items-center space-x-3">
              <span className="text-slate-600">Standard View</span>
              <Switch
                checked={isTerminalMode}
                onCheckedChange={setIsTerminalMode}
                className="data-[state=checked]:bg-violet-600"
              />
              <span className="text-slate-600">Terminal Mode</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <TerminalProjectCard
                key={i}
                title={project.title}
                description={project.description}
                techStack={project.techStack}
                isTerminalMode={isTerminalMode}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Stats Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-violet-700">Live Coding Stats</h2>
          <div className="flex justify-center">
            <GitHubStats />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-violet-700">Initialize Connection</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Ready to collaborate on the next breakthrough? Let's connect and build something extraordinary together.
          </p>
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-lg neon-glow">
            Establish Contact
          </Button>
        </div>
      </section>
    </main>
  )
}
