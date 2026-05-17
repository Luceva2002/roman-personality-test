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

## Demo

- **Live**: https://boro-coatto-pariolino.vercel.app
- **Smart contract**: [`0xfd40710B7D9ef3351Ea3891aA1Aa22BAEF9072B3`](https://sepolia.arbiscan.io/address/0xfd40710B7D9ef3351Ea3891aA1Aa22BAEF9072B3)
  su Arbitrum Sepolia.

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

## Roadmap

- [ ] Salvare le risposte del quiz on-chain (mint con tratti reali).
- [ ] Test unitari per `calcolaPunteggio` e `getPersonaForTokenId`.
- [ ] Pulsante "Aggiungi all'NFT al wallet" via `wallet_watchAsset`.
- [ ] Localizzazione EN/IT.

[MIT](./LICENSE)
