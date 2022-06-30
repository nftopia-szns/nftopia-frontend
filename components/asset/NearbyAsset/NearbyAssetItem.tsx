import { Card } from 'antd'
import React, { useEffect } from 'react'
import { DecentralandSearchHitDto, SearchHitDto } from '../../../pages/api/search/search.types'

type Props = {
    asset: object
}

const NearbyAssetItem = (props: Props) => {
    const { asset } = props
    const hit = asset as SearchHitDto<DecentralandSearchHitDto>
    const { x, y } = hit._source.attributes

    return (
        <Card>
            <p>{`${x},${y}`}</p>
        </Card>
    )
}

export default NearbyAssetItem