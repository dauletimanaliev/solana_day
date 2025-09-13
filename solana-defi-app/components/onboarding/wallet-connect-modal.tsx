"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, ExternalLink, AlertCircle, CreditCard } from "lucide-react"
import { useState } from "react"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletConnected: (walletType: string) => void
}

export function WalletConnectModal({ isOpen, onClose, onWalletConnected }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const wallets = [
    {
      name: "Phantom",
      description: "The most popular Solana wallet",
      icon: "👻",
      installed: true,
    },
    {
      name: "Solflare",
      description: "Secure and user-friendly",
      icon: "🔥",
      installed: false,
    },
    {
      name: "Backpack",
      description: "Built for DeFi and NFTs",
      icon: "🎒",
      installed: false,
    },
  ]

  const processSolanaPayment = async () => {
    setIsProcessingPayment(true)

    // Simulate Solana payment processing
    setTimeout(() => {
      setPaymentComplete(true)
      setIsProcessingPayment(false)

      // Complete connection after payment
      setTimeout(() => {
        onWalletConnected(selectedWallet || "Phantom")
        setPaymentComplete(false)
        setSelectedWallet(null)
        onClose()
      }, 1500)
    }, 3000)
  }

  const handleWalletConnect = async (walletName: string) => {
    setIsConnecting(true)
    setSelectedWallet(walletName)

    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false)
      processSolanaPayment()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground">
              Connect your Solana wallet to start trading and lending on SolanaFi
            </p>
          </div>

          {isProcessingPayment && (
            <div className="bg-secondary border border-border p-4 rounded-lg text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary animate-pulse" />
              <p className="text-sm font-medium text-foreground">Processing Solana Payment...</p>
              <p className="text-xs text-muted-foreground mt-1">Confirming transaction on Solana network</p>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            </div>
          )}

          {paymentComplete && (
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-sm font-medium text-green-600">Payment Successful!</p>
              <p className="text-xs text-muted-foreground mt-1">Wallet connected successfully</p>
            </div>
          )}

          <div className="space-y-3">
            {wallets.map((wallet) => (
              <Card key={wallet.name} className="opensea-card">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-0 justify-start hover:bg-transparent"
                    onClick={() => handleWalletConnect(wallet.name)}
                    disabled={isConnecting || !wallet.installed || isProcessingPayment}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-lg bg-solana-gradient flex items-center justify-center text-lg">
                        {wallet.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{wallet.name}</span>
                          {!wallet.installed && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{wallet.description}</p>
                      </div>
                      {isConnecting && selectedWallet === wallet.name && (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Don't have a wallet? Download Phantom from their official website
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
