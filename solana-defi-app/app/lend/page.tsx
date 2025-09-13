"use client"

import { OpenSeaHeader } from "@/components/opensea/opensea-header"
import { LendingMarkets } from "@/components/lending/lending-markets"
import { LendingPositions } from "@/components/lending/lending-positions"
import { useState } from "react"

export default function LendPage() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>("Phantom")

  return (
    <div className="dark min-h-screen bg-background">
      <OpenSeaHeader
        onConnectWallet={() => {}}
        isWalletConnected={!!connectedWallet}
        connectedWallet={connectedWallet}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Lending</h1>
          <p className="text-muted-foreground">Supply assets to earn yield or borrow against your collateral</p>
        </div>

        <div className="space-y-8">
          <LendingPositions />
          <LendingMarkets />
        </div>
      </main>
    </div>
  )
}
