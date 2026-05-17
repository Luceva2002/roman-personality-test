/**
 * Script per configurare il contratto NFT con il baseImageURI corretto
 * 
 * Usage:
 * node scripts/setup-contract.js
 */

const { ethers } = require('ethers');
require('dotenv').config();

// ABI minimo necessario per le funzioni di setup
const CONTRACT_ABI = [
  "function setBaseImageURI(string memory uri) external",
  "function setNamePrefix(string memory p) external",
  "function setDescription(string memory d) external",
  "function baseImageURI() external view returns (string memory)",
  "function namePrefix() external view returns (string memory)",
  "function description() external view returns (string memory)",
  "function owner() external view returns (address)"
];

// Configurazione
const CONTRACT_ADDRESS = "0xfd40710B7D9ef3351Ea3891aA1Aa22BAEF9072B3";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tuodominio.vercel.app";

async function main() {
  console.log("🚀 Setup del contratto Roman Persona NFT\n");

  // Verifica che ci sia una PRIVATE_KEY
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ Errore: PRIVATE_KEY non trovata nelle variabili d'ambiente");
    console.log("\nCrea un file .env nella root del progetto con:");
    console.log("PRIVATE_KEY=tua_chiave_privata_senza_0x");
    console.log("NEXT_PUBLIC_BASE_URL=https://tuodominio.com");
    process.exit(1);
  }

  // Pulisci e valida la private key
  let privateKey = process.env.PRIVATE_KEY.trim();
  
  // Rimuovi il prefisso 0x se presente
  if (privateKey.startsWith('0x')) {
    privateKey = privateKey.slice(2);
  }
  
  // Aggiungi il prefisso 0x per ethers.js
  privateKey = '0x' + privateKey;
  
  // Valida lunghezza (64 caratteri hex + 0x = 66)
  if (privateKey.length !== 66) {
    console.error("❌ Errore: Private key non valida");
    console.log(`   Lunghezza attuale: ${privateKey.length} (dovrebbe essere 66 con 0x)`);
    console.log("\n💡 La private key deve essere:");
    console.log("   - 64 caratteri esadecimali (0-9, a-f)");
    console.log("   - Puoi metterla con o senza 0x nel .env");
    console.log("\nEsempio nel .env:");
    console.log("PRIVATE_KEY=abc123def456789abc123def456789abc123def456789abc123def456789abc");
    process.exit(1);
  }
  
  // Verifica che contenga solo caratteri hex validi
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    console.error("❌ Errore: Private key contiene caratteri non validi");
    console.log("   La private key deve contenere solo caratteri: 0-9, a-f, A-F");
    process.exit(1);
  }

  // Connessione alla blockchain (Arbitrum Sepolia)
  const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc";
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  console.log("🌐 Connessione a:", RPC_URL);
  
  // Crea il wallet
  let wallet;
  try {
    wallet = new ethers.Wallet(privateKey, provider);
    console.log("👛 Wallet connesso:", wallet.address);
  } catch (error) {
    console.error("❌ Errore nella creazione del wallet:", error.message);
    console.log("\n💡 Controlla che la private key sia corretta");
    console.log("   Esporta la private key da MetaMask:");
    console.log("   1. Apri MetaMask");
    console.log("   2. Clicca sui 3 puntini → Account details");
    console.log("   3. Show private key");
    console.log("   4. Copia la chiave (con o senza 0x)");
    process.exit(1);
  }
  
  // Connetti al contratto
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
  console.log("📄 Contratto:", CONTRACT_ADDRESS);
  
  try {
    // Verifica che siamo l'owner
    const owner = await contract.owner();
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      console.error(`❌ Errore: Non sei l'owner del contratto!`);
      console.log(`Owner attuale: ${owner}`);
      console.log(`Tuo indirizzo: ${wallet.address}`);
      process.exit(1);
    }
    console.log("✅ Sei l'owner del contratto\n");

    // Leggi i valori attuali
    console.log("📖 Valori attuali:");
    try {
      const currentBaseURI = await contract.baseImageURI();
      const currentPrefix = await contract.namePrefix();
      const currentDesc = await contract.description();
      console.log(`  baseImageURI: "${currentBaseURI}"`);
      console.log(`  namePrefix: "${currentPrefix}"`);
      console.log(`  description: "${currentDesc}"`);
    } catch (e) {
      console.log("  (non ancora configurato)");
    }
    console.log("");

    // Imposta il baseImageURI
    const baseImageURI = `${BASE_URL}/api/nft/`;
    console.log(`📝 Impostazione baseImageURI: ${baseImageURI}`);
    
    const tx1 = await contract.setBaseImageURI(baseImageURI);
    console.log("⏳ Transazione inviata:", tx1.hash);
    await tx1.wait();
    console.log("✅ baseImageURI impostato!\n");

    // Imposta il name prefix
    console.log("📝 Impostazione namePrefix...");
    const tx2 = await contract.setNamePrefix("Roman Persona");
    await tx2.wait();
    console.log("✅ namePrefix impostato!\n");

    // Imposta la description
    console.log("📝 Impostazione description...");
    const tx3 = await contract.setDescription("NFT collection representing authentic Roman personalities");
    await tx3.wait();
    console.log("✅ description impostata!\n");

    // Verifica i nuovi valori
    console.log("🔍 Verifica configurazione:");
    const newBaseURI = await contract.baseImageURI();
    const newPrefix = await contract.namePrefix();
    const newDesc = await contract.description();
    console.log(`  baseImageURI: "${newBaseURI}"`);
    console.log(`  namePrefix: "${newPrefix}"`);
    console.log(`  description: "${newDesc}"`);
    console.log("");

    // Test dell'endpoint
    console.log("🧪 Test endpoint metadati:");
    console.log(`  ${BASE_URL}/api/nft/1`);
    console.log(`  ${BASE_URL}/api/nft/2`);
    console.log(`  ${BASE_URL}/api/nft/3`);
    console.log("");

    console.log("✅ Setup completato con successo!");
    console.log("\n⚠️  IMPORTANTE:");
    console.log("1. Aspetta qualche minuto per la propagazione");
    console.log("2. Su OpenSea/MetaMask, potrebbe essere necessario:");
    console.log("   - Forzare il refresh dei metadati");
    console.log("   - Aspettare fino a 24h per la cache");
    console.log("3. Testa l'endpoint API nel browser per verificare che funzioni");

  } catch (error) {
    console.error("\n❌ Errore durante il setup:");
    console.error(error.message);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      console.log("\n💡 Il wallet non ha abbastanza ETH per le gas fees");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

