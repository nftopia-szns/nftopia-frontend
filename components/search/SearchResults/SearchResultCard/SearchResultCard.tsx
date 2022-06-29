import { Card, Tag, Typography } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { useRouter } from 'next/router'
import React from 'react'
import { SearchHitDto } from '../../../../pages/api/search/search.types'
import { parameterizedRouter } from '../../../../router'
import { useAppSelector } from '../../../../services/hook'
import { t } from '../../../../utils/translation'

type Props = {
    searchHit: SearchHitDto<any>
}

const SearchResultCard = (props: Props) => {
    const platform = useAppSelector((state) => state.search.platform)
    const { searchHit } = props
    const router = useRouter()

    const handleOnClick = () => {
        const propertyDetailUrl = parameterizedRouter.asset.detail(platform, searchHit._index, searchHit._id)
        router.push(propertyDetailUrl)
    }

    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img src={searchHit._source.image} />}
            onClick={handleOnClick}
        >
            <Tag color="gold">{t(platform)}</Tag>
            <Tag color="cyan">{searchHit._index}</Tag>
            {searchHit._source.category &&
                <Tag color="volcano">{searchHit._source.category}</Tag>
            }
            <Meta title={searchHit._source.name} description={searchHit._source.description} />
            {searchHit._source.active_order &&
                <Typography>{searchHit._source.active_order.price}</Typography>
            }
        </Card>
    )
}

export default SearchResultCard