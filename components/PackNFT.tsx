import { MARKETPLACE_ADDRESS, PACK_ADDRESS } from "../const/addresses";
import { ThirdwebNftMedia, Web3Button, useAddress, useContract, useDirectListings, useNFT } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "../styles/Home.module.css";

type Props = {
    contractAddress: string;
    tokenId: any;
};

// Define the MarketplaceV3 ABI
const MarketplaceV3ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_listingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalPrice",
                "type": "uint256"
            }
        ],
        "name": "buyFromListing",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_extensionName",
                "type": "string"
            },
            {
                "internalType": "bytes4",
                "name": "_functionSelector",
                "type": "bytes4"
            }
        ],
        "name": "_disableFunctionInExtension",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractType",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractVersion",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_uri",
                "type": "string"
            }
        ],
        "name": "setContractURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const PackNFTCard = ({ contractAddress, tokenId }: Props) => {
    const address = useAddress();

    const { contract: marketplace, isLoading: loadingMarketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const { contract: packContract } = useContract(contractAddress);
    const { data: packNFT, isLoading: loadingNFT } = useNFT(packContract, tokenId);

    const { data: packListings, isLoading: loadingPackListings } = 
    useDirectListings(
        marketplace,
        {
            tokenContract: PACK_ADDRESS,
        }
    );
    console.log("Pack Listings: ", packListings);

    async function buyPack() {
        let txResult;

        if (packListings?.[tokenId]) {
            try {
                if (!marketplace) {
                    throw new Error("Marketplace contract is not loaded");
                }

                // Get the provider and signer
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                // Create an ethers.js contract instance with the signer
                const marketplaceWithSigner = new ethers.Contract(
                    MARKETPLACE_ADDRESS,
                    MarketplaceV3ABI,
                    signer
                );

                // Calculate the total price based on the listing details
                const totalPrice = packListings[tokenId].currencyValuePerToken.value.mul(1);

                // Call the buyFromListing method with the specified gas limit
                const tx = await marketplaceWithSigner.buyFromListing(
                    packListings[tokenId].id,
                    1,
                    totalPrice,
                    { gasLimit: 2000000, value: totalPrice }
                );
                txResult = await tx.wait();
            } catch (error) {
                console.error("Error buying pack:", error);
            }
        } else {
            throw new Error("No valid listing found");
        }
            
        return txResult;
    };

    const mediaStyle = {
        width: "100%",
        height: "300px",
        objectFit: "contain" as "contain",
        borderRadius: "8px",
    };

    return (
        <div className={styles.packCard}>
            {!loadingNFT && !loadingPackListings ? (
                <div className={styles.shopPack}>
                    <div className={styles.mediaGrid}>
                        {packNFT?.metadata && (
                            <ThirdwebNftMedia metadata={packNFT.metadata} style={mediaStyle} />
                        )}
                    </div>
                    <div className={styles.packInfo}>
                        <h3>{packNFT?.metadata?.name}</h3>
                        
                        <p>Cost: {packListings![tokenId].currencyValuePerToken.displayValue} {` ` + packListings![tokenId].currencyValuePerToken.symbol}</p>
                        <p>Supply: {packListings![tokenId].quantity}</p>
                        {!address ? (
                            <p>Login to buy</p>
                        ) : (
                            <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={() => buyPack()}
                            >Buy Pack</Web3Button>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
};
