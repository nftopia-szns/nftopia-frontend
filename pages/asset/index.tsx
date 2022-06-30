import { Spin } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import AssetDetail from '../../components/asset/AssetDetail/AssetDetail'
import { assetSelectorIsLoading } from '../../services/asset/asset-selectors'
import { fetchAsset } from '../../services/asset/asset-slice'
import { useAppDispatch, useAppSelector } from '../../services/hook'
import { MetaversePlatform } from '../../services/search/search.types'

type Props = {}

const AssetPage = (props: Props) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { platform, index, assetId } = router.query;
  const isLoading = useAppSelector(assetSelectorIsLoading)

  useEffect(() => {
    if (platform && index && assetId) {
      dispatch(fetchAsset({
        platform: platform as MetaversePlatform,
        index: index.toString(),
        id: assetId.toString()
      }))
    }
  }, [platform, index, assetId])

  return (
    <Spin spinning={isLoading as boolean}>
      <AssetDetail />
    </Spin>
  )
}

export default AssetPage