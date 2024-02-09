import { ThirdwebSDK } from "@thirdweb-dev/sdk";

(async () => {
  // Learn more about securely accessing your private key: https://portal.thirdweb.com/web3-sdk/set-up-the-sdk/securing-your-private-key
  const sdk = ThirdwebSDK.fromPrivateKey("<your-private-key-here>", "mumbai");

  const packAddress = await sdk.deployer.deployPack({
    name: "Treasure Chests",
    primary_sale_recipient: "0xb371d1C5629C70ACd726B20a045D197c256E1054",
  });

  console.log(`Pack address: ${packAddress}`);
})();