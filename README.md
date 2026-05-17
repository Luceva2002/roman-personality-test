# Boro, Coatto o Pariolino?

Un quiz interattivo che, in cinque domande, ti dice se sei un **Boro**, un
**Pariolino** o un **Coatto** — e ti permette di mintare il risultato come
NFT su **Arbitrum Sepolia** o di condividerlo come **Farcaster Frame**.

Progetto full-stack costruito con Next.js 14 (App Router), TypeScript strict,
wagmi/viem e uno smart contract ERC-721 in Solidity.

[![Made with Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Wagmi](https://img.shields.io/badge/wagmi-2.x-1c1b1f)](https://wagmi.sh)
[![Arbitrum Sepolia](https://img.shields.io/badge/chain-Arbitrum%20Sepolia-28a0f0)](https://sepolia.arbiscan.io)

---

## Indice

- [Demo](#demo)
- [Stack tecnologico](#stack-tecnologico)
- [Architettura](#architettura)
- [Quick start](#quick-start)
- [Configurazione](#configurazione)
- [Scripts](#scripts)
- [Smart contract](#smart-contract)
- [Farcaster Frame](#farcaster-frame)
- [Deploy su Vercel](#deploy-su-vercel)
- [Roadmap](#roadmap)
- [Licenza](#licenza)

---

## Demo

- **Live**: https://boro-coatto-pariolino.vercel.app
- **Smart contract**: [`0xfd40710B7D9ef3351Ea3891aA1Aa22BAEF9072B3`](https://sepolia.arbiscan.io/address/0xfd40710B7D9ef3351Ea3891aA1Aa22BAEF9072B3)
  su Arbitrum Sepolia.

---

## Stack tecnologico

| Area | Scelta | Perché |
|------|--------|--------|
| Framework | Next.js 14 (App Router) | Routing file-based, RSC, edge runtime per le immagini OG. |
| Linguaggio | TypeScript strict | Type safety dal contratto al componente. |
| Web3 | wagmi 2 + viem | API moderna e type-safe per Ethereum, SSR pronto. |
| Wallets | Injected, Coinbase Wallet, WalletConnect | Copertura desktop/mobile senza vendor lock-in. |
| Styling | TailwindCSS + CSS variables | Tema centralizzato, glassmorphism leggero. |
| Mini App | `@farcaster/miniapp-sdk` | Integrazione con il feed Farcaster. |
| Smart contract | Solidity 0.8.20 + OpenZeppelin | ERC-721 con tokenURI dinamico e proprietario. |

---

## Architettura

```
src/
├── app/
│   ├── api/
│   │   ├── frame/route.ts            # Endpoint POST/GET per il Farcaster Frame
│   │   ├── frame/image/route.tsx     # OG image generata via Edge (next/og)
│   │   └── nft/[tokenId]/route.ts    # Metadati ERC-721 (OpenSea-compatible)
│   ├── frame/page.tsx                # Landing dedicata al Frame
│   ├── .well-known/farcaster.json/   # Manifest Mini App
│   ├── layout.tsx                    # Provider + metadata globali
│   └── page.tsx                      # Stato del quiz (client component)
├── components/
│   ├── providers.tsx                 # Wagmi + React Query
│   ├── wallet-button.tsx             # Connessione, switch chain e modal
│   ├── mint-button.tsx               # Scrittura on-chain (writeContract)
│   ├── step-shell.tsx                # Layout step + progress bar
│   ├── dev-warnings.tsx              # Banner dev-only per config mancante
│   ├── steps/                        # Hero, domanda generica, mint
│   └── ui/                           # Button, Input, Progress
├── lib/
│   ├── env.ts                        # Lettura centralizzata delle env vars
│   ├── persona.ts                    # Domande, scoring, mapping persona→NFT
│   ├── contract.ts                   # Indirizzo + ABI del contratto
│   └── utils.ts                      # Helpers (cn, shortAddress)
└── styles/globals.css                # Token CSS + Tailwind base

contracts/
├── RomanPersonaNFT.sol               # ERC-721 con tokenURI on-chain
├── RomanPersonaNFT.abi.json          # ABI consumato dal frontend
└── deploy.js                         # Script di deploy (Hardhat)

scripts/
└── setup-contract.js                 # Configura baseImageURI/namePrefix
```

Punti chiave:

- **Single source of truth** per le env: `src/lib/env.ts` evita di leggere
  `process.env.*` sparso nei componenti.
- **Persona logic isolata**: tutte le domande, i pesi e il mapping
  persona→immagine vivono in `src/lib/persona.ts` e sono pure functions
  facilmente testabili.
- **Server-side metadata**: `/api/nft/[tokenId]` espone JSON conforme allo
  standard OpenSea con cache `public, max-age=31536000, immutable`.

---

## Quick start

Requisiti: Node.js ≥ 18, un wallet (es. MetaMask) e qualche ETH di test su
Arbitrum Sepolia ([faucet](https://faucet.quicknode.com/arbitrum/sepolia)).

```bash
git clone <repo-url>
cd Roman-personality-test
npm install
cp .env.example .env.local   # opzionale, vedi sotto
npm run dev
```

L'app è disponibile su <http://localhost:5173>.

---

## Configurazione

Tutte le variabili sono opzionali in locale: l'app ha fallback ragionevoli.

| Variabile | Scope | Descrizione |
|-----------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | client/server | URL pubblico dell'app (Frame, OG, metadata NFT). |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | client | Project ID gratuito da [cloud.walletconnect.com](https://cloud.walletconnect.com). Senza, WalletConnect viene disabilitato (gli altri connector restano attivi). |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | client | Override dell'indirizzo del contratto. |
| `MINIAPP_NAME`, `MINIAPP_WEBHOOK_URL`, `BASE_ALLOWED_ADDRESSES` | server | Customizzazione del manifest Farcaster. |
| `PRIVATE_KEY`, `ARBITRUM_SEPOLIA_RPC` | server (script) | Solo per `npm run setup-contract`. **Mai committare.** |

Vedi [`.env.example`](./.env.example) per il template completo.

---

## Scripts

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia il dev server su `:5173`. |
| `npm run build` | Build di produzione Next.js. |
| `npm start` | Avvia l'app buildata su `:5173`. |
| `npm run lint` | ESLint con la config di Next. |
| `npm run typecheck` | `tsc --noEmit` su tutto il progetto. |
| `npm run setup-contract` | Configura `baseImageURI` / `namePrefix` on-chain (solo owner). |

---

## Smart contract

Il contratto `RomanPersonaNFT` (`contracts/RomanPersonaNFT.sol`) è uno
ERC-721 standard con metadati on-chain in JSON Base64.

- **Standard**: ERC-721 + `ERC721URIStorage` + `Ownable` (OpenZeppelin v5).
- **Network**: Arbitrum Sepolia (testnet).
- **Funzioni principali**:
  - `mint(...)` — minta un token con i metadati della persona.
  - `tokenURI(tokenId)` — restituisce il JSON Base64 con immagine e attributi.
  - `setBaseImageURI`, `setNamePrefix`, `setDescription` — owner only.

> ⚠️ Il contratto attualmente deployato accetta `mint()` senza argomenti e
> assegna le immagini ciclicamente lato server (Boro → Pariolino → Coatto).
> Il sorgente nel repository include anche una versione estesa che salva i
> tratti scelti dall'utente direttamente on-chain.

---

## Farcaster Frame

L'app è anche un Farcaster Frame:

- `GET /` espone i meta tag `fc:frame:*` con l'immagine iniziale.
- `POST /api/frame` gestisce i click sui bottoni e restituisce nuovi Frame.
- `GET /api/frame/image?step=...` genera dinamicamente le immagini OG via
  `next/og` sull'edge runtime.

Il manifest Mini App è esposto su `/.well-known/farcaster.json`.

---

## Deploy su Vercel

1. Importa il repository su Vercel.
2. Imposta le variabili d'ambiente (almeno `NEXT_PUBLIC_APP_URL`).
3. Deploy. Il file [`vercel.json`](./vercel.json) imposta gli header corretti
   per il Frame (no-cache) e il manifest Farcaster (CORS aperto).

```bash
vercel deploy --prod
```

---

## Roadmap

- [ ] Salvare le risposte del quiz on-chain (mint con tratti reali).
- [ ] Test unitari per `calcolaPunteggio` e `getPersonaForTokenId`.
- [ ] Pulsante "Aggiungi all'NFT al wallet" via `wallet_watchAsset`.
- [ ] Localizzazione EN/IT.

---

## Licenza

[MIT](./LICENSE)
