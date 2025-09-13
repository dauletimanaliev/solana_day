"use client"

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import idl from '../idl.json'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

interface SolanaContextType {
  program: Program<Idl> | null
  connection: Connection | null
  provider: AnchorProvider | null
}

const SolanaContext = createContext<SolanaContextType>({
  program: null,
  connection: null,
  provider: null
})

export const useSolana = () => {
  const context = useContext(SolanaContext)
  if (!context) {
    throw new Error('useSolana must be used within a SolanaProvider')
  }
  return context
}

// Компонент для инициализации программы
function SolanaProgramProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet()
  const [program, setProgram] = useState<Program<Idl> | null>(null)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [provider, setProvider] = useState<AnchorProvider | null>(null)

  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  useEffect(() => {
    if (connected && publicKey) {
      const newConnection = new Connection(endpoint, 'confirmed')
      const newProvider = new AnchorProvider(newConnection, { publicKey } as any, {
        preflightCommitment: 'processed',
      })
      
      const newProgram = new Program(idl as any, newProvider)
      
      setConnection(newConnection)
      setProvider(newProvider)
      setProgram(newProgram)
    } else {
      setProgram(null)
      setConnection(null)
      setProvider(null)
    }
  }, [connected, publicKey, endpoint])

  const contextValue = useMemo(() => ({
    program,
    connection,
    provider
  }), [program, connection, provider])

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  )
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaProgramProvider>
            {children}
          </SolanaProgramProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
