import { useCallback, useEffect, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { useWeb3React } from '@web3-react/core'
import { ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, BigNumberish } from 'ethers'
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types'
import { ERC721__factory, EstateRegistry__factory, LANDRegistry__factory } from '../../contracts/land-contract/typechain-new'
import { Marketplace__factory } from '../../contracts/land-contract/typechain'
import { isExpiredFromNow } from '../../utils'
import { IERC721__factory } from '../../contracts/bid-contract/typechain-types'

export interface Order {
  id: string
  seller: string
  nftAddress: string
  price: BigNumber
  expiresAt: BigNumberish
}

export enum ASSET_ERRORS {
  OWNER = "Cannot get asset owner!",
  ORDER = "Cannot get asset order!",
}

export enum LOADING_TASKS {
  OWNER,
  ORDER,
  FINGERPRINT,
}

export const useAssetHook = (asset: DecentralandSearchHitDto) => {
  const { provider } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)

  // exposed states
  const [fingerprint, setFingerprint] = useState<string>(undefined)
  const [owner, setOwner] = useState<string>(undefined)
  const [order, setOrder] = useState<Order>(undefined)
  const [orderExpired, setOrderExpired] = useState<boolean>(false)

  const [buyable, setBuyable] = useState(false)
  const [errors, setErrors] = useState<Set<ASSET_ERRORS>>(new Set())

  useEffect(() => {
    if (provider && asset !== null) {
      setIsLoading(true)
      const pOwner = getOwner();
      const pOrder = getOrder();
      const pFingerprint = getFingerprint();
      Promise.all([
        pOwner,
        pOrder,
        pFingerprint,
      ]).finally(() => setIsLoading(false))
    }
  }, [provider, asset])

  const getOwner = useCallback(async () => {
    if (asset.category === NFTCategory.ESTATE) {
      const estateRegistry = EstateRegistry__factory.connect(asset.contract_address, provider)
      try {
        const _owner = await estateRegistry.ownerOf(asset.token_id)

        setOwner(_owner)
        errors.delete(ASSET_ERRORS.OWNER)
        setErrors(new Set(errors))
      } catch (error) {
        console.error(error);
        setOwner(undefined)
        setErrors(new Set(errors.add(ASSET_ERRORS.OWNER)))
      }
    } else {
      const landRegistry = LANDRegistry__factory.connect(asset.contract_address, provider)
      try {
        const _owner = await landRegistry.ownerOf(asset.token_id)

        setOwner(_owner)
        errors.delete(ASSET_ERRORS.OWNER)
        setErrors(new Set(errors))
      } catch (error) {
        console.error(error);
        setOwner(undefined)
        setErrors(new Set(errors.add(ASSET_ERRORS.OWNER)))
      }
    }
  }, [provider, asset])

  const getOrder = useCallback(async () => {
    const marketplaceContractData = getContract(
      ContractName.Marketplace,
      asset.chain_id
    )
    const marketplaceContract = Marketplace__factory.connect(marketplaceContractData.address, provider)

    // check token's order existence in marketplace
    try {
      const _order = await marketplaceContract.orderByAssetId(asset.contract_address, asset.token_id)
      setOrder(_order)
      setOrderExpired(isExpiredFromNow(_order.expiresAt.valueOf() as number || 0))
      errors.delete(ASSET_ERRORS.ORDER)
      setErrors(new Set(errors))
    } catch (error) {
      setOrder(undefined)
      // if order doesn't exist, consider it is expired
      setOrderExpired(true)
      setErrors(new Set(errors.add(ASSET_ERRORS.ORDER)))
    }
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

  useEffect(() => {
    setBuyable(
      owner &&
      order && true)
  }, [owner, order])

  return {
    fingerprint,
    owner,
    order,
    orderExpired,
    buyable,
    errors,
    isLoading
  } as const
}