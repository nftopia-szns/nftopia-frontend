import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import {
    ContractData,
    ContractName,
    getContract,
} from "decentraland-transactions";
import type { ContractTransaction } from "ethers";
import { BN_ZERO } from "../../constants/eth";
import { ERC20__factory, ERC721Bid__factory, ERC721__factory } from "../../contracts/land-contract/typechain";
import { EthereumChainId, Network, PolygonChainId, toCanonicalEthereumChainId } from "nftopia-shared/dist/shared/network";
import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform";
import { ContractInfo, ContractType } from "nftopia-shared/dist/shared/contract"
import { CreateBidPayload } from "./bid-slice";
import { ERC721NFTMarket__factory, IERC20__factory } from "../../contracts/nftopia-mpsc/typechain-types";
import { WalletState } from "../wallet/wallet-slice";

export class BidService {
    async place(
        provider: Web3Provider,
        caller: string,
        asset: GenericAssetDto,
        price: BigNumber,
        duration: number,
        fingerprint?: string
    ) {
        let tx: ContractTransaction;
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                switch (asset.network) {
                    case Network.Ethereum:
                        // get info
                        const contractManaData: ContractData = getContract(
                            ContractName.MANAToken,
                            toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
                        )
                        const contractBidData: ContractData = getContract(
                            ContractName.Bid,
                            toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
                        )
                        const contractMana = ERC20__factory.connect(
                            contractManaData.address,
                            provider.getSigner(),
                        )
                        const contractBid = ERC721Bid__factory.connect(
                            contractBidData.address,
                            provider.getSigner(),
                        )
                        const allowance = await contractMana.allowance(caller, contractBid.address)
                        // ask for more allowance if it's lower than the price
                        if (allowance.lt(price)) {
                            // reset approve allowance to zero
                            if (allowance.gt(0)) {
                                let tx = await contractMana.approve(
                                    contractBid.address,
                                    BN_ZERO,
                                    {
                                        gasLimit: 300000
                                    }
                                )
                                await tx.wait()
                            }

                            // approve the price
                            tx = await contractMana.approve(
                                contractBid.address,
                                price,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        }

                        if (fingerprint) {
                            tx = await contractBid['placeBid(address,uint256,uint256,uint256,bytes)'](
                                asset.contract_address,
                                BigNumber.from(asset.id),
                                price,
                                duration,
                                fingerprint,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        } else {
                            tx = await contractBid['placeBid(address,uint256,uint256,uint256)'](
                                asset.contract_address,
                                BigNumber.from(asset.id),
                                price,
                                duration,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        }
                        return
                    // case Network.MATIC: {
                    //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
                    //     //     asset.contract_address,
                    //     // BigNumber.from(asset.token_id),
                    //     //     priceInWei,
                    //     //     expiresIn
                    //     // )
                    // }
                    default:
                        console.error(`Bid service, place() does not support for ${asset.network}`)
                        return
                }
            default:
                console.error(`Bid service isn't support for platform ${asset.platform}`)
                break;
        }
    }

    async createBid(
        state: WalletState,
        payload: CreateBidPayload
    ) {
        let tx: ContractTransaction;

        const { asset,  } = payload

        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        const mpAddr = ContractInfo[ContractType.Marketplace][Network.Polygon][PolygonChainId.Mumbai];
                        const mpContract = ERC721NFTMarket__factory.connect(
                            mpAddr,
                            state.ethWallet.provider.getSigner()
                        )

                        const quoteTokenAddr = payload.quoteToken
                        const quoteToken = IERC20__factory.connect(
                            quoteTokenAddr,
                            state.ethWallet.provider.getSigner()
                        )
                        
                        const allowance = await quoteToken.allowance(state.ethWallet.account, mpAddr)
                        if (allowance.lt(payload.price)) {
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
                                payload.price,
                                {
                                    gasLimit: 300000
                                }
                            )
                            await tx.wait()
                        }

                        tx = await mpContract.createBid(
                            asset.contract_address,
                            asset.id,
                            quoteTokenAddr,
                            payload.price,
                            "0x0000000000000000000000000000000000000000000000000000000000000000",
                            {
                                gasLimit: 300000
                            }
                        )
                        await tx.wait()
                        break;

                    default:
                        console.error(`Bid service isn't support for network ${asset.network}, chainid ${asset.chain_id}`)
                        break;
                }
                break;

            default:
                console.error(`Bid service isn't support for network ${asset.network}`)
                break;
        }
    }

    // TODO: add more bid functions: https://github.com/decentraland/bid-contract
    async cancel(
        provider: Web3Provider,
        asset: GenericAssetDto,
    ) {
        let tx: ContractTransaction;
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                switch (asset.network) {
                    case Network.Ethereum: {
                        // get info
                        const contractBidData: ContractData = getContract(
                            ContractName.Bid,
                            toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
                        )
                        const contractBid = ERC721Bid__factory.connect(
                            contractBidData.address,
                            provider.getSigner(),
                        )
                        tx = await contractBid.cancelBid(
                            asset.contract_address,
                            BigNumber.from(asset.id),
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
                        console.error(`Bid service, cancel() does not support for ${asset.network}`)
                        return
                }

                break;

            default:
                console.error(`Bid service isn't support for platform ${asset.platform}`)
                break;
        }
    }

    async accept(
        provider: Web3Provider,
        caller: string,
        recipient: string,
        asset: GenericAssetDto,
    ) {
        let tx: ContractTransaction;
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                switch (asset.network) {
                    case Network.Ethereum:
                        // get info
                        const contractAsset = ERC721__factory.connect(
                            asset.contract_address,
                            provider.getSigner(),
                        )
                        tx = await contractAsset["safeTransferFrom(address,address,uint256)"](
                            caller,
                            recipient,
                            BigNumber.from(asset.id),
                            {
                                gasLimit: 300000
                            }
                        )
                        await tx.wait()
                        return
                    // case Network.MATIC: {
                    //     // return contractBid['placeBid(address,uint256,uint256,uint256)'](
                    //     //     asset.contract_address,
                    //     // BigNumber.from(asset.token_id),
                    //     //     priceInWei,
                    //     //     expiresIn
                    //     // )
                    // }
                    default:
                        console.error(`Bid service, accept() does not support for ${asset.network}`)
                        return
                }
            default:
                console.error(`Bid service isn't support for platform ${asset.platform}`)
                break;
        }
    }
}