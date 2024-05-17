import { MARKETPLACE_ADDRESS, PACK_ADDRESS } from "../const/addresses";
import { ThirdwebNftMedia, Web3Button, useAddress, useContract, useDirectListings, useNFT, useSendTransaction } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import styles from "../styles/Home.module.css";
import { prepareContractCall, resolveMethod } from "thirdweb";

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
    console.log("Pack Listings: ", packListings);

    const { mutate: sendTransaction, isLoading: isTxLoading, isError: isTxError } = useSendTransaction();

    async function buyPack() {
        if (!marketplace || !packListings?.[tokenId]) {
            throw new Error("No valid listing found or marketplace contract not loaded");
        }

        try {
            // Prepare the contract call
            const listing = packListings[tokenId];
            const totalPrice = listing.currencyValuePerToken.value.mul(1);

            const transaction = await prepareContractCall({
                contract: marketplace,
                method: resolveMethod("buyFromListing"),
                params: [listing.id, address, 1, listing.currencyValuePerToken.currency, totalPrice]
            });

            // Send the transaction
            const { transactionHash } = await sendTransaction(transaction);

            console.log("Transaction Hash:", transactionHash);
        } catch (error) {
            console.error("Error buying pack:", error);
        }
    }

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
                                isLoading={isTxLoading}
                                isError={isTxError}
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
