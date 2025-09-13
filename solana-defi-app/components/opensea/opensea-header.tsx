"use client"

import { Search, Bell, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OpenSeaHeaderProps {
  onConnectWallet: () => void
  isWalletConnected: boolean
  connectedWallet?: string | null
}

export function OpenSeaHeader({ onConnectWallet, isWalletConnected, connectedWallet }: OpenSeaHeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-solana-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl text-foreground">SolanaFi</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search collections, tokens, and more..."
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isWalletConnected ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                <Wallet className="w-4 h-4 text-solana-purple" />
                <span className="text-sm font-medium">{connectedWallet}</span>
              </div>
            </>
          ) : (
            <Button onClick={onConnectWallet} className="bg-solana-gradient hover:opacity-90 text-white">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
