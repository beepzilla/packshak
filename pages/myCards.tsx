import { useState } from "react";
import { useAddress, useContract, useOwnedNFTs, ThirdwebNftMedia } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS } from "../const/addresses";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { ListingInfo } from "../components/ListingInfo";

export default function MyCards() {
    const address = useAddress();

    const {
        contract: nftCollection,
        isLoading: loadingNFTCollection,
    } = useContract(CARD_ADDRESS, "edition");

    const {
        data: nfts,
        isLoading: loadingNFTs,
    } = useOwnedNFTs(nftCollection, address);

    const [selectedNFT, setSelectedNFT] = useState<NFTType>();

    return (
        <div className={styles.container}>
            <h1>My Cards</h1>
            <div className={styles.grid}>
                {!selectedNFT ? (
                    !loadingNFTCollection && !loadingNFTs ? (
                        nfts?.map((nft, index) => (
                            <div key={index} className={styles.nftCard}>
                                <ThirdwebNftMedia metadata={nft.metadata} />
                                <div className={styles.myCardInfo}>
                                    <h3>{nft.metadata.name}</h3>
                                    <p>Qty: {nft.quantityOwned}</p>
                                    {nft.metadata.description && (
                                        <p className={styles.description}>{nft.metadata.description}</p>
                                    )}
                                    {nft.metadata.image && (
                                        <img src={nft.metadata.image ?? ''} alt={`${nft.metadata.name ?? ''}`} style={{ width: '75%', height: 'auto' }} />
                                    )}
                                    {/* Displaying properties metadata */}
                                    {nft.metadata.properties && typeof nft.metadata.rarity === 'object' && nft.metadata.rarity !== null && (
                                        <div className={styles.properties}>
                                            <h4>Properties:</h4>
                                            {Object.entries(nft.metadata.rarity).map(([key, value], i) => (
                                                <p key={i}>{`${key}: ${value}`}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedNFT(nft)}
                                    className={styles.saleButton}
                                >
                                    Sell Card
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )
                ) : (
                    <div className={styles.saleCard}>
                        <div>
                            <button onClick={() => setSelectedNFT(undefined)}>Back</button>
                            <br />
                            <ThirdwebNftMedia metadata={selectedNFT.metadata} />
                        </div>
                        <div>
                            <p>List card for sale</p>
                            <ListingInfo nft={selectedNFT} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
