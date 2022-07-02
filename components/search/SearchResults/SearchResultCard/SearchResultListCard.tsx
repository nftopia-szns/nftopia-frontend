import { Col, Row, Tag, Typography } from 'antd'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import React from 'react'
import { SearchHitDto } from '../../../../pages/api/search/search.types'
import { t } from '../../../../utils/translation'

type Props = {
    searchHit: SearchHitDto<GenericAssetDto>
}

const SearchResultListCard = (props: Props) => {
    const { searchHit } = props

    return (
        <Row style={{ margin: "20 10px", padding: "20 10px" }}>
            <Col span={4}>
                <img src={searchHit?._source.image} style={{ width: "100%" }} />
            </Col>
            <Col span={10}>
                <Row>
                    <Tag color="gold">{t(searchHit?._source.platform)}</Tag>
                    <Tag color="cyan">{searchHit?._index}</Tag>
                </Row>
                <Row>
                    <Typography>{searchHit?._source.name}</Typography>
                </Row>
                <Row>
                    <Typography>{searchHit?._source.description}</Typography>
                </Row>
                <Row></Row>
            </Col>
        </Row>
    )
}

export default SearchResultListCard