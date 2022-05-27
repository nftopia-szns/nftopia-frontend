import { Card, Tag } from "antd"
import Meta from "antd/lib/card/Meta"
import { useRouter } from "next/router"
import { FC } from "react"
import { SearchHitDto, DecentralandSearchHitDto } from "../../search.types"
import "./DecentralandSearchResult.module.css"

interface DecentralandSearchResultProps {
    searchHit: SearchHitDto<DecentralandSearchHitDto>
}

const DecentralandSearchResult: FC<DecentralandSearchResultProps> = ({ searchHit }) => {
    const router = useRouter()

    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img src={searchHit._source.image} />}
            onClick={() => {
                const propertyDetailUrl = `/property-detail/decentraland/${searchHit._index}/${searchHit._id}`
                router.push(propertyDetailUrl)
            }}
        >
            <Tag color="volcano">{searchHit._index}</Tag>
            <Meta title={searchHit._source.name} description={searchHit._source.description} />
        </Card>
    )
}

export default DecentralandSearchResult