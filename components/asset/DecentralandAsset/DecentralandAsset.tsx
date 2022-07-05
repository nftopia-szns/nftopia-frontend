import { PageHeader, Image, Spin, Button, Typography } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import './DecentralandAsset.module.css'
import { DecentralandSearchHitDto } from '../../../pages/api/search/search.types'
import { useDecentralandAssetHook } from '../../../services/asset/asset-hook'
import { isValidOrder } from '../../../utils'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { parameterizedRouter } from '../../../router'
import { fetchAsset } from '../../../services/asset/asset-slice'
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'

const DecentralandAsset = () => {
  const router = useRouter()
  const { index, assetId } = router.query
  const dispatch = useAppDispatch()
  const isAssetLoading = useAppSelector<boolean>((state) => state.asset.isLoading)
  const assetDetail = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)
  const { account } = useWeb3React()
  const { owner, order, isLoading } = useDecentralandAssetHook(assetDetail as DecentralandAssetDto)

  useEffect(() => {
    if (index && assetId) {
      dispatch(fetchAsset({
        platform: MetaversePlatform.Decentraland,
        index: index.toString(),
        id: assetId.toString()
      }))
    }
  }, [index, assetId])

  const onBidClicked = () => {
    const url = parameterizedRouter.asset.decentraland.bid(index.toString(), assetId.toString())
    router.push(url)
  }

  const onBuyClicked = () => {
    const url = parameterizedRouter.asset.decentraland.buy(index.toString(), assetId.toString())
    router.push(url)
  }

  const onSellClicked = () => {
    const url = parameterizedRouter.asset.decentraland.sell(index.toString(), assetId.toString())
    router.push(url)
  }

  return (
    <div className="decentraland-asset-c">
      <Spin spinning={isAssetLoading || isLoading} />
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="Title"
        subTitle="This is a subtitle"
      />
      <Image
        width={200}
        src={assetDetail?.image}
        placeholder={
          <Spin spinning={!assetDetail} />
        }
      />
      <>
        <Title>{assetDetail?.name}</Title>
        <Typography>{owner ? owner : ''}</Typography>

        {account === owner ?
          <>
            <Button onClick={onSellClicked}>Sell</Button>
          </>
          :
          <>
            {isValidOrder(order) &&
              <Button onClick={onBuyClicked}>Buy</Button>
            }
            <Button onClick={onBidClicked}>Bid</Button>
          </>
        }
      </>
    </div >
  )
}

export default DecentralandAsset