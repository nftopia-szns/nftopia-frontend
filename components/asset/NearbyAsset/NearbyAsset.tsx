import { useRouter } from 'next/router'
import React from 'react'
import { MetaversePlatform } from '../../../services/search/search.types'

type Props = {}

const NearbyAsset = (props: Props) => {
    const router = useRouter()
    const { platform, index, assetId } = router.query

    return (
        <>
            {
                MetaversePlatform.Cryptovoxels === platform as string ?
                    <>Cryptovoxels currently cannot show nearby assets</>
                    :
                    <div>NearbyAsset</div>
            }
        </>
    )
}

export default NearbyAsset