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
  const { contract: nftDropContract } = useContract(CARD_ADDRESS, "edition");
  const { contract: tokenContract } = useContract(KEK_ADDRESS, "token");
  const { contract, isLoading } = useContract(STAKING_ADDRESS);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const [quantity, setQuantity] = useState<number>(1);
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [
    address,
  ]);

  useEffect(() => {
    if (!contract || !address) return;

    const loadClaimableRewards = async () => {
      const stakeInfo = await contract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[2]);
    };

    loadClaimableRewards();

    const intervalId = setInterval(loadClaimableRewards, 5000);
    return () => clearInterval(intervalId);
  }, [address, contract]);

  async function claimRewardsForAll() {
    if (!address) return;

    const claimPromises = stakedTokens[0]?.map(async (stakedToken: BigNumber) => {
      const tx = await contract?.prepare("claimRewards", [stakedToken.toNumber()]);
      return tx?.encode();
    });

    const encodedTransactions = await Promise.all(claimPromises);
    await contract?.call("multicall", [encodedTransactions]);
  }

  async function stakeNft(id: string, quantityToStake: number) {
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

  const mediaStyle = {
    maxHeight: '300px',
    width: '100%',
    objectFit: 'contain' as 'contain',
    borderRadius: '8px'
  };

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.stakingContainer}>
        <h1 className={styles.stakingTitle}>Stake Your NFTs</h1>
        <hr className={`${styles.divider} ${styles.spacerTop}`} />
        {!address ? (
          <ConnectWallet />
        ) : (
          <>
            <div className={styles.tokensContainer}>
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
              <Web3Button
                contractAddress={STAKING_ADDRESS}
                action={async (contract) => {
                  await claimRewardsForAll();
                }}
              >
                Claim Rewards
              </Web3Button>
            </div>
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <h2>Your Staked NFTs</h2>
            <div className={styles.grid}>
              {stakedTokens && stakedTokens[0]?.map((stakedToken: BigNumber, index: number) => {
                const tokenId = stakedToken.toNumber();
                const nft = ownedNfts?.find((nft) => nft.metadata.id.toString() === tokenId.toString());
                return (
                  <div key={index} className={styles.nftCard}>
                    <NFTCard
                      tokenId={tokenId}
                      quantityOwned={nft ? parseInt(nft.quantityOwned!) : 0}
                      totalQuantityStaked={stakedTokens[1][index]}
                    />
                  </div>
                );
              })}
            </div>
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <h2>Your Unstaked NFTs</h2>
            <div className={styles.grid}>
              {ownedNfts?.map((nft, index) => (
                <div key={index} className={styles.nftCard}>
                  <NFTCard
                    tokenId={parseInt(nft.metadata.id)}
                    quantityOwned={parseInt(nft.quantityOwned!)}
                    stakeNft={(id, quantity) => stakeNft(id, quantity)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stake;
