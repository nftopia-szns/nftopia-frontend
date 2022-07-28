import type { ContractTransaction } from "ethers";
import { BN_ZERO } from "../../constants/eth";
import { Network, PolygonChainId } from "nftopia-shared/dist/shared/network";
import { ContractInfo, ContractType } from "nftopia-shared/dist/shared/contract"
import { AcceptBidPayload, CancelBidPayload, CreateBidPayload } from "./bid-slice";
import { ERC721NFTMarket__factory, IERC20__factory } from "../../contracts/nftopia-mpsc/typechain-types";
import { RootState } from "../store";

export class BidService {
    async createBid(
        state: RootState,
        payload: CreateBidPayload
    ) {
        let tx: ContractTransaction;
        const { wallet, bid } = state;
        const { asset } = bid

        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        const mpAddr = ContractInfo[ContractType.Marketplace][Network.Polygon][PolygonChainId.Mumbai];
                        const mpContract = ERC721NFTMarket__factory.connect(
                            mpAddr,
                            wallet.ethWallet.provider.getSigner()
                        )

                        const quoteTokenAddr = payload.quoteToken
                        const quoteToken = IERC20__factory.connect(
                            quoteTokenAddr,
                            wallet.ethWallet.provider.getSigner()
                        )

                        const allowance = await quoteToken.allowance(wallet.ethWallet.account, mpAddr)
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

                        const _fingerprint =
                            payload.fingerprint ?? "0x0000000000000000000000000000000000000000000000000000000000000000";

                        tx = await mpContract.createBid(
                            asset.contract_address,
                            asset.id,
                            quoteTokenAddr,
                            payload.price,
                            _fingerprint,
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

    async cancelBid(
        state: RootState,
        payload: CancelBidPayload,
    ) {
        let tx: ContractTransaction;
        const { wallet, bid } = state;
        const { asset } = bid

        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        const mpAddr = ContractInfo[ContractType.Marketplace][Network.Polygon][PolygonChainId.Mumbai];
                        const mpContract = ERC721NFTMarket__factory.connect(
                            mpAddr,
                            wallet.ethWallet.provider.getSigner()
                        )

                        tx = await mpContract.cancelBid(
                            asset.contract_address,
                            asset.id,
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

    async acceptBid(
        state: RootState,
        payload: AcceptBidPayload,
    ) {
        let tx: ContractTransaction;
        const { wallet, bid } = state;
        const { asset } = bid

        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        const mpAddr = ContractInfo[ContractType.Marketplace][Network.Polygon][PolygonChainId.Mumbai];
                        const mpContract = ERC721NFTMarket__factory.connect(
                            mpAddr,
                            wallet.ethWallet.provider.getSigner()
                        )

                        tx = await mpContract.acceptBid(
                            asset.contract_address,
                            asset.id,
                            payload.bid.bidder,
                            payload.bid.quoteToken,
                            payload.bid.price,
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
}