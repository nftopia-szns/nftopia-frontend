import { useCallback, useEffect, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { useWeb3React } from '@web3-react/core'
import { DecentralandPropertyType } from '../../components/search/SearchResults/DecentralandSearchResult/DecentralandSearchResult.types'
import { IERC721__factory } from '../../contracts/bid-contract/typechain-types'
import { ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, BigNumberish } from 'ethers'
import { isExpiredFromNow } from '../../utils'
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types'
import { EstateRegistry__factory } from '../../contracts/land-contract/typechain-new'
import { Marketplace__factory } from '../../contracts/land-contract/typechain'

export const useFingerprint = (nft: DecentralandSearchHitDto | null) => {
  const { provider } = useWeb3React()
  const [fingerprint, setFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (provider && nft) {
      switch (nft.category) {
        case NFTCategory.ESTATE: {
          const _estateRegistry = EstateRegistry__factory.connect(
            nft.contract_address,
            provider
          )
          setIsLoading(true)
          _estateRegistry.totalSupply().then((v) => {
            console.log('totalSupply', nft.contract_address, v.toNumber())
          })

          _estateRegistry.getFingerprint(nft.token_id)
            .then((fingerprint) => {
              setFingerprint(fingerprint)
            })
            .catch(error =>
              console.error(
                `Error getting fingerprint for nft ${nft.token_id}`,
                error
              )
            )
            .finally(() => setIsLoading(false))
          break
        }
        default:
          const _estateRegistry = EstateRegistry__factory.connect(
            nft.contract_address,
            provider
          )
          _estateRegistry.totalSupply().then((v) => {
            console.log('totalSupply', nft.contract_address, v.toNumber())
          })
          break
      }
    }
  }, [provider, nft, setFingerprint, setIsLoading])

  return [fingerprint, isLoading] as const
}

export const useAssetOwner = (asset: DecentralandSearchHitDto | null) => {
  const { account, provider } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)
  const [owner, setOwner] = useState<string>(undefined)

  useEffect(() => {
    if (account && asset) {
      setIsLoading(true)
      if (asset.category === DecentralandPropertyType.ESTATE) {
        const estateRegistryContract = EstateRegistry__factory.connect(asset.contract_address, provider)
        estateRegistryContract.ownerOf(asset.token_id)
          .then((v) => {
            setOwner(v)
          })
          .catch((err) => {
            console.error('Failed to get estate owner', err)
          })
          .finally(() => setIsLoading(false))
      } else {
        const landRegistryContract = IERC721__factory.connect(asset.contract_address, provider)
        landRegistryContract.ownerOf(asset.token_id).then((v) => {
          setOwner(v)
          setIsLoading(false)
        })
      }
    } else {
      setOwner(undefined)
    }
  }, [account, asset])

  return [owner, isLoading] as const
}

export interface Order {
  id: string
  seller: string
  nftAddress: string
  price: BigNumberish
  expiresAt: BigNumberish
}

export const useAssetBuyable = (asset: DecentralandSearchHitDto | null) => {
  const { provider } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)

  const [owner, setOwner] = useState<string>(undefined)

  const [buyable, setBuyable] = useState(false)
  const [unbuyableReason, setUnbuyableReason] = useState<string>(undefined)

  const [order, setOrder] = useState<Order>(undefined)
  const [isOrderExpired, setIsOrderExpired] = useState<boolean>(false)

  const getOnChainAsset = async () => {
    // check token existence in asset registry
    const assetRegistry = EstateRegistry__factory.connect(asset.contract_address, provider)
    try {
      try {
        const _owner = await assetRegistry.ownerOf(asset.token_id)
        setOwner(_owner)
      } catch (error) {
        setOwner(undefined)
        throw new Error("Cannot get asset owner!")
      }

      // check token exsistence in marketplace
      const marketplaceContractData = getContract(
        ContractName.Marketplace,
        asset.chain_id
      )
      const marketplaceContract = Marketplace__factory.connect(marketplaceContractData.address, provider)

      // check token's order existence in marketplace
      let _order: Order = null;
      try {
        _order = await marketplaceContract.orderByAssetId(asset.contract_address, asset.token_id)
      } catch (error) {
        setOrder(undefined)
        setIsOrderExpired(false)
        throw new Error("Cannot get asset order!")
      }

      if (_order) {
        if (BigNumber.from(_order.id).eq(0)) {
          setOrder(undefined)
          throw new Error("Asset does not have any open order!")
        } else {
          setOrder({
            id: _order.id,
            seller: _order.seller,
            nftAddress: _order.nftAddress,
            price: _order.price,
            expiresAt: _order.expiresAt,
          })
          // if order's expired
          if (isExpiredFromNow(_order.expiresAt.valueOf() as number)) {
            setIsOrderExpired(true)
            throw new Error("Asset's order is expired")
          }
        }
      }

      setBuyable(true)
      setUnbuyableReason(undefined)
    } catch (e) {
      setBuyable(false)
      setUnbuyableReason(e.toString())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (provider && asset) {
      setIsLoading(true)
      getOnChainAsset()
    } else {
      setOwner(undefined)
      setBuyable(false)
      setOrder(undefined)
    }
  }, [provider, asset])

  return { buyable, unbuyableReason, owner, order, isOrderExpired, isLoading } as const
}