import {
    ThirdwebNftMedia,
    useContract,
    useNFT,
    Web3Button,
  } from "@thirdweb-dev/react";
  import type { FC } from "react";
  import {
<<<<<<< HEAD
    editionDropContractAddress,
    stakingContractAddress,
=======
    CARD_ADDRESS,
    STAKING_ADDRESS,
>>>>>>> new-branch-name
  } from "../const/addresses";
  import styles from "../styles/Home.module.css";
  
  interface NFTCardProps {
    tokenId: number;
    totalQuantityStaked: number
  }
  
  const NFTCard: FC<NFTCardProps> = ({ tokenId, totalQuantityStaked }) => {
<<<<<<< HEAD
    const { contract } = useContract(editionDropContractAddress, "edition");
=======
    const { contract } = useContract(CARD_ADDRESS, "edition");
>>>>>>> new-branch-name
    const { data: nft } = useNFT(contract, tokenId);
  
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
            <Web3Button
              action={(contract) =>
                contract?.call("withdraw", [nft.metadata.id, 1])
              }
              style={{
                marginBottom: "5px",
              }}
<<<<<<< HEAD
              contractAddress={stakingContractAddress}
=======
              contractAddress={STAKING_ADDRESS}
>>>>>>> new-branch-name
            >
              Withdraw
            </Web3Button>
            <Web3Button
              action={(contract) =>
                contract?.call("withdraw", [nft.metadata.id, totalQuantityStaked.toString()])
              }
<<<<<<< HEAD
              contractAddress={stakingContractAddress}
=======
              contractAddress={STAKING_ADDRESS}
>>>>>>> new-branch-name
            >
              Withdraw All
            </Web3Button>
          </div>
        )}
      </>
    );
  };
  
  export default NFTCard;