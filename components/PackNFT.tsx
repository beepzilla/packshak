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

    const { data: packListings, isLoading: loadingPackListings } = 
    useDirectListings(
        marketplace,
        {
            tokenContract: PACK_ADDRESS,
        }
    );
    
    const listing = packListings?.find(listing => listing.asset.id === tokenId);

    async function buyPack() {
        if (listing) {
            const txResult = await marketplace?.directListings.buyFromListing(
                listing.id,
                1
            );
            return txResult;
        } else {
            throw new Error("No valid listing found");
        }
    };

    const mediaStyle = {
        width: "100%",
        height: "300px",
        objectFit: "contain",
        borderRadius: "8px",
    };

    return (
        <div className={styles.packCard}>
            {!loadingNFT && !loadingPackListings && listing ? (
                <div className={styles.shopPack}>
                    <div className={styles.mediaGrid}>
                        {packNFT?.metadata && (
                            <ThirdwebNftMedia metadata={packNFT.metadata} style={mediaStyle} />
                        )}
                    </div>
                    <div className={styles.packInfo}>
                        <h3>{packNFT?.metadata?.name}</h3>
                        <p>Cost: {listing.currencyValuePerToken.displayValue} {listing.currencyValuePerToken.symbol}</p>
                        <p>Supply: {listing.quantity}</p>
                        {!address ? (
                            <p>Login to buy</p>
                        ) : (
                            <Web3Button
                                contractAddress={MARKETPLACE_ADDRESS}
                                action={() => buyPack()}
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
    )
};
