"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Shield, Zap } from "lucide-react"

interface WelcomeScreenProps {
  onConnectWallet: () => void
}

export function WelcomeScreen({ onConnectWallet }: WelcomeScreenProps) {
  const features = [
    {
      icon: Zap,
      title: "Fast Trading",
      description: "Swap tokens instantly on Solana with minimal fees",
    },
    {
      icon: Shield,
      title: "Secure Lending",
      description: "Earn yield or borrow against your crypto assets safely",
    },
    {
      icon: Wallet,
      title: "Easy Management",
      description: "Track your portfolio and transactions in one place",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-solana-gradient flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-solana-purple">SolanaFi</h1>
            <p className="text-muted-foreground mt-2">Your DeFi Gateway on Solana</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-0 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Connect Button */}
        <Button
          onClick={onConnectWallet}
          className="w-full bg-solana-gradient hover:opacity-90 text-white py-6 text-lg font-semibold"
        >
          Connect Wallet
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
