import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { ContractData, ContractName, getContract } from "decentraland-transactions";
import moment from "moment";
import { Network } from "../../components/asset/DecentralandAsset/DecentralandAsset.type";
import { ERC721Bid__factory } from "../../contracts/bid-contract/typechain-types";
import type { ContractTransaction } from "ethers";
import { DecentralandSearchHitDto } from "../../pages/api/search/search.types";

export class BidService {
    async place(
        provider: Web3Provider,
        asset: DecentralandSearchHitDto,
        price: number,
        expiresAt: number,
        fingerprint?: string
    ) {
        const priceInWei = parseUnits(price.toString(), 'ether')
        const expiresIn = Math.round((expiresAt - moment.utc().valueOf()) / 1000)

        let tx: ContractTransaction;
        switch (asset.network) {
            case Network.ETHEREUM: {
                // get info
                const contractBidData: ContractData = getContract(
                    ContractName.Bid,
                    asset.chain_id,
                )

                const contractBid = ERC721Bid__factory.connect(
                    contractBidData.address,
                    provider.getSigner(),
                )

                if (fingerprint) {
                    tx = await contractBid['placeBid(address,uint256,uint256,uint256,bytes)'](
                        asset.contract_address,
                        BigNumber.from(asset.token_id),
                        priceInWei,
                        expiresIn,
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
                        priceInWei,
                        expiresIn,
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