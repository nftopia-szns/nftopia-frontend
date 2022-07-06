import React, {  } from 'react'
import { useAppSelector } from '../../../services/hook'
import { Image, Spin, Typography, Row, Col } from 'antd'
import Title from 'antd/lib/typography/Title'
import NearbyAsset from '../NearbyAsset/NearbyAsset'
import { getHighlights } from '../../search/SearchResults/SearchResults.utils'
import TradingAssetDetail from './Trading/TradingAssetDetail'

type Props = {}

const AssetDetail = (props: Props) => {
    const isAssetLoading = useAppSelector<boolean>((state) => state.asset.isLoading)
    const assetDetail = useAppSelector((state) => state.asset.assetDetail)

    return (
        <Spin spinning={isAssetLoading}>
            {assetDetail ?
                <Row style={{ width: "80%", alignContent: "center" }}>
                    <Row
                        style={{ margin: "30px 10px 0px 10px", width: "80%" }}>
                        <Col
                            style={{ marginRight: "10px" }}
                            span={8}>
                            <Row>
                                <Image
                                    width={500}
                                    src={assetDetail.image}
                                    placeholder={
                                        <Spin spinning={!assetDetail} />
                                    }
                                />
                            </Row>
                            <Row>
                                <Typography>Network: {assetDetail.chain_id} {assetDetail.network}</Typography>
                            </Row>
                            <Row>
                                <Typography>Description: {assetDetail.description}</Typography>
                            </Row>
                            <Row>
                                <Typography>Highlights: {getHighlights(assetDetail)}</Typography>
                            </Row>
                        </Col>
                        <Col
                            style={{ marginLeft: "10px" }}
                            span={12}>
                            <Row>
                                <Title>Name: {assetDetail.name}</Title>
                            </Row>
                            <TradingAssetDetail asset={assetDetail}/>
                        </Col>
                    </Row>
                    <Row style={{ width: "80%", margin: "30px 10px 0px 10px", borderWidth: "2px", borderColor: "black", borderRadius: "10px" }}>
                        <NearbyAsset />
                    </Row>
                </Row>
                :
                <p>invalid asset</p>
            }
        </Spin>
    )
}

export default AssetDetail