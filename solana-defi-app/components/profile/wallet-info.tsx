"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Wallet, Shield } from "lucide-react"

interface WalletInfoProps {
  walletType: string
  address: string
}

export function WalletInfo({ walletType, address }: WalletInfoProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  return (
    <Card className="opensea-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Wallet Information</h3>
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <Shield className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-solana-gradient flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{walletType}</p>
              <p className="text-sm text-muted-foreground">Solana Wallet</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Wallet Address</p>
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
              <code className="flex-1 text-sm font-mono text-foreground truncate">{address}</code>
              <Button size="sm" variant="ghost" onClick={copyAddress}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Network</p>
              <p className="font-medium text-foreground">Solana Mainnet</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connected Since</p>
              <p className="font-medium text-foreground">Today</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
