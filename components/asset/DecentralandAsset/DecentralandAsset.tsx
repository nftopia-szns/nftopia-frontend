import { PageHeader, Image, Spin, Button, Typography } from 'antd'
import Title from 'antd/lib/typography/Title'
import React from 'react'
import { useAppSelector } from '../../../services/hook'
import './DecentralandAsset.module.css'
import { DecentralandSearchHitDto } from '../../../pages/api/search/search.types'
import { useAssetHook } from '../../../services/asset/asset-hook'
import { isValidOrder } from '../../../utils'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'

const DecentralandAsset = () => {
  const router = useRouter()
  const isAssetLoading = useAppSelector<boolean>((state) => state.asset.isLoading)
  const assetDetail = useAppSelector<DecentralandSearchHitDto>((state) => state.asset.assetDetail as DecentralandSearchHitDto)
  const { account } = useWeb3React()
  const { owner, order, isLoading } = useAssetHook(assetDetail)

  const onBidClicked = () => {
    router.push(router.locale + '/bid')
  }

  const onBuyClicked = () => {
    router.push(router.locale + '/buy')
  }

  const onSellClicked = () => {
    router.push(router.locale + '/sell')
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