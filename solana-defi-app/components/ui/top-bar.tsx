"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  title?: string
  onSettingsClick?: () => void
}

export function TopBar({ title = "SolanaFi", onSettingsClick }: TopBarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-solana-gradient flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <h1 className="text-lg font-bold text-solana-purple">{title}</h1>
      </div>
      <Button variant="ghost" size="sm" onClick={onSettingsClick} className="h-8 w-8 p-0">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
