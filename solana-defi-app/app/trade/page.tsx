"use client"

import { OpenSeaHeader } from "@/components/opensea/opensea-header"
import { SwapInterface } from "@/components/trading/swap-interface"
import { OrderBook } from "@/components/trading/order-book"
import { TradingChart } from "@/components/trading/trading-chart"
import { useState } from "react"

export default function TradePage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Trade</h1>
          <p className="text-muted-foreground">Swap tokens and trade on Solana DEX</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Chart */}
          <div className="lg:col-span-2">
            <TradingChart />
          </div>

          {/* Swap Interface */}
          <div>
            <SwapInterface />
          </div>
        </div>

        <div className="mt-8">
          <OrderBook />
        </div>
      </main>
    </div>
  )
}
