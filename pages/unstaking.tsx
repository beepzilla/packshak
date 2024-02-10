import { useContract, useAddress, useContractRead, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import NFTCard from "../components/NFTCard"; // Assuming this path is correct
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

const Home: NextPage = () => {
  const address = useAddress();
  const stakingAddress = "0xd778fE96C5de9331D4Dc4D0a557cA8237Ae4006c";
  const laughingheadAddress = "0xDb0BAB07577a66bE8B84080bC0E2dAF9586127D8";
  const { contract: stakingContract } = useContract(stakingAddress);
  const { data: stakedInfo, refetch: refetchStakedNFTs } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  useEffect(() => {
    const loadClaimableRewards = async () => {
      if (!stakingContract || !address) return;
      const stakeInfo = await stakingContract.call("getStakeInfo", [address]);
      if (stakeInfo && stakeInfo.length > 2) {
        setClaimableRewards(stakeInfo[2]);
      } else {
        console.error('Stake info returned unexpected data:', stakeInfo);
      }
    };
    loadClaimableRewards();
  }, [address, stakingContract]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Unstake Your NFTs</h1>
        <div className={styles.grid}>
          {stakedInfo && stakedInfo[0] && stakedInfo[0].map((tokenId: BigNumber, index: number) => (
            <div key={index}>
              <NFTCard tokenID={tokenId.toNumber()} />
            </div>
          ))}
        </div>
        <br />
        <h1>Claimable Rewards</h1>
        {!claimableRewards ? "Loading..." : ethers.utils.formatEther(claimableRewards)}
        <Web3Button
          contractAddress={stakingAddress}
          action={(stakingContract) => stakingContract.call("claimRewards")}
        >
          Claim
        </Web3Button>
      </main>
    </div>
  );
};

export default Home;
