import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import fs from "fs";

(async () => {
    const packAddress = "0x0Aee160411473f63be2DfF2865E81A1D59636C97";
    const tokenAddress = "0x270d0f9DA22332F33159337E3DE244113a1C863C";
    const editionAddress = "0xb4A48c837aB7D0e5C85eA2b0D9Aa11537340Fa17";
  
    // Learn more about securely accessing your private key: https://portal.thirdweb.com/web3-sdk/set-up-the-sdk/securing-your-private-key
    const sdk = ThirdwebSDK.fromPrivateKey("<your-private-key-here>", "mumbai");
  
    const pack = sdk.getPack(packAddress);
  
    // Set approval for the pack contract to act upon token and edition contracts
    const token = sdk.getToken(tokenAddress);
    await token.setAllowance(packAddress, 100);
  
    const edition = sdk.getEdition(editionAddress);
    await edition.setApprovalForAll(packAddress, true);

    // Upload the Chest to IPFS
const ipfsHash = await sdk.storage.upload(chestFile);
const url = ipfsHash.uris[0];

const packNfts = await pack.create({
    // Metadata for the pack NFTs
    packMetadata: {
      name: "Treasure Chest",
      description:
        "A chest containing tools and treasure to help you on your voyages.",
      image: url,
    },

    // Gold coin ERC20 Tokens
    erc20Rewards: [
      {
        contractAddress: tokenAddress,
        quantityPerReward: 5,
        quantity: 100,
        totalRewards: 20,
      },
    ],

    erc1155Rewards: [
      // Compass
      {
        contractAddress: editionAddress,
        tokenId: 0,
        quantityPerReward: 1,
        totalRewards: 100,
      },
      // Anchor
      {
        contractAddress: editionAddress,
        tokenId: 1,
        quantityPerReward: 1,
        totalRewards: 100,
      },
      // Sword
      {
        contractAddress: editionAddress,
        tokenId: 2,
        quantityPerReward: 1,
        totalRewards: 100,
      },
      // Captain's Hat
      {
        contractAddress: editionAddress,
        tokenId: 3,
        quantityPerReward: 1,
        totalRewards: 65,
      },
      // Cannon
      {
        contractAddress: editionAddress,
        tokenId: 4,
        quantityPerReward: 1,
        totalRewards: 50,
      },
      // Hook
      {
        contractAddress: editionAddress,
        tokenId: 5,
        quantityPerReward: 1,
        totalRewards: 50,
      },
      // Rum
      {
        contractAddress: editionAddress,
        tokenId: 6,
        quantityPerReward: 1,
        totalRewards: 10,
      },
      // Gold Key
      {
        contractAddress: editionAddress,
        tokenId: 7,
        quantityPerReward: 1,
        totalRewards: 5,
      },
    ],
    rewardsPerPack: 5,
  });

  console.log(`====== Success: Pack NFTs created =====`);

  console.log(packNfts);
})();