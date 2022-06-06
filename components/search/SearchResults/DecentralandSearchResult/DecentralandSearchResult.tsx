import { Card, Tag } from "antd"
import Meta from "antd/lib/card/Meta"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import { setAssetDetail } from "../../../../modules/asset/asset-slice"
import { useAppDispatch } from "../../../../modules/hook"
import { parameterizedRouter } from "../../../../router"
import { retrieveFromExternalUrl } from "../../../../utils"
import { SearchHitDto, DecentralandSearchHitDto } from "../../search.types"
import "./DecentralandSearchResult.module.css"

interface DecentralandSearchResultProps {
    searchHit: SearchHitDto<DecentralandSearchHitDto>
}

const DecentralandSearchResult: FC<DecentralandSearchResultProps> = ({ searchHit }) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { contractAddress, tokenId } = retrieveFromExternalUrl(searchHit._source.external_url)

    const handleOnClick = () => {
        dispatch(setAssetDetail(searchHit._source))
        const propertyDetailUrl = parameterizedRouter.asset.decentraland(searchHit._id)
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
        </Card>
    )
}

export default DecentralandSearchResult