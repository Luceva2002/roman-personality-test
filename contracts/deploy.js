// Script di deploy per RomanPersonaNFT
// Usa Hardhat o Foundry per il deployment

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying RomanPersonaNFT...");

  // Get the contract factory
  const RomanPersonaNFT = await hre.ethers.getContractFactory("RomanPersonaNFT");
  
  // Deploy
  const contract = await RomanPersonaNFT.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ RomanPersonaNFT deployed to:", address);
  
  // Test mint (opzionale)
  console.log("\n📝 Testing mint...");
  const tx = await contract.mint(
    "Marco",
    "roma_centro",
    "boro",
    "palazzina_70",
    "doppio_taglio",
    "cucina_romana"
  );
  await tx.wait();
  console.log("✅ Test mint successful!");
  
  // Get token metadata
  const metadata = await contract.getPersonaMetadata(1);
  console.log("\n📊 Metadata:", {
    nome: metadata.nome,
    zona: metadata.zona,
    persona: metadata.persona,
    abitazione: metadata.abitazione,
    capelli: metadata.capelli,
    piatto: metadata.piatto
  });
  
  console.log("\n🎉 Deployment completato!");
  console.log("📋 Aggiorna CONTRACT_ADDRESS in src/lib/contract.ts con:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });






