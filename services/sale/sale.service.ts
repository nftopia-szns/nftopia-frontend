import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { ContractData, ContractName, getContract } from "decentraland-transactions";
import type { ContractTransaction } from "ethers";
import { ERC20__factory, ERC721__factory, Marketplace__factory } from "../../contracts/land-contract/typechain";
import { BN_ZERO } from "../../constants/eth";
import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform";
import { EthereumChainId, Network, toCanonicalEthereumChainId } from "nftopia-shared/dist/shared/network";

export class SaleService {
    /**
     * Listing an asset with a desired price and expiration (Unix time).
     * @param provider web3 provider
     * @param asset the whole asset from search hit
     * @param price in wei
     * @param expiresAt epoch in miliseconds
     */
    async createOrder(
        provider: Web3Provider,
        asset: GenericAssetDto,
        price: BigNumber,
        expiresAt: number,
    ) {
        let tx: ContractTransaction;
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                switch (asset.network) {
                    case Network.Ethereum: {
                        // get info
                        const contractMarketplaceData: ContractData = getContract(
                            ContractName.Marketplace,
                            toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
                        )
                        const contractMarketplace = Marketplace__factory.connect(
                            contractMarketplaceData.address,
                            provider.getSigner(),
                        )

                        // approve contract marketplace to manage the asset
                        const assetRegistry = ERC721__factory.connect(asset.contract_address, provider.getSigner())
                        const isApprovedForAll = await assetRegistry.isApprovedForAll(asset.owner, contractMarketplaceData.address)

                        if (!isApprovedForAll) {
                            tx = await assetRegistry.setApprovalForAll(contractMarketplaceData.address, true);
                            await tx.wait()
                        }

                        tx = await contractMarketplace["createOrder(address,uint256,uint256,uint256)"](
                            asset.contract_address,
                            asset.id,
                            price,
                            expiresAt,
                            {
                                gasLimit: 300000
                            }
                        )
                        await tx.wait()
                    }
                    // case Network.MATIC: {
                    //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
                    //     //     asset.contract_address,
                    //     // BigNumber.from(asset.token_id),
                    //     //     priceInWei,
                    //     //     expiresIn
                    //     // )
                    // }
                    default:
                        console.error(`Sale service isn't support for network ${asset.network}`)
                        break;
                }
                break;
            default:
                console.error(`Sale service isn't support for platform ${asset.platform}`)
                break;
        }
    }

    /**
     * Buy a listing for an asset. 
     * The price should match with the listed price and also the buyer should have at least that balance in MANA.
     * 
     * @param caller the account that makes operation
     * @param provider web3 provider
     * @param asset  the whole asset from search hit
     * @param price in wei
     * @param fingerprint to make sure that estate does not change (add, remove parcels) while user makes buy action.
     */
    async executeOrder(
        caller: string,
        provider: Web3Provider,
        asset: GenericAssetDto,
        price: BigNumber,
        fingerprint?: string
    ) {
        let tx: ContractTransaction;
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                switch (asset.network) {
                    case Network.Ethereum: {
                        // get info
                        const contractManaData: ContractData = getContract(
                            ContractName.MANAToken,
                            toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
                        )
                        const contractMarketplaceData: ContractData = getContract(
                            ContractName.Marketplace,
                            toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
                        )
                        const contractMana = ERC20__factory.connect(
                            contractManaData.address,
                            provider.getSigner(),
                        )
                        const contractMarketplace = Marketplace__factory.connect(
                            contractMarketplaceData.address,
                            provider.getSigner(),
                        )

                        const allowance = await contractMana.allowance(caller, contractMarketplaceData.address)
                        // ask for more allowance if it's lower than the price
                        if (allowance.lt(price)) {
                            // reset approve allowance to zero
                            if (allowance.gt(0)) {
                                let tx = await contractMana.approve(
                                    contractMarketplaceData.address,
                                    BN_ZERO,
                                    {
                                        gasLimit: 300000
                                    }
                                )
                                await tx.wait()
                            }

                            // approve the price
                            tx = await contractMana.approve(
                                contractMarketplaceData.address,
                                price,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        }

                        if (fingerprint) {
                            tx = await contractMarketplace.safeExecuteOrder(
                                asset.contract_address,
                                asset.id,
                                price,
                                fingerprint,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        } else {
                            tx = await contractMarketplace["executeOrder(address,uint256,uint256)"](
                                asset.contract_address,
                                asset.id,
                                price,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        }
                    }
                    // case Network.MATIC: {
                    //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
                    //     //     asset.contract_address,
                    //     // BigNumber.from(asset.token_id),
                    //     //     priceInWei,
                    //     //     expiresIn
                    //     // )
                    // }
                    default:
                        console.error(`Sale service isn't support for network ${asset.network}`)
                        break;
                }
                break;
            default:
                console.error(`Sale service isn't support for platform ${asset.platform}`)
                break;
        }
    }

    /**
     * Cancel a NFT listing.
     */
    async cancelOrder(
        provider: Web3Provider,
        asset: GenericAssetDto,
    ) {
        let tx: ContractTransaction;
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                switch (asset.network) {
                    case Network.Ethereum: {
                        // get info
                        const contractMarketplaceData: ContractData = getContract(
                            ContractName.Marketplace,
                            toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
                        )
                        const contractMarketplace = Marketplace__factory.connect(
                            contractMarketplaceData.address,
                            provider.getSigner(),
                        )

                        tx = await contractMarketplace["cancelOrder(address,uint256)"](
                            asset.contract_address,
                            asset.id,
                            {
                                gasLimit: 300000
                            }
                        )
                        await tx.wait()
                    }
                    // case Network.MATIC: {
                    //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
                    //     //     asset.contract_address,
                    //     // BigNumber.from(asset.token_id),
                    //     //     priceInWei,
                    //     //     expiresIn
                    //     // )
                    // }
                    default:
                        console.error(`Sale service isn't support for network ${asset.network}`)
                        break;
                }
            default:
                console.error(`Sale service isn't support for platform ${asset.platform}`)
                break;
        }
    }
}