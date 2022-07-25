import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, BigNumberish } from 'ethers'
import { ERC721Bid__factory, ERC721__factory, EstateRegistry__factory, Marketplace__factory } from '../../contracts/land-contract/typechain'
import { isValidOrder } from '../../utils'
import { formatEther } from '@ethersproject/units'
import { DecentralandAssetCategory, DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import { EthereumChainId, toCanonicalEthereumChainId } from 'nftopia-shared/dist/shared/network'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import { getMarketplaceContractAddress } from 'nftopia-shared/dist/shared/trading/utils'
import { ERC721NFTMarket__factory } from '../../contracts/nftopia-mpsc/typechain-types'
import {
  getAsks,
  getBids,
  getToken,
  Token as TokenV2,
  Ask as AskV2,
  Bid as BidV2,
  Status,
} from '../../utils/subgraph'

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

export interface Ask {
  seller: string;
  quoteToken: string;
  price: BigNumber;
}

export const useAssetHook = (asset: GenericAssetDto) => {
  const { account, provider } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)
  const [owner, setOwner] = useState<string>(undefined)
  const [asks, setAsks] = useState<AskV2[]>(undefined)
  const [bids, setBids] = useState<BidV2[]>([])
  const [errors, setErrors] = useState<Set<ASSET_ERRORS>>(new Set())

  useEffect(() => {
    if (provider && asset !== null) {
      setIsLoading(true)
      const pOwner = getOwner();
      const pOrder = getOrder();
      // const pFingerprint = getFingerprint();
      const pBids = _getBids();
      Promise.all([
        pOwner,
        pOrder,
        // pFingerprint,
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

    try {
      const token = await getToken(asset)
      console.log(token.owner);

      setOwner(token.owner)
    } catch (error) {
      console.error(error);
      setOwner(undefined)
      errors.add(ASSET_ERRORS.OWNER)
    }

    return errors
  }, [provider, asset])

  const getOrder = useCallback(async () => {
    const errors = new Set<ASSET_ERRORS>()
    // check token's order existence in marketplace
    try {
      const _asks = await getAsks(asset)
      setAsks(_asks)
    } catch (error) {
      setAsks(undefined)
      // if order doesn't exist, consider it is expired
      errors.add(ASSET_ERRORS.ORDER)
    }

    return errors
  }, [provider, asset])

  const _getBids = useCallback(async () => {
    const errors = new Set<ASSET_ERRORS>()

    // check token's order existence in marketplace
    try {
      const _bids = await getBids(asset)
      setBids(_bids)
    } catch (error) {
      setBids(undefined)
    }

    return errors
  }, [provider, asset])

  return {
    // fingerprint,
    owner,
    asks,
    bids,
    // buyable,
    errors,
    isLoading
  } as const
}

export const getValidAsk = (asks: AskV2[]): Ask => {
  if (!asks) {
    return null
  }

  const validAsks = asks.filter((v) => v.status === Status.New)
  if (validAsks.length > 0) {
    return validAsks[0];
  } else {
    return null
  }
}

export const isValidAsk = (_ask: Ask) => {
  return _ask &&
    _ask.seller !== "0x0000000000000000000000000000000000000000" &&
    _ask.quoteToken !== "0x0000000000000000000000000000000000000000" &&
    _ask.price.gt(0)
}