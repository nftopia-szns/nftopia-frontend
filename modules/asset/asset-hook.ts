import { useCallback, useEffect, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { useWeb3React } from '@web3-react/core'
import { EstateRegistry__factory, Marketplace__factory } from '../../contracts/land-contract/typechain'
import { DecentralandSearchHitDto } from '../../components/search/search.types'
import { DecentralandPropertyType } from '../../components/search/SearchResults/DecentralandSearchResult/DecentralandSearchResult.types'
import { IERC721__factory } from '../../contracts/bid-contract/typechain-types'
import { ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, BigNumberish } from 'ethers'
import { isExpiredFromNow } from '../../utils'

export const useFingerprint = (nft: DecentralandSearchHitDto | null) => {
  const { provider } = useWeb3React()
  const [fingerprint, setFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (provider && nft) {
      const _estateRegistry = EstateRegistry__factory.connect(
        nft.contract_address,
        provider
      )
      switch (nft.category) {
        case NFTCategory.ESTATE: {
          setIsLoading(true)
          _estateRegistry.getFingerprint(nft.token_id)
            .then((fingerprint) => {
              setFingerprint(fingerprint)
            })
            .finally(() => setIsLoading(false))
            .catch(error =>
              console.error(
                `Error getting fingerprint for nft ${nft.token_id}`,
                error
              )
            )
          break
        }
        default:
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
        estateRegistryContract.ownerOf(asset.token_id).then((v) => {
          setOwner(v)
          setIsLoading(false)
        })
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

export const useAssetOrder = (asset: DecentralandSearchHitDto | null) => {
  const { provider } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<Order>(undefined)
  const [isExpired, setIsExpired] = useState<boolean>(false)

  const getOrder = useCallback(async (provider, asset) => {
    try {
      const marketplaceContractData = getContract(
        ContractName.Marketplace,
        asset.chain_id
      )
      const marketplaceContract = Marketplace__factory.connect(marketplaceContractData.address, provider)
      
      const order = await marketplaceContract.orderByAssetId(asset.contract_address, asset.token_id)
      console.log(order.expiresAt.toNumber());
      
      if (!BigNumber.from(order.id).eq(0)) {
        setOrder({
          id: order.id,
          seller: order.seller,
          nftAddress: order.nftAddress,
          price: order.price,
          expiresAt: order.expiresAt,
        })

        setIsExpired(isExpiredFromNow(order.expiresAt.toNumber()))
      }
    } catch (error) {
      console.log(error)
    }
  }, [provider, asset])

  useEffect(() => {
    if (provider && asset) {
      setIsLoading(true)
      getOrder(provider, asset)
    } else {
      setOrder(undefined)
    }
  }, [provider, asset])

  return [order,isExpired, isLoading ] as const
}