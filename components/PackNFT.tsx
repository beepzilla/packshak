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

    const activeListings = packListings?.filter(listing => listing.status === "active");
    const listingForToken = activeListings?.find(listing => listing.tokenId.toString() === tokenId.toString());

    async function buyPack() {
        if (listingForToken) {
            const txResult = await marketplace?.directListings.buyFromListing(
                listingForToken.id,
                1
            );
            return txResult;
        } else {
            throw new Error("No valid listing found");
        }
    };

    return (
        <div className={styles.packCard}>
            {!loadingNFT && !loadingPackListings ? (
                <div className={styles.shopPack}>
                    <div>
                        {packNFT?.metadata && (
                            <ThirdwebNftMedia
                                metadata={packNFT.metadata}
                            />
                        )}
                    </div>
                    <div className={styles.packInfo}>
                        <h3>{packNFT?.metadata.name}</h3>
                        {listingForToken ? (
                            <>
                                <p>Cost: {listingForToken.currencyValuePerToken.displayValue} {` ` + listingForToken.currencyValuePerToken.symbol}</p>
                                <p>Supply: {listingForToken.quantity}</p>
                                {!address ? (
                                    <p>Login to buy</p>
                                ) : (
                                    <Web3Button
                                        contractAddress={MARKETPLACE_ADDRESS}
                                        action={() => buyPack()}
                                    >Buy Pack</Web3Button>
                                )}
                            </>
                        ) : (
                            <p>No active listings found</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
