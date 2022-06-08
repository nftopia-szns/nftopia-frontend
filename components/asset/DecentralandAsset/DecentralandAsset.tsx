import { PageHeader, Image, Spin, Button, Typography } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { useState } from 'react'
import { useAppSelector } from '../../../modules/hook'
import './DecentralandAsset.module.css'
import BidModal from '../Bid/BidModal'
import { useWeb3React } from '@web3-react/core'
import { useAssetBuyable } from '../../../modules/asset/asset-hook'
import BuyModal from '../Buy/BuyModal'
import { DecentralandSearchHitDto } from '../../../pages/api/search/search.types'
import { parameterizedRouter } from '../../../router'
import router from 'next/router'

const DecentralandAsset = () => {
  const { account, provider } = useWeb3React()
  const assetDetail = useAppSelector<DecentralandSearchHitDto>((state) => state.asset.assetDetail)
  // const [order, isExpired, isOrderLoading] = useAssetOrder(assetDetail)
  const { buyable, unbuyableReason, owner, order, isOrderExpired, isLoading } = useAssetBuyable(assetDetail)
  // const buyable = useAssetBuyable()
  const [showBidModal, setShowBidModal] = useState<boolean>(false)
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false)

  const onBidClicked = () => {
    setShowBidModal(true)
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
      </>
      <>
        <Title>{assetDetail?.name}</Title>
        <Typography>{buyable ? 'buyable' : 'unbuyable'}</Typography>
        <Typography>{unbuyableReason ? unbuyableReason : ''}</Typography>
        <Typography>{owner ? owner : ''}</Typography>
        {!isLoading && buyable &&
          <Button onClick={onBuyClicked}>Buy</Button>
        }
        <Button onClick={onBidClicked}>Bid</Button>
      </>
      <>
        <BidModal
          visible={showBidModal}
          setVisible={setShowBidModal}></BidModal>
        {/* {!isLoading && buyable &&
          <BuyModal
            visible={showBuyModal}
            setVisible={setShowBuyModal}></BuyModal>
        } */}
      </>
    </div >
  )
}

export default DecentralandAsset