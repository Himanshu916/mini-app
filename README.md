Mini NFT Minting App - Bug Report
⚠️ Bug Summary

This is a mini app built to mint NFTs on Solana and EVM chains within the Farcaster ecosystem (Immunify platform).

✅ Expected Behavior:

On both Solana and EVM chains, the app should display the mint price before confirming the mint action.

The user should see a preview of the NFT before confirming the mint.

The minted NFT should be transferable to other wallets.

❌ Actual Bug Behavior:

When minting on Solana:

The mint price is not displayed.

The user can proceed to confirm the mint without seeing the NFT preview.

After minting, the NFT is successfully created but is locked in the Farcaster wallet and cannot be transferred to any other wallet.

When minting on EVM chains:

Mint price is displayed as expected.

NFT preview is shown before confirmation.

NFT is transferable after minting.

🚀 Steps to Reproduce
1️⃣ Fork the Repository

Fork this repository into your own GitHub account.

2️⃣ Setup Farcaster Mini App

Deploy your own instance of the Farcaster mini app:

Visit Farcaster Developer Portal
 to set up a mini app.

Configure your mini app to point to your forked repository.

3️⃣ Environment Variables

❗️ The .env file is not shared due to security reasons.

However, typical environment variables you will need:

REACT_APP_CHAIN = "solana" or "evm"  # Test both chains
REACT_APP_RPC_URL = "<RPC_ENDPOINT_FOR_CHAIN>"
REACT_APP_WALLET_PRIVATE_KEY = "<Your Private Key>" # Farcaster wallet private key
REACT_APP_API_URL = "<Farcaster API URL>"

4️⃣ Build and Deploy

Install dependencies:

npm install


Build the project:

npm run build


Deploy it to Farcaster according to their documentation.

5️⃣ Test Minting

Open the mini app from the Farcaster dashboard.

Select Solana chain and try minting an NFT.

❌ Observe that the mint price is not displayed.
![WhatsApp Image 2025-09-10 at 9 12 08 PM](https://github.com/user-attachments/assets/6ecff610-802d-4798-88e5-c4c32e8fdf69)

❌ Confirm mint without seeing preview.

✅ NFT gets minted.

❌ Try transferring NFT to another wallet → can't see send button for solana but can see for nfts minted on evm

can't send minted NFT on solana
![WhatsApp Image 2025-09-10 at 8 54 53 PM](https://github.com/user-attachments/assets/037e6b6c-8615-433a-b52d-335039f22395)

but can send minted NFT on evm chains
![WhatsApp Image 2025-09-10 at 8 54 53 PM (1)](https://github.com/user-attachments/assets/4d248566-175a-40b0-855a-2dde5e72b901)




Now repeat the same flow with EVM chain:

✅ Mint price is displayed.

✅ NFT preview is shown.

✅ NFT is transferable after minting.

📋 Additional Notes

The issue appears to be isolated to Solana mints on Farcaster.

The locking of NFT to the Farcaster wallet suggests a problem with token standards or Solana-specific configuration.
