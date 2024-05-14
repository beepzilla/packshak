import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS } from "../const/addresses";

type Props = {
  reward: {
    tokenId: string | number | bigint | BigNumber;
    contractAddress: string;
    quantityPerReward: string | number | bigint | BigNumber;
  };
};

export const PackRewardCard = ({ reward }: Props) => {
  const { contract } = useContract(CARD_ADDRESS, "edition");
  const { data: nft } = useNFT(contract, reward.tokenId);

  const mediaStyle = {
    maxHeight: '300px',
    width: '100%',
    objectFit: 'contain' as 'contain',
    borderRadius: '8px'
  };

  return (
    <div className={styles.nftCard}>
      {nft && (
        <div className={styles.nftBox}>
          <div className={styles.mediaGrid}>
            <ThirdwebNftMedia metadata={nft.metadata} style={mediaStyle} />
            {nft.metadata.image && (
              <img src={nft.metadata.image} alt={`${nft.metadata.name}`} style={mediaStyle} />
            )}
          </div>
          <div className={styles.cardInfo}>
            <h3>{nft.metadata.name}</h3>
            <p>Qty: {reward.quantityPerReward.toString()}</p>
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
        </div>
      )}
    </div>
  );
};
