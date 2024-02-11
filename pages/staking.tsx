import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import {
  CARD_ADDRESS,
  STAKING_ADDRESS,
  KEK_ADDRESS,
} from "../const/addresses";
import styles from "../styles/Home.module.css";

const Stake: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(
    CARD_ADDRESS,
    "edition"
  );
  const { contract: tokenContract } = useContract(
    KEK_ADDRESS,
    "token"
  );
  const { contract, isLoading } = useContract(STAKING_ADDRESS);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const [quantity, setQuantity] = useState<Number>(1);
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [
    address,
  ]);
  

  useEffect(() => {
    if (!contract || !address) return;

    const loadClaimableRewards = async () => {
      const stakeInfo = await contract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[2]);
    };

    loadClaimableRewards(); // Initial load

    const intervalId = setInterval(loadClaimableRewards, 5000); // Set up the interval

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [address, contract]);

  async function claimRewardsForAll() {
    if (!address) return;

    const claimPromises = stakedTokens[0]?.map(async (stakedToken: BigNumber) => {
      const tx = await contract?.prepare("claimRewards", [stakedToken.toNumber()]);
      return tx?.encode();
    });

    const encodedTransactions = await Promise.all(claimPromises);

    // Encode the transactions and execute them via multicall
    await contract?.call("multicall", [encodedTransactions]);
  }

  async function stakeNft(id: string, quantityToStake: Number) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      STAKING_ADDRESS
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(STAKING_ADDRESS, true);
    }
    await contract?.call("stake", [id, quantityToStake]);
  }

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Stake Your NFTs</h1>
      <hr className={`${styles.divider} ${styles.spacerTop}`} />

      {!address ? (
        <ConnectWallet />
      ) : (
        <>
          <h2>Your Tokens</h2>
          <div className={styles.tokenGrid}>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
              <p className={styles.tokenValue}>
                <b>
                  {!claimableRewards
                    ? "No rewards"
                    : ethers.utils.formatUnits(claimableRewards, 18)}
                </b>{" "}
                {tokenBalance?.symbol}
              </p>
            </div>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Current Balance</h3>
              <p className={styles.tokenValue}>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
              </p>
            </div>
          </div>

          <Web3Button
            contractAddress={STAKING_ADDRESS}
            action={async (contract) => {
              await claimRewardsForAll();
            }}
          >
            Claim Rewards
          </Web3Button>

          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>Your Staked NFTs</h2>
          <div className={styles.nftBoxGrid}>
            {stakedTokens &&
              stakedTokens[0]?.map((stakedToken: BigNumber, index: any) => (
                <NFTCard
                  tokenId={stakedToken.toNumber()}
                  totalQuantityStaked={stakedTokens[1][index]}
                  key={stakedToken.toString()}
                />
              ))}
          </div>

          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>Your Unstaked NFTs</h2>
          <div className={styles.nftBoxGrid}>
            {ownedNfts?.map((nft) => (
              <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h3>{nft.metadata.name}</h3>
                <p>Owned - {nft.quantityOwned}</p>
                <input
                  type="number"
                  min="1"
                  max={nft.quantityOwned}
                  defaultValue="1"
                  style={{
                    width: "150px", 
                    borderRadius: "10px", 
                    margin: "5px",
                  }}
                  onChange={(e) => {
                    setQuantity(parseInt(e.target.value));
                  }}
                />
                <Web3Button
                  contractAddress={STAKING_ADDRESS}
                  action={() => stakeNft(nft.metadata.id, quantity)}
                  style={{
                    marginBottom: "5px",
                  }}
                >
                  Stake
                </Web3Button>
                <Web3Button
                  contractAddress={STAKING_ADDRESS}
                  action={() => {
                    stakeNft(nft.metadata.id, parseInt(nft?.quantityOwned!));
                  }}
                >
                  Stake All
                </Web3Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Stake;
