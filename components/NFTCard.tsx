import {
  ThirdwebNftMedia,
  useContract,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import type { FC } from "react";
import { BigNumber, ethers } from "ethers"; // Import BigNumber and ethers for formatting
import {
  CARD_ADDRESS,
  STAKING_ADDRESS,
} from "../const/addresses";
import styles from "../styles/Home.module.css";

interface NFTCardProps {
  tokenId: number;
  totalQuantityStaked: BigNumber; // Assuming totalQuantityStaked is a BigNumber
}

const NFTCard: FC<NFTCardProps> = ({ tokenId, totalQuantityStaked }) => {
  const { contract } = useContract(CARD_ADDRESS, "edition");
  const { data: nft } = useNFT(contract, tokenId);

  // Helper function to format BigNumber to string for display
  const formatQuantityStaked = (quantity: BigNumber) => {
    return ethers.utils.formatUnits(quantity, 0); // Assuming no decimals are needed
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
          {/* Conditionally display the quantity staked if it's greater than 0 */}
          {totalQuantityStaked.gt(0) && (
            <p>Quantity Staked: {formatQuantityStaked(totalQuantityStaked)}</p>
          )}
          <Web3Button
            action={(contract) =>
              contract?.call("withdraw", [nft.metadata.id, 1])
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
