import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { ContractData, ContractName, getContract } from "decentraland-transactions";
import { Network } from "../../components/asset/DecentralandAsset/DecentralandAsset.type";
import { ERC721Bid__factory, FakeERC20__factory } from "../../contracts/bid-contract/typechain-types";
import type { ContractTransaction } from "ethers";
import { DecentralandSearchHitDto } from "../../pages/api/search/search.types";
import { BN_ZERO } from "../../constants/eth";

export class BidService {
    async place(
        caller: string,
        provider: Web3Provider,
        asset: DecentralandSearchHitDto,
        price: BigNumber,
        duration: number,
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
                const contractBidData: ContractData = getContract(
                    ContractName.Bid,
                    asset.chain_id,
                )
                const contractMana = FakeERC20__factory.connect(
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
                        BigNumber.from(asset.token_id),
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
                        BigNumber.from(asset.token_id),
                        price,
                        duration,
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

    // TODO: add more bid functions: https://github.com/decentraland/bid-contract

}