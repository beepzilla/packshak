import { MARKETPLACE_ADDRESS, PACK_ADDRESS } from "../const/addresses";
import { ThirdwebNftMedia, Web3Button, useAddress, useContract, useDirectListings, useNFT } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

type Props = {
    contractAddress: string;
    tokenId: any;
};

export const PackNFTCard = ({ contractAddress, tokenId }: Props) => {
    const address = useAddress();
    const { contract: marketplace, isLoading: loadingMarketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const { contract: packContract } = useContract(contractAddress);
    const { data: packNFT, isLoading: loadingNFT } = useNFT(packContract, tokenId);

    const { data: packListings, isLoading: loadingPackListings } = useDirectListings(
        marketplace,
        {
            tokenContract: PACK_ADDRESS,
        }
    );

    console.log("Pack Listings: ", packListings);

    async function buyPack() {
        if (packListings?.[tokenId]) {
            return await marketplace?.directListings.buyFromListing(packListings[tokenId].id, 1);
        } else {
            throw new Error("No valid listing found");
        }
    };

    const mediaStyle = {
        width: "100%",
        height: "300px", // Keeping the original height
        objectFit: "contain" as const, // Ensuring objectFit is typed correctly
        borderRadius: "8px",
        transform: "scale(2)", // Scaling the model up 2x
        transformOrigin: "center center" // Ensuring the model scales from its center
    };

    return (
        <div className={styles.packCard}>
            {!loadingNFT && !loadingPackListings ? (
                <div className={styles.shopPack}>
                    <div className={styles.mediaGrid} style={{ overflow: 'hidden' }}> {/* Ensuring overflow from scaling is hidden */}
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
                                action={buyPack}
                            >
                                Buy Pack
                            </Web3Button>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
