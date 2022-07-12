import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, BigNumberish } from 'ethers'
import { ERC721Bid__factory, ERC721__factory, EstateRegistry__factory, Marketplace__factory } from '../../contracts/land-contract/typechain'
import { isValidOrder } from '../../utils'
import { formatEther } from '@ethersproject/units'
import { DecentralandAssetCategory, DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import { EthereumChainId, toCanonicalEthereumChainId } from 'nftopia-shared/dist/shared/network'

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

export const useDecentralandAssetHook = (asset: DecentralandAssetDto) => {
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
    const assetRegistry = ERC721__factory.connect(asset.contract_address, provider)

    try {
      const _owner = await assetRegistry.ownerOf(asset.id)
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
      toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)
    )
    const marketplaceContract = Marketplace__factory.connect(marketplaceContractData.address, provider)

    // check token's order existence in marketplace
    try {
      const _order = await marketplaceContract.orderByAssetId(asset.contract_address, asset.id)
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
    if (asset.attributes.category === DecentralandAssetCategory.Estate) {
      try {
        const _estateRegistry = EstateRegistry__factory.connect(
          asset.contract_address,
          provider
        )
        const fingerprint = await _estateRegistry.getFingerprint(asset.id)
        setFingerprint(fingerprint)
      } catch (error) {
        // do nothing
      }
    }
  }, [provider, asset])

  const getBids = useCallback(async () => {
    const contractBidData: ContractData = getContract(
      ContractName.Bid,
      toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)
    )
    const contractBid = ERC721Bid__factory.connect(
      contractBidData.address,
      provider,
    )

    let bids: Bid[] = []

    const bidCounter = await contractBid.bidCounterByToken(asset.contract_address, asset.id)
    for (let i = 0; i < bidCounter.toNumber(); i++) {
      const _bid = await contractBid.getBidByToken(asset.contract_address, asset.id, i)
      bids.push({
        id: _bid[0],
        bidder: _bid[1],
        price: formatEther(_bid[2]),
        expiresAt: _bid[3].toNumber()
      })
    }
    setBids(bids)
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