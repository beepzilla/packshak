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

    const mediaStyle = {
        maxHeight: '300px',
        width: '100%',
        objectFit: 'contain' as 'contain', // Ensures the content is resized to fit while preserving aspect ratio without cropping
        borderRadius: '8px'
    };
    

    return (
        <div className={styles.container}>
            <h1>My Cards(unstaked)</h1>
            <h3>to sell card set the time to be after the current time not before for transaction to confirm, working to automate this</h3>
            <div className={styles.grid}>
                {!selectedNFT ? (
                    !loadingNFTCollection && !loadingNFTs ? (
                        nfts?.map((nft, index) => (
                            <div key={index} className={styles.nftCard}>
                                <div className={styles.mediaGrid}>
                                    <ThirdwebNftMedia metadata={nft.metadata} style={mediaStyle} />
                                    {nft.metadata.image && (
                                        <img src={nft.metadata.image ?? ''} alt={`${nft.metadata.name ?? ''}`} style={mediaStyle} />
                                    )}
                                </div>
                                <div className={styles.cardInfo}>
                                    <h3>{nft.metadata.name}</h3>
                                    <p>Qty: {nft.quantityOwned}</p>
                                    {nft.metadata.description && (
                                        <p className={styles.description}>{nft.metadata.description}</p>
                                    )}
                                    {nft.metadata.properties && typeof nft.metadata.rarity === 'object' && nft.metadata.rarity !== null && (
                                        <div className={styles.properties}>
                                            <h4>Properties:</h4>
                                            {Object.entries(nft.metadata.rarity).map(([key, value], i) => (
                                                <p key={i}>{`${key}: ${value}`}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setSelectedNFT(nft)} className={styles.saleButton}>
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
                            <ThirdwebNftMedia metadata={selectedNFT.metadata} style={mediaStyle} />
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
