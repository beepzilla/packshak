import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from "@thirdweb-dev/react";
import type { FC } from "react";
import { useState } from "react"; // Import useState for managing input state
import { BigNumber, ethers } from "ethers";
import { CARD_ADDRESS, STAKING_ADDRESS } from "../const/addresses";
import styles from "../styles/Home.module.css";

interface NFTCardProps {
  tokenId: number;
  totalQuantityStaked: BigNumber;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId, totalQuantityStaked }) => {
  const { contract } = useContract(CARD_ADDRESS, "edition");
  const { data: nft } = useNFT(contract, tokenId);
  const [withdrawQuantity, setWithdrawQuantity] = useState("1"); // State to manage withdraw quantity

  // Format quantity for display
  const formatQuantityStaked = (quantity: BigNumber) => {
    return ethers.utils.formatUnits(quantity, 0);
  };

  return (
    <>
      {nft && (
        <div className={styles.nftBox}>
          {nft.metadata && (
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.nftMedia}
            />
          )}
          <h3>{nft.metadata.name}</h3>
          {totalQuantityStaked.gt(0) && (
            <p>Quantity Staked: {formatQuantityStaked(totalQuantityStaked)}</p>
          )}
          <input
            type="number"
            min="1"
            max={formatQuantityStaked(totalQuantityStaked)}
            value={withdrawQuantity}
            onChange={(e) => setWithdrawQuantity(e.target.value)}
            style={{
              width: "150px",
              borderRadius: "10px",
              margin: "5px",
            }}
          />
          <Web3Button
            action={(contract) =>
              contract?.call("withdraw", [nft.metadata.id, parseInt(withdrawQuantity)])
            }
            style={{
              marginBottom: "5px",
            }}
            contractAddress={STAKING_ADDRESS}
          >
            Withdraw
          </Web3Button>
          <Web3Button
            action={(contract) =>
              contract?.call("withdraw", [nft.metadata.id, totalQuantityStaked.toString()])
            }
            contractAddress={STAKING_ADDRESS}
          >
            Withdraw All
          </Web3Button>
        </div>
      )}
    </>
  );
};

export default NFTCard;
