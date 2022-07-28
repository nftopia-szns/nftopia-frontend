import type { ContractTransaction } from "ethers";
import { Network, PolygonChainId } from "nftopia-shared/dist/shared/network";
import { BuyPayload, CancelSellingPayload, SellPayload } from "./sale-slice";
import { RootState } from "../store";
import { ContractInfo, ContractType } from "nftopia-shared/dist/shared/contract";
import { ERC20__factory, ERC721NFTMarket__factory } from "../../contracts/nftopia-mpsc/typechain-types";
import { ERC721__factory } from "../../contracts/land-contract/typechain";
import { BN_ZERO } from "../../constants/eth";

export class SaleService {
    async buy(
        state: RootState,
        payload: BuyPayload,
    ) {
        let tx: ContractTransaction;
        const { wallet, sale } = state;
        const { asset } = sale

        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        const mpAddr = ContractInfo[ContractType.Marketplace][Network.Polygon][PolygonChainId.Mumbai];
                        const mpContract = ERC721NFTMarket__factory.connect(
                            mpAddr,
                            wallet.ethWallet.provider.getSigner()
                        )

                        const quoteToken = ERC20__factory.connect(
                            payload.ask.quoteToken,
                            wallet.ethWallet.provider.getSigner()
                        )

                        const allowance = await quoteToken.allowance(wallet.ethWallet.account, mpAddr)
                        if (allowance.lt(payload.ask.price)) {
                            // reset approve allowance to zero
                            if (allowance.gt(0)) {
                                let tx = await quoteToken.approve(
                                    mpAddr,
                                    BN_ZERO,
                                    {
                                        gasLimit: 300000
                                    }
                                )
                                await tx.wait()
                            }

                            // approve the price
                            tx = await quoteToken.approve(
                                mpAddr,
                                payload.ask.price,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        }

                        const _fingerprint =
                            payload.fingerprint ?? "0x0000000000000000000000000000000000000000000000000000000000000000";

                        tx = await mpContract.buy(
                            asset.contract_address,
                            asset.id,
                            payload.ask.quoteToken,
                            payload.ask.price,
                            _fingerprint,
                            {
                                gasLimit: 300000
                            }
                        )
                        await tx.wait()
                        break;

                    default:
                        console.error(`Sale service isn't support for network ${asset.network}, chainid ${asset.chain_id}`)
                        break;
                }
                break;

            default:
                console.error(`Sale service isn't support for network ${asset.network}`)
                break;
        }
    }

    async cancelAsk(
        state: RootState,
        payload: CancelSellingPayload,
    ) {
        let tx: ContractTransaction;
        const { wallet, sale } = state;
        const { asset } = sale

        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        const mpAddr = ContractInfo[ContractType.Marketplace][Network.Polygon][PolygonChainId.Mumbai];
                        const mpContract = ERC721NFTMarket__factory.connect(
                            mpAddr,
                            wallet.ethWallet.provider.getSigner()
                        )

                        tx = await mpContract.cancelAsk(
                            asset.contract_address,
                            asset.id,
                            {
                                gasLimit: 300000
                            }
                        )
                        await tx.wait()
                        break;

                    default:
                        console.error(`Sale service isn't support for network ${asset.network}, chainid ${asset.chain_id}`)
                        break;
                }
                break;

            default:
                console.error(`Sale service isn't support for network ${asset.network}`)
                break;
        }
    }

    async createAsk(
        state: RootState,
        payload: SellPayload,
    ) {
        let tx: ContractTransaction;
        const { wallet, sale } = state;
        const { asset } = sale

        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        const mpAddr = ContractInfo[ContractType.Marketplace][Network.Polygon][PolygonChainId.Mumbai];
                        const mpContract = ERC721NFTMarket__factory.connect(
                            mpAddr,
                            wallet.ethWallet.provider.getSigner()
                        )

                        const nftContract = ERC721__factory.connect(
                            asset.contract_address,
                            wallet.ethWallet.provider.getSigner()
                        )

                        const nftSpender = await nftContract.getApproved(asset.id);
                        if (mpAddr !== nftSpender) {
                            tx = await nftContract.approve(mpAddr, asset.id)
                            await tx.wait()
                        }

                        const quoteTokenAddr = payload.quoteToken

                        tx = await mpContract.createAsk(
                            asset.contract_address,
                            asset.id,
                            quoteTokenAddr,
                            payload.price,
                            {
                                gasLimit: 300000
                            }
                        )
                        await tx.wait()
                        break;

                    default:
                        console.error(`Sale service isn't support for network ${asset.network}, chainid ${asset.chain_id}`)
                        break;
                }
                break;

            default:
                console.error(`Sale service isn't support for network ${asset.network}`)
                break;
        }
    }

    //     /**
    //  * Listing an asset with a desired price and expiration (Unix time).
    //  * @param provider web3 provider
    //  * @param asset the whole asset from search hit
    //  * @param price in wei
    //  * @param expiresAt epoch in miliseconds
    //  */
    //     async createOrder(
    //         provider: Web3Provider,
    //         asset: GenericAssetDto,
    //         price: BigNumber,
    //         expiresAt: number,
    //     ) {
    //         let tx: ContractTransaction;
    //         switch (asset.platform) {
    //             case MetaversePlatform.Decentraland:
    //                 switch (asset.network) {
    //                     case Network.Ethereum: {
    //                         // get info
    //                         const contractMarketplaceData: ContractData = getContract(
    //                             ContractName.Marketplace,
    //                             toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
    //                         )
    //                         const contractMarketplace = Marketplace__factory.connect(
    //                             contractMarketplaceData.address,
    //                             provider.getSigner(),
    //                         )

    //                         // approve contract marketplace to manage the asset
    //                         const assetRegistry = ERC721__factory.connect(asset.contract_address, provider.getSigner())
    //                         const isApprovedForAll = await assetRegistry.isApprovedForAll(asset.owner, contractMarketplaceData.address)

    //                         if (!isApprovedForAll) {
    //                             tx = await assetRegistry.setApprovalForAll(contractMarketplaceData.address, true);
    //                             await tx.wait()
    //                         }

    //                         tx = await contractMarketplace["createOrder(address,uint256,uint256,uint256)"](
    //                             asset.contract_address,
    //                             asset.id,
    //                             price,
    //                             expiresAt,
    //                             {
    //                                 gasLimit: 300000
    //                             }
    //                         )
    //                         await tx.wait()
    //                     }
    //                     // case Network.MATIC: {
    //                     //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
    //                     //     //     asset.contract_address,
    //                     //     // BigNumber.from(asset.token_id),
    //                     //     //     priceInWei,
    //                     //     //     expiresIn
    //                     //     // )
    //                     // }
    //                     default:
    //                         console.error(`Sale service isn't support for network ${asset.network}`)
    //                         break;
    //                 }
    //                 break;
    //             default:
    //                 console.error(`Sale service isn't support for platform ${asset.platform}`)
    //                 break;
    //         }
    //     }

    //     /**
    //      * Buy a listing for an asset. 
    //      * The price should match with the listed price and also the buyer should have at least that balance in MANA.
    //      * 
    //      * @param caller the account that makes operation
    //      * @param provider web3 provider
    //      * @param asset  the whole asset from search hit
    //      * @param price in wei
    //      * @param fingerprint to make sure that estate does not change (add, remove parcels) while user makes buy action.
    //      */
    //     async executeOrder(
    //         caller: string,
    //         provider: Web3Provider,
    //         asset: GenericAssetDto,
    //         price: BigNumber,
    //         fingerprint?: string
    //     ) {
    //         let tx: ContractTransaction;
    //         switch (asset.platform) {
    //             case MetaversePlatform.Decentraland:
    //                 switch (asset.network) {
    //                     case Network.Ethereum: {
    //                         // get info
    //                         const contractManaData: ContractData = getContract(
    //                             ContractName.MANAToken,
    //                             toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
    //                         )
    //                         const contractMarketplaceData: ContractData = getContract(
    //                             ContractName.Marketplace,
    //                             toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
    //                         )
    //                         const contractMana = ERC20__factory.connect(
    //                             contractManaData.address,
    //                             provider.getSigner(),
    //                         )
    //                         const contractMarketplace = Marketplace__factory.connect(
    //                             contractMarketplaceData.address,
    //                             provider.getSigner(),
    //                         )

    //                         const allowance = await contractMana.allowance(caller, contractMarketplaceData.address)
    //                         // ask for more allowance if it's lower than the price
    //                         if (allowance.lt(price)) {
    //                             // reset approve allowance to zero
    //                             if (allowance.gt(0)) {
    //                                 let tx = await contractMana.approve(
    //                                     contractMarketplaceData.address,
    //                                     BN_ZERO,
    //                                     {
    //                                         gasLimit: 300000
    //                                     }
    //                                 )
    //                                 await tx.wait()
    //                             }

    //                             // approve the price
    //                             tx = await contractMana.approve(
    //                                 contractMarketplaceData.address,
    //                                 price,
    //                                 {
    //                                     gasLimit: 300000
    //                                 }
    //                             )
    //                             await tx.wait()
    //                         }

    //                         if (fingerprint) {
    //                             tx = await contractMarketplace.safeExecuteOrder(
    //                                 asset.contract_address,
    //                                 asset.id,
    //                                 price,
    //                                 fingerprint,
    //                                 {
    //                                     gasLimit: 300000
    //                                 }
    //                             )
    //                             await tx.wait()
    //                         } else {
    //                             tx = await contractMarketplace["executeOrder(address,uint256,uint256)"](
    //                                 asset.contract_address,
    //                                 asset.id,
    //                                 price,
    //                                 {
    //                                     gasLimit: 300000
    //                                 }
    //                             )
    //                             await tx.wait()
    //                         }
    //                     }
    //                     // case Network.MATIC: {
    //                     //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
    //                     //     //     asset.contract_address,
    //                     //     // BigNumber.from(asset.token_id),
    //                     //     //     priceInWei,
    //                     //     //     expiresIn
    //                     //     // )
    //                     // }
    //                     default:
    //                         console.error(`Sale service isn't support for network ${asset.network}`)
    //                         break;
    //                 }
    //                 break;
    //             default:
    //                 console.error(`Sale service isn't support for platform ${asset.platform}`)
    //                 break;
    //         }
    //     }

    //     /**
    //      * Cancel a NFT listing.
    //      */
    //     async cancelOrder(
    //         provider: Web3Provider,
    //         asset: GenericAssetDto,
    //     ) {
    //         let tx: ContractTransaction;
    //         switch (asset.platform) {
    //             case MetaversePlatform.Decentraland:
    //                 switch (asset.network) {
    //                     case Network.Ethereum: {
    //                         // get info
    //                         const contractMarketplaceData: ContractData = getContract(
    //                             ContractName.Marketplace,
    //                             toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
    //                         )
    //                         const contractMarketplace = Marketplace__factory.connect(
    //                             contractMarketplaceData.address,
    //                             provider.getSigner(),
    //                         )

    //                         tx = await contractMarketplace["cancelOrder(address,uint256)"](
    //                             asset.contract_address,
    //                             asset.id,
    //                             {
    //                                 gasLimit: 300000
    //                             }
    //                         )
    //                         await tx.wait()
    //                     }
    //                     // case Network.MATIC: {
    //                     //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
    //                     //     //     asset.contract_address,
    //                     //     // BigNumber.from(asset.token_id),
    //                     //     //     priceInWei,
    //                     //     //     expiresIn
    //                     //     // )
    //                     // }
    //                     default:
    //                         console.error(`Sale service isn't support for network ${asset.network}`)
    //                         break;
    //                 }
    //             default:
    //                 console.error(`Sale service isn't support for platform ${asset.platform}`)
    //                 break;
    //         }
    //     }

}