import { Spin } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import AssetDetail from '../../components/asset/AssetDetail/AssetDetail'
import { assetSelectorIsLoading } from '../../services/asset/asset-selectors'
import { fetchAsset } from '../../services/asset/asset-slice'
import { useAppDispatch, useAppSelector } from '../../services/hook'

type Props = {}

const AssetPage = (props: Props) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { index, assetId } = router.query;
  const isLoading = useAppSelector(assetSelectorIsLoading)

  useEffect(() => {
    if (assetId) {
      dispatch(fetchAsset({
        index: index.toString(),
        id: assetId.toString()
      }))
    }
  }, [assetId])

  return (
    <Spin spinning={isLoading as boolean}>
      <AssetDetail />
    </Spin>
  )
}

export default AssetPage