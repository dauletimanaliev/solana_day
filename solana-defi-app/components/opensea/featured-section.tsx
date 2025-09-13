"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface FeaturedItem {
  id: string
  name: string
  image: string
  floorPrice: number
  change24h: number
  volume: number
}

const featuredCollections: FeaturedItem[] = [
  {
    id: "1",
    name: "Solana Monkeys",
    image: "/stylized-monkey-nft.png",
    floorPrice: 2.5,
    change24h: 12.5,
    volume: 1250,
  },
  {
    id: "2",
    name: "DeGods",
    image: "/degods-nft-collection.jpg",
    floorPrice: 15.8,
    change24h: -5.2,
    volume: 3400,
  },
  {
    id: "3",
    name: "Okay Bears",
    image: "/okay-bears-nft.jpg",
    floorPrice: 8.2,
    change24h: 8.7,
    volume: 2100,
  },
  {
    id: "4",
    name: "Famous Fox Federation",
    image: "/famous-fox-federation-nft.jpg",
    floorPrice: 4.1,
    change24h: 3.2,
    volume: 890,
  },
]

export function FeaturedSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Featured Collections</h2>
        <p className="text-muted-foreground">Top collections on Solana</p>
      </div>

      <div className="opensea-grid">
        {featuredCollections.map((item) => (
          <Card key={item.id} className="opensea-card cursor-pointer group">
            <div className="aspect-square mb-4 overflow-hidden rounded-lg">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Floor price</p>
                  <p className="font-medium text-foreground">{item.floorPrice} SOL</p>
                </div>

                <div className="flex items-center gap-1">
                  {item.change24h > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${item.change24h > 0 ? "text-green-500" : "text-red-500"}`}>
                    {item.change24h > 0 ? "+" : ""}
                    {item.change24h}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">24h volume</p>
                <p className="text-sm font-medium text-foreground">{item.volume} SOL</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
