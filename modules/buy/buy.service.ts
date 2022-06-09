import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { ContractData, ContractName, getContract } from "decentraland-transactions";
import { Network } from "../../components/asset/DecentralandAsset/DecentralandAsset.type";
import { FakeERC20__factory } from "../../contracts/bid-contract/typechain-types";
import type { ContractTransaction } from "ethers";
import { Marketplace__factory } from "../../contracts/land-contract/typechain";
import { DecentralandSearchHitDto } from "../../pages/api/search/search.types";
import { BN_ZERO } from "../../constants/eth";

export class BuyService {
    /**
     * Listing an asset with a desired price and expiration (Unix time).
     */
    async createOrder(
        provider: Web3Provider,
        asset: DecentralandSearchHitDto,
        price: number,
        expiresAt: number,
        fingerprint?: string
    ) {

    }

    /**
     * Buy a listing for an asset. 
     * The price should match with the listed price and also the buyer should have at least that balance in MANA.
     */
    async executeOrder(
        caller: string,
        provider: Web3Provider,
        asset: DecentralandSearchHitDto,
        price: BigNumber,
        fingerprint?: string
    ) {
        let tx: ContractTransaction;
        switch (asset.network) {
            case Network.ETHEREUM: {
                // get info
                const contractManaData: ContractData = getContract(
                    ContractName.MANAToken,
                    asset.chain_id,
                )
                const contractMarketplaceData: ContractData = getContract(
                    ContractName.Marketplace,
                    asset.chain_id,
                )
                const contractMana = FakeERC20__factory.connect(
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
                        asset.token_id,
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
                        asset.token_id,
                        price,
                        {
                            gasLimit: 300000
                        }
                    )
                    await tx.wait()
                }
            }
            case Network.MATIC: {
                // return contractBid['placeBid(address,uint256,uint256,uint256)'](
                //     asset.contract_address,
                // BigNumber.from(asset.token_id),
                //     priceInWei,
                //     expiresIn
                // )
            }
        }
    }

    /**
     * Cancel a NFT listing.
     */
    async cancelOrder(
        provider: Web3Provider,
        asset: DecentralandSearchHitDto,
    ) {

    }
}