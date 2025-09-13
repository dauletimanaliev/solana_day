"use client"

import { OpenSeaHeader } from "@/components/opensea/opensea-header"
import { WalletInfo } from "@/components/profile/wallet-info"
import { TransactionHistory } from "@/components/profile/transaction-history"
import { SettingsPanel } from "@/components/profile/settings-panel"
import { useState } from "react"

export default function ProfilePage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your wallet, transactions, and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <WalletInfo walletType="Phantom" address="7x8kJ9mN2pQ5rS6tU8vW1xY2zA3bC4dE5fG6hI7jK8lM9nO0" />
            <SettingsPanel />
          </div>

          <div>
            <TransactionHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
