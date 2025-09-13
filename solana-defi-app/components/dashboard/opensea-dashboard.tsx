"use client"

import { OpenSeaHeader } from "@/components/opensea/opensea-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface OpenSeaDashboardProps {
  connectedWallet: string | null
  onConnectWallet: () => void
}

export function OpenSeaDashboard({ connectedWallet, onConnectWallet }: OpenSeaDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <OpenSeaHeader
        onConnectWallet={onConnectWallet}
        isWalletConnected={!!connectedWallet}
        connectedWallet={connectedWallet}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-r from-orange-600/20 via-orange-500/20 to-yellow-600/20 border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent" />
            <div className="relative p-8 md:p-12">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Mallow Inc. by Super Freak</h1>
                <p className="text-lg text-muted-foreground mb-6">By collections ✓</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">6,000 ETH</span>
                    <span className="text-muted-foreground">total volume</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">2,222</span>
                    <span className="text-muted-foreground">items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">86,16-15</span>
                    <span className="text-muted-foreground">owners</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Collections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Featured Collections</h2>
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  Explore the full collection <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="opensea-grid">
                {[
                  { name: "True crypto emotions", floor: "0.09 ETH", volume: "518.7K" },
                  { name: "PEPEHDH", floor: "0.009 ETH", volume: "518.7K" },
                  { name: "Solana Punks: 3rd Edition V.1.1.1", floor: "2.8 ETH", volume: "518.7K" },
                  { name: "TOSHIMONS", floor: "0.05 ETH", volume: "518.7K" },
                ].map((item, i) => (
                  <Card key={i} className="opensea-card cursor-pointer group">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={`/placeholder_svg.png?height=200&width=200&text=${item.name.slice(0, 10)}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground text-sm truncate">{item.name}</h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Floor price</span>
                        <span className="font-medium text-foreground">{item.floor}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Total volume</span>
                        <span className="font-medium text-foreground">{item.volume}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trending Tokens */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Trending Tokens</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "APE", symbol: "APE", price: "$1.23", change: "+5.2%" },
                  { name: "The Doge", symbol: "DOGE", price: "$0.08", change: "+12.4%" },
                  { name: "Shigen Inu", symbol: "SHIB", price: "$0.000012", change: "-2.1%" },
                  { name: "Orca", symbol: "ORCA", price: "$3.45", change: "+8.7%" },
                ].map((token, i) => (
                  <Card key={i} className="p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
                      <div>
                        <div className="font-medium text-sm text-foreground">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{token.price}</span>
                      <span
                        className={`text-xs font-medium ${token.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                      >
                        {token.change}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured Drops */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Featured Drops</h2>
              <div className="opensea-grid">
                {[
                  { name: "Mallow Inc by Super Freak", status: "Live", price: "Free" },
                  { name: "Aura Eyes of Power", status: "Coming Soon", price: "0.1 ETH" },
                  { name: "Wizard", status: "Live", price: "Free" },
                  { name: "AVALANCHE BALLAD PASS #2", status: "Coming Soon", price: "0.05 ETH" },
                ].map((drop, i) => (
                  <Card key={i} className="opensea-card cursor-pointer group">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={`/placeholder_svg.png?height=200&width=200&text=${drop.name.slice(0, 10)}`}
                        alt={drop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground text-sm truncate">{drop.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{drop.price}</span>
                        <Badge variant={drop.status === "Live" ? "default" : "secondary"} className="text-xs">
                          {drop.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Highest Weekly Sales */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Highest Weekly Sales</h2>
              <div className="opensea-grid">
                {[
                  { name: "Based Style #1", collection: "Based Style", price: "62.069 ETH" },
                  { name: "Bored Ape #8817", collection: "Bored Ape Yacht Club", price: "45.5 ETH" },
                  { name: "Bored Style #8534", collection: "Bored Style", price: "38.2 ETH" },
                  { name: "Bored Style #9847", collection: "Bored Style", price: "35.1 ETH" },
                ].map((item, i) => (
                  <Card key={i} className="opensea-card cursor-pointer group">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={`/placeholder_svg.png?height=200&width=200&text=${item.name.slice(0, 10)}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{item.collection}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item.price}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Top Movers Today */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Top Movers Today</h2>
              <div className="opensea-grid">
                {[
                  { name: "Bored Ape Yacht Club", floor: "11.5 ETH", change: "+25.4%" },
                  { name: "Otherdeeds for Otherside", floor: "0.45 ETH", change: "+18.2%" },
                  { name: "Azuki", floor: "2.1 ETH", change: "+12.8%" },
                  { name: "HIBROWS", floor: "0.08 ETH", change: "+8.5%" },
                ].map((item, i) => (
                  <Card key={i} className="opensea-card cursor-pointer group">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={`/placeholder_svg.png?height=200&width=200&text=${item.name.slice(0, 10)}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground text-sm truncate">{item.name}</h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Floor price</span>
                        <span className="font-medium text-foreground">{item.floor}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">24h change</span>
                        <span className="font-medium text-green-500">{item.change}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Trending</h3>
              <div className="space-y-2">
                {[
                  { name: "Pudgy Penguins", volume: "12.3M ETH", change: "+5.2%", rank: 1 },
                  { name: "CryptoPunks", volume: "11.2M ETH", change: "+3.1%", rank: 2 },
                  { name: "Bored Ape Yacht Club", volume: "9.8M ETH", change: "+2.8%", rank: 3 },
                  { name: "Azuki", volume: "8.5M ETH", change: "+1.9%", rank: 4 },
                  { name: "Mutant Ape Yacht Club", volume: "7.2M ETH", change: "+1.5%", rank: 5 },
                  { name: "Art Blocks Curated", volume: "6.8M ETH", change: "+1.2%", rank: 6 },
                  { name: "Doodles", volume: "5.9M ETH", change: "+0.8%", rank: 7 },
                  { name: "CloneX", volume: "5.1M ETH", change: "+0.5%", rank: 8 },
                  { name: "Moonbirds", volume: "4.7M ETH", change: "+0.3%", rank: 9 },
                  { name: "Otherdeeds", volume: "4.2M ETH", change: "+0.1%", rank: 10 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4">{item.rank}</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
                      <div>
                        <div className="text-sm font-medium text-foreground truncate max-w-[120px]">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.volume}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-green-500">{item.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
