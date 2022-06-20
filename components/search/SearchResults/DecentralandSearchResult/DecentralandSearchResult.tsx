import { Card, Tag } from "antd"
import Meta from "antd/lib/card/Meta"
import Typography from "antd/lib/typography/Typography"
import { useRouter } from "next/router"
import { FC } from "react"
import { setAssetDetail } from "../../../../services/asset/asset-slice"
import { useAppDispatch } from "../../../../services/hook"
import { SearchHitDto, DecentralandSearchHitDto } from "../../../../pages/api/search/search.types"
import { parameterizedRouter } from "../../../../router"
import "./DecentralandSearchResult.module.css"

interface DecentralandSearchResultProps {
    searchHit: SearchHitDto<DecentralandSearchHitDto>
}

const DecentralandSearchResult: FC<DecentralandSearchResultProps> = ({ searchHit }) => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleOnClick = () => {
        dispatch(setAssetDetail(searchHit._source))
        const propertyDetailUrl = parameterizedRouter.asset.decentraland.detail(searchHit._id)
        router.push(propertyDetailUrl)
    }

    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img src={searchHit._source.image} />}
            onClick={handleOnClick}
        >
            <Tag color="cyan">{searchHit._index}</Tag>
            <Tag color="volcano">{searchHit._source.category}</Tag>
            <Meta title={searchHit._source.name} description={searchHit._source.description} />
            {searchHit._source.active_order &&
                <Typography>{searchHit._source.active_order.price}</Typography>
            }
        </Card>
    )
}

export default DecentralandSearchResult