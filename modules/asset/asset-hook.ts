import { useCallback, useEffect, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { useWeb3React } from '@web3-react/core'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, BigNumberish } from 'ethers'
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types'
import { EstateRegistry__factory, IERC721Base__factory } from '../../contracts/land-contract/typechain-new'
import { Marketplace__factory } from '../../contracts/land-contract/typechain'
import { isValidOrder } from '../../utils'
import { ERC721Bid__factory } from '../../contracts/bid-contract/typechain-types/factories/contracts/bid'
import { formatEther } from '@ethersproject/units'

export interface Order {
  id: string
  seller: string
  nftAddress: string
  price: BigNumber
  expiresAt: BigNumberish
}

export interface Bid {
  id: string,
  bidder: string,
  price: string,
  expiresAt: number,
}

export enum ASSET_ERRORS {
  OWNER = "Cannot get asset owner!",
  ORDER = "Cannot get asset order!",
  INVALID_ORDER = "Asset order is invalid!",
}

export enum LOADING_TASKS {
  OWNER,
  ORDER,
  FINGERPRINT,
}

export const useAssetHook = (asset: DecentralandSearchHitDto) => {
  const { account, provider } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)

  // exposed states
  const [fingerprint, setFingerprint] = useState<string>(undefined)
  const [owner, setOwner] = useState<string>(undefined)
  const [order, setOrder] = useState<Order>(undefined)
  const [bids, setBids] = useState<Bid[]>([])

  const [buyable, setBuyable] = useState(false)
  const [errors, setErrors] = useState<Set<ASSET_ERRORS>>(new Set())

  useEffect(() => {
    if (provider && asset !== null) {
      setIsLoading(true)
      const pOwner = getOwner();
      const pOrder = getOrder();
      const pFingerprint = getFingerprint();
      const pBids = getBids();
      Promise.all([
        pOwner,
        pOrder,
        pFingerprint,
        pBids,
      ]).then((value) => {
        setErrors(new Set<ASSET_ERRORS>([
          ...Array.from(value[0]),
          ...Array.from(value[1])
        ]))
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [provider, asset])

  const getOwner = useCallback(async () => {
    const errors = new Set<ASSET_ERRORS>()
    const assetRegistry = IERC721Base__factory.connect(asset.contract_address, provider)

    try {
      const _owner = await assetRegistry.ownerOf(asset.token_id)
      setOwner(_owner)
    } catch (error) {
      console.error(error);
      setOwner(undefined)
      errors.add(ASSET_ERRORS.OWNER)
    }

    return errors
  }, [provider, asset])

  const getOrder = useCallback(async () => {
    const errors = new Set<ASSET_ERRORS>()
    const marketplaceContractData = getContract(
      ContractName.Marketplace,
      asset.chain_id
    )
    const marketplaceContract = Marketplace__factory.connect(marketplaceContractData.address, provider)

    // check token's order existence in marketplace
    try {
      const _order = await marketplaceContract.orderByAssetId(asset.contract_address, asset.token_id)
      if (isValidOrder(_order)) {
        setOrder(_order)
      } else {
        setOrder(undefined)
        errors.add(ASSET_ERRORS.INVALID_ORDER)
      }
    } catch (error) {
      setOrder(undefined)
      // if order doesn't exist, consider it is expired
      errors.add(ASSET_ERRORS.ORDER)
    }

    return errors
  }, [provider, asset])

  const getFingerprint = useCallback(async () => {
    if (asset.category === NFTCategory.ESTATE) {
      try {
        const _estateRegistry = EstateRegistry__factory.connect(
          asset.contract_address,
          provider
        )
        const fingerprint = await _estateRegistry.getFingerprint(asset.token_id)
        setFingerprint(fingerprint)
      } catch (error) {
        // do nothing
      }
    }
  }, [provider, asset])

  const getBids = useCallback(async () => {
    const contractBidData: ContractData = getContract(
      ContractName.Bid,
      asset.chain_id,
    )
    const contractBid = ERC721Bid__factory.connect(
      contractBidData.address,
      provider,
    )

    let bids: Bid[] = []

    const bidCounter = await contractBid.bidCounterByToken(asset.contract_address, asset.token_id)
    for (let i = 0; i < bidCounter.toNumber(); i++) {
      const _bid = await contractBid.getBidByToken(asset.contract_address, asset.token_id, i)
      bids.push({
        id: _bid[0],
        bidder: _bid[1],
        price: formatEther(_bid[2]),
        expiresAt: _bid[3].toNumber()
      })
    }
    setBids(bids)
    console.log(bids);

  }, [provider, asset])

  useEffect(() => {
    setBuyable(
      owner &&
      isValidOrder(order) && true)
  }, [owner, order])

  return {
    fingerprint,
    owner,
    order,
    bids,
    buyable,
    errors,
    isLoading
  } as const
}