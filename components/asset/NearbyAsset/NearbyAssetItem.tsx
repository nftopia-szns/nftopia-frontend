import { Card } from 'antd'
import React, { useEffect } from 'react'
import { SearchHitDto } from '../../../pages/api/search/search.types'
import { GenericAssetDto } from 'nftopia-shared/dist/asset'

type Props = {
    asset: object
}

const NearbyAssetItem = (props: Props) => {
    const { asset } = props
    const hit = asset as SearchHitDto<GenericAssetDto>
    const { x, y } = hit._source.attributes

    return (
        <Card>
            <p>{`${x},${y}`}</p>
        </Card>
    )
}

export default NearbyAssetItem