import { PageHeader, Image, Spin, Button, Typography } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'
import { useAppSelector } from '../../../modules/hook'
import './DecentralandAsset.module.css'
import { DecentralandSearchHitDto } from '../../../pages/api/search/search.types'
import { parameterizedRouter } from '../../../router'
import router from 'next/router'
import { useAssetHook } from '../../../modules/asset/asset-hook'
import { isValidOrder } from '../../../utils'
import { useWeb3React } from '@web3-react/core'

const DecentralandAsset = () => {
  const assetDetail = useAppSelector<DecentralandSearchHitDto>((state) => state.asset.assetDetail)
  const { account } = useWeb3React()
  const { owner, order, orderExpired, isLoading } = useAssetHook(assetDetail)

  const onBidClicked = () => {
    const propertyDetailUrl = parameterizedRouter.asset.decentraland.bid(assetDetail.id)
    router.push(propertyDetailUrl)
  }

  const onBuyClicked = () => {
    const propertyDetailUrl = parameterizedRouter.asset.decentraland.buy(assetDetail.id)
    router.push(propertyDetailUrl)
  }

  return (
    <div className="decentraland-asset-c">
      <Spin spinning={!assetDetail} />
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
            {isValidOrder(order) ?
              <Button>Unlist</Button>
              :
              <Button>List</Button>
            }
          </>
          :
          <>
            {isValidOrder(order) &&
              <Button onClick={onBuyClicked}>Buy</Button>
            }
          </>
        }

        <Button onClick={onBidClicked}>Bid</Button>
      </>
    </div >
  )
}

export default DecentralandAsset