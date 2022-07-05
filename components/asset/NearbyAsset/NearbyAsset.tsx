import { Col, Row, Spin, Typography } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { fetchNearbyAssets } from '../../../services/asset/asset-slice'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import NearbyAssetItem from './NearbyAssetItem'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'

type Props = {}

const NearbyAsset = (props: Props) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { isLoading, assetDetail, nearbyAssets } = useAppSelector((state) => state.asset)
    const { platform, index, assetId } = router.query
    const [isEligibleToShowNearbyAssets, setIsEligibleToShowNearbyAssets] = useState<boolean>()

    useEffect(() => {
        if (platform && assetDetail) {
            if (canShowNearby(platform, assetDetail)) {
                setIsEligibleToShowNearbyAssets(true)
                dispatch(fetchNearbyAssets())
            }
        }
    }, [assetDetail, platform])

    const canShowNearby = (platform, assetDetail) => {
        switch (platform) {
            case MetaversePlatform.Cryptovoxels:
                return false;
            case MetaversePlatform.Decentraland:
                return (assetDetail as DecentralandAssetDto).attributes.category === "parcel"
            default:
                return true
        }
    }

    return (
        <>
            <Typography>Nearby Assets</Typography>
            <Spin spinning={isLoading}>
                {
                    isEligibleToShowNearbyAssets === true ?
                        nearbyAssets && nearbyAssets?.length > 0 ?
                            <Row gutter={[24, 48]}>
                                {nearbyAssets.map((asset, index) =>
                                    <Col
                                        key={index} 
                                        span={2}>
                                        <NearbyAssetItem asset={asset} />
                                    </Col>)}
                            </Row>
                            :
                            <>This asset does not have any nearby assets</>
                        :
                        <>This asset currently cannot show nearby assets</>
                }
            </Spin>
        </>
    )
}

export default NearbyAsset