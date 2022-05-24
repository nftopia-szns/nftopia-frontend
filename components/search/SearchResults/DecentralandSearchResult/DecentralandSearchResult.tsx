import { Card, Tag } from "antd"
import Meta from "antd/lib/card/Meta"
import { FC } from "react"
import { SearchHitDto, DecentralandSearchHitDto } from "../../search.types"
import "./DecentralandSearchResult.module.css"

interface DecentralandSearchResultProps {
    searchHit: SearchHitDto<DecentralandSearchHitDto>
}

const DecentralandSearchResult: FC<DecentralandSearchResultProps> = ({ searchHit }) => {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img src={searchHit._source.image} />}
        >
            <Tag color="volcano">{searchHit._index}</Tag>
            <Meta title={searchHit._source.name} description={searchHit._source.description} />
        </Card>
    )
}

export default DecentralandSearchResult