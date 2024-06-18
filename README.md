# Bridge usdc from Noble testnet to Sepolia using cross-chain transfer protocol of circle

## Report

This solution allows you to transfer your usdc from the noble testnet network to sepolia ethereum.
I used a library called graz to facilitate the connection with keplr using hooks and also cosmjs to be able to interact with the noble testnet network.
I also used shadcn-ui to facilitate the styling of the interface.

## Prerequisites

- node 18 or later
- You must have kepl wallet and metamask installed on your browser
- You must have some uusdc(noble testnet) on your keplr wallet to burn
- You must have some sepoliaETH on your metamask wallet to mint

1. Install required packages:

   ```
   npm install
   ```

2. Run this app

   ```
   npm run dev
   ```

3. Now you can see this app here `http://localhost:5173`

## PLEASE NOTE:

There is a bug in the circle iris-api-sandbox, so depending on the test period it may not be possible to obtain an attestation, even if the transaction has been sucessfully minted. You can see the discussion on their discord https://discord.com/channels/473781666251538452/1234217217105592422
