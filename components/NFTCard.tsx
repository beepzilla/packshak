import { FC } from 'react';
import { ThirdwebNftMedia, useNFT, useContract, Web3Button } from '@thirdweb-dev/react';

interface NFTCardProps {
    tokenID: number;
}

const NFTCard: FC<NFTCardProps> = ({ tokenID }) => {
    const laughingheadAddress = "0xDb0BAB07577a66bE8B84080bC0E2dAF9586127D8";
    const stakingAddress = "0xd778fE96C5de9331D4Dc4D0a557cA8237Ae4006c";

    const { contract: laughingheadsContract } = useContract(laughingheadAddress, "edition");
    const { contract: stakingContract } = useContract(stakingAddress);
    const { data: nft } = useNFT(laughingheadsContract, tokenID);

    async function withdraw(nftID: string) {
        if (!stakingContract) {
            console.error('Staking contract is not loaded.');
            return;
        }
        // Assuming the amount is 1 for example, adjust based on your smart contract's expectations
        const amount = 1; // This should match the contract's expected amount for withdrawal
        await stakingContract.call("withdraw", [nftID, amount]);
    }

    if (!nft) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h3>{nft.metadata.name}</h3>
            <ThirdwebNftMedia metadata={nft.metadata} />
            <Web3Button
                contractAddress={stakingAddress}
                action={() => withdraw(nft.metadata.id.toString())} // Ensure id is a string
            >
                Unstake
            </Web3Button>
        </div>
    );
};

export default NFTCard;
