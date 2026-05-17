# Roman Persona NFT - Smart Contract

Smart contract Solidity per NFT che rappresenta l'indole romana delle persone.

## 🎯 Caratteristiche

- **ERC721** standard NFT
- **Metadati on-chain** - Tutti i dati memorizzati direttamente sulla blockchain
- **Gas-efficient** - Ottimizzato per ridurre i costi
- **TokenURI dinamico** - Metadati in formato JSON Base64
- **OpenZeppelin** - Usa librerie sicure e testate

## 📊 Metadati Memorizzati

Ogni NFT memorizza:
- **Nome** - Nome della persona
- **Zona** - Zona di Roma (roma_centro, roma_nord, roma_ovest, roma_est, roma_sud, fuori_gra)
- **Persona** - Indole (boro, pariolino, coatto, mix)
- **Abitazione** - Tipo di casa
- **Capelli** - Taglio di capelli
- **Piatto** - Piatto preferito
- **Timestamp** - Data di mint

## 🚀 Setup

1. Installa le dipendenze:
```bash
cd contracts
npm install
```

2. Crea file `.env`:
```bash
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

3. Compila il contratto:
```bash
npm run compile
```

4. Deploy su Base Sepolia (testnet):
```bash
npm run deploy:baseSepolia
```

5. Deploy su Base (mainnet):
```bash
npm run deploy:base
```

## 📝 Funzioni Principali

### `mint(nome, zona, persona, abitazione, capelli, piatto)`
Minta un nuovo NFT con i metadati della persona.

**Parametri:**
- `nome` - Nome (es. "Marco")
- `zona` - Zona (es. "roma_centro")
- `persona` - Indole (es. "boro")
- `abitazione` - Casa (es. "palazzina_70")
- `capelli` - Capelli (es. "doppio_taglio")
- `piatto` - Piatto (es. "cucina_romana")

**Returns:** `uint256` - ID del token mintato

### `getPersonaMetadata(tokenId)`
Ottiene tutti i metadati di un token.

### `getPersona(tokenId)`
Ottiene solo l'indole di un token.

### `tokenURI(tokenId)`
Ottiene l'URI dei metadati in formato JSON Base64.

## 🔗 Integrazione Frontend

Dopo il deploy, aggiorna `src/lib/contract.ts` con:
1. Nuovo indirizzo del contratto
2. Nuovo ABI (in `artifacts/contracts/RomanPersonaNFT.sol/RomanPersonaNFT.json`)

## 🧪 Testing

Il contratto può essere testato localmente:
```bash
npm test
```

## 🔒 Sicurezza

- Usa OpenZeppelin v5.0
- Ownable per funzioni amministrative future
- Nessuna funzione payable (mint gratuito)
- Metadati immutabili dopo il mint

## 📄 Licenza

MIT






