import { ThirdwebNftMedia, Web3Button, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import { PACK_ADDRESS } from '../const/addresses';
import { useState } from 'react';
import { PackRewards } from '@thirdweb-dev/sdk';
import { PackRewardCard } from '../components/PackRewardCard';

export default function MyPacks() {
    const address = useAddress();

    const { contract } = useContract(PACK_ADDRESS, "pack");
    const { data, isLoading } = useOwnedNFTs(contract, address);

    const [openPackRewards, setOpenPackRewards] = useState<PackRewards>();

    async function openPack(packId: string) {
        const cardRewards = await contract?.open(parseInt(packId), 1);
        console.log(cardRewards);
        setOpenPackRewards(cardRewards);
    };
    
    
    return (
        <div className={styles.container}>
            <h1>My Packs</h1>
            <p>to open packs edit gaslimit in custom gas advanced menu from 500,000 to 1500000 (working on getting this fixed)</p>
            <div className={styles.grid}>
                {!isLoading ? (
                    data?.map((pack, index) => (
                        <div key={index} className={styles.nftCard}>
                            <ThirdwebNftMedia
                            metadata={pack.metadata}
                            />
                            <div className={styles.myCardInfo}>
                                <h3>{pack.metadata.name}</h3>
                                <p>Qty: {pack.quantityOwned}</p>
                            </div>
                            <Web3Button
                                contractAddress={PACK_ADDRESS}
                                action={() => openPack(pack.metadata.id)}
                                className={styles.saleButton}
                            >Open Pack</Web3Button>
                        </div>
                    ))
                    ) : (
                    <p>Loading...</p>
                )}
            </div>
            {openPackRewards && openPackRewards.erc1155Rewards?.length && (
                <div className={styles.container}>
                    <h3>Pack Rewards:</h3>
                    <div className={styles.grid}>
                        {openPackRewards.erc1155Rewards.map((card, index) => (
                        <PackRewardCard
                            reward={card}
                            key={index}
                        />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
