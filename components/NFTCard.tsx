import { ThirdwebNftMedia, Web3Button, useAddress, useContract, useDirectListing, useNFT } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS, MARKETPLACE_ADDRESS, STAKING_ADDRESS } from "../const/addresses";

interface NFTCardProps {
  tokenId: number;
  quantityOwned?: number;
  totalQuantityStaked?: BigNumber;
  stakeNft?: (id: string, quantity: number) => void;
  listingId?: string;
}

const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  quantityOwned,
  totalQuantityStaked,
  stakeNft,
  listingId,
}) => {
  const address = useAddress();
  const { contract } = useContract(CARD_ADDRESS, "edition");
  const { data: nft } = useNFT(contract, tokenId);
  const [stakeQuantity, setStakeQuantity] = useState(1);
  const [withdrawQuantity, setWithdrawQuantity] = useState("1");

  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
  const { data: listing, isLoading: loadingListing } = useDirectListing(marketplace, listingId);

  const formatQuantity = (quantity: number | BigNumber | undefined) => {
    if (!quantity) return "0";
    if (typeof quantity === "number") return quantity.toString();
    return ethers.utils.formatUnits(quantity, 0);
  };

  async function buyNFT() {
    if (!listing) {
      throw new Error("No valid listing found");
    }

    await marketplace?.directListings.buyFromListing(listing.id, 1);
  }

  const mediaStyle = {
    maxHeight: "300px",
    width: "100%",
    objectFit: "contain" as "contain",
    borderRadius: "8px",
  };

  return (
    <>
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
            {nft.metadata.description && (
              <p className={styles.description}>{nft.metadata.description}</p>
            )}
            {!totalQuantityStaked && quantityOwned !== undefined && (
              <p>Unstaked: {formatQuantity(quantityOwned)}</p>
            )}
            {totalQuantityStaked?.gt(0) && <p>Staked: {formatQuantity(totalQuantityStaked)}</p>}
            {listingId && (
              <>
                <p>
                  <strong>Price:</strong> {listing?.currencyValuePerToken.displayValue}{" "}
                  {listing?.currencyValuePerToken.symbol}
                </p>
                {!address ? (
                  <p>Please login to buy</p>
                ) : (
                  <Web3Button
                    contractAddress={MARKETPLACE_ADDRESS}
                    action={() => buyNFT()}
                    className={styles.buyButton}
                  >
                    Buy Now
                  </Web3Button>
                )}
              </>
            )}
            {stakeNft && quantityOwned !== undefined && (
              <>
                <input
                  type="number"
                  min="1"
                  max={formatQuantity(quantityOwned)}
                  value={stakeQuantity}
                  onChange={(e) => setStakeQuantity(parseInt(e.target.value))}
                  style={{ width: "150px", borderRadius: "10px", margin: "5px" }}
                />
                <Web3Button
                  contractAddress={STAKING_ADDRESS}
                  action={() => stakeNft(nft.metadata.id, stakeQuantity)}
                  style={{ marginBottom: "5px" }}
                >
                  Stake
                </Web3Button>
                <Web3Button
                  contractAddress={STAKING_ADDRESS}
                  action={() => stakeNft(nft.metadata.id, quantityOwned)}
                >
                  Stake All
                </Web3Button>
              </>
            )}
            {totalQuantityStaked?.gt(0) && (
              <>
                <input
                  type="number"
                  min="1"
                  max={formatQuantity(totalQuantityStaked)}
                  value={withdrawQuantity}
                  onChange={(e) => setWithdrawQuantity(e.target.value)}
                  style={{ width: "150px", borderRadius: "10px", margin: "5px" }}
                />
                <Web3Button
                  action={(contract) =>
                    contract?.call("withdraw", [nft.metadata.id, parseInt(withdrawQuantity)])
                  }
                  style={{ marginBottom: "5px" }}
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NFTCard;
