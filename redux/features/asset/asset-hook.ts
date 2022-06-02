import { useEffect, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../../../components/asset/DecentralandAsset/DecentralandAsset.type'
import { useWeb3React } from '@web3-react/core'
import { EstateRegistry__factory } from '../../../contracts/land-contract/typechain'

export const useFingerprint = (nft: NFT | null) => {
  const { provider } = useWeb3React()
  const [fingerprint, setFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (provider && nft) {
      const _estateRegistry = EstateRegistry__factory.connect(
        nft.contractAddress,
        provider
      )
      switch (nft.category) {
        case NFTCategory.ESTATE: {
          setIsLoading(true)
          _estateRegistry.getFingerprint(nft.tokenId)
            .then((fingerprint) => {
              setFingerprint(fingerprint)
            })
            .finally(() => setIsLoading(false))
            .catch(error =>
              console.error(
                `Error getting fingerprint for nft ${nft.tokenId}`,
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
