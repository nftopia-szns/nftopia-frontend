import { DecentralandAsset } from "../../../../../components/asset";

import React, { useEffect } from 'react'
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../../services/hook";
import { assetSelectorIsLoading } from "../../../../../services/asset/asset-selectors";
import { Spin } from "antd";
import { fetchAsset } from "../../../../../services/asset/asset-slice";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"

type Props = {}

const DecentralandAssetPage = (props: Props) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { index, assetId } = router.query;
    const isLoading = useAppSelector(assetSelectorIsLoading)

    useEffect(() => {
        if (assetId) {
            dispatch(fetchAsset({
                platform: MetaversePlatform.Decentraland,
                index: index.toString(),
                id: assetId.toString()
            }))
        }
    }, [assetId])

    return (
        <Spin spinning={isLoading as boolean}>
            <DecentralandAsset />
        </Spin>
    )
}

export default DecentralandAssetPage