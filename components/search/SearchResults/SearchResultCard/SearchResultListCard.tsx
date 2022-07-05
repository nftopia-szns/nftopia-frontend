import { LinkOutlined } from '@ant-design/icons'
import { Card, Col, Row, Tag, Typography } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import React from 'react'
import { SearchHitDto } from '../../../../pages/api/search/search.types'
import { parameterizedRouter } from '../../../../router'
import { t } from '../../../../utils/translation'
import { getHighlights } from '../SearchResults.utils'

type Props = {
    searchHit: SearchHitDto<GenericAssetDto>
}

const SearchResultListCard = (props: Props) => {
    const { searchHit } = props
    const router = useRouter()

    const handleOnClick = () => {
        const propertyDetailUrl =
            parameterizedRouter.asset.detail(
                searchHit._source.platform,
                searchHit._index,
                searchHit._id)
        router.push(propertyDetailUrl)
    }

    return (
        <Card
            hoverable
            onClick={handleOnClick}
        >
            <Row>
                <Col
                    style={{ paddingRight: "10px" }}
                    span={4}>
                    <img src={searchHit?._source.image} style={{ width: "100%" }} />
                </Col>
                <Col
                    style={{ paddingLeft: "10px" }}>
                    <Row>
                        <Tag color="gold">{t(searchHit?._source.platform)}</Tag>
                        <Tag color="magenta">{t(searchHit?._source.chain_id)}</Tag>
                        <Tag color="cyan">{t(searchHit?._source.network)}</Tag>
                    </Row>
                    <Row>
                        <Typography>Name: {searchHit?._source.name}</Typography>
                    </Row>
                    <Row>
                        <Typography>Description: {searchHit?._source.description}</Typography>
                    </Row>
                    <Row>
                        <Typography>Highlights: </Typography>
                        {getHighlights(searchHit._source).map((hl, index) =>
                            <Typography key={index}>• {hl}</Typography>)}
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}

export default SearchResultListCard