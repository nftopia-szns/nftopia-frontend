import { DecentralandAsset } from "../../../../components/asset";

import React, { useEffect } from 'react'
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../modules/hook";
import { assetSelectorIsLoading } from "../../../../modules/asset/asset-selectors";
import { Spin } from "antd";
import { fetchAsset } from "../../../../modules/asset/asset-slice";
import { MetaversePlatform } from "../../../../components/search/SearchBar/SearchBar.types";

type Props = {}

const DecentralandAssetPage = (props: Props) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { id } = router.query;
    const isLoading = useAppSelector(assetSelectorIsLoading)

    useEffect(() => {
        if (id) {
            dispatch(fetchAsset({
                metaversePlatform: MetaversePlatform.Decentraland,
                id: id.toString()
            }))
        }
    }, [id])

    return (
        <Spin spinning={isLoading as boolean}>
            <DecentralandAsset />
        </Spin>
    )
}

export default DecentralandAssetPage