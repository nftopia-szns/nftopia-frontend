import { PageHeader, Image, Spin, Button } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { useState } from 'react'
import { useAppSelector } from '../../../modules/hook'
import './DecentralandAsset.module.css'
import BidModal from '../Bid/BidModal'
import { DecentralandSearchHitDto } from '../../search/search.types'
import { useWeb3React } from '@web3-react/core'
import { useAssetOrder, useAssetOwner } from '../../../modules/asset/asset-hook'
import BuyModal from '../Buy/BuyModal'

const DecentralandAsset = () => {
  const { account, provider } = useWeb3React()
  const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)
  const [owner, isOwnerLoading] = useAssetOwner(assetDetail)
  const [order, isExpired, isOrderLoading] = useAssetOrder(assetDetail)
  
  const [showBidModal, setShowBidModal] = useState<boolean>(false)
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false)

  const onBidClicked = () => {
    setShowBidModal(true)
  }

  const onBuyClicked = () => {
    setShowBuyModal(true)
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
        {owner && account && (owner !== account) && (order && !isExpired) &&
          <Button onClick={onBuyClicked}>Buy</Button>
        }
        <Button onClick={onBidClicked}>Bid</Button>
      </>
      <>
        <BidModal
          visible={showBidModal}
          setVisible={setShowBidModal}></BidModal>
        <BuyModal
          visible={showBuyModal}
          setVisible={setShowBuyModal}></BuyModal>
      </>
    </div >
  )
}

export default DecentralandAsset