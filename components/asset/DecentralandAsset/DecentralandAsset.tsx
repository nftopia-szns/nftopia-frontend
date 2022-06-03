import { PageHeader, Image, Spin, Button } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/hook'
import './DecentralandAsset.module.css'
import BidModal from '../Bid/BidModal'
import { DecentralandSearchHitDto } from '../../search/search.types'

type Props = {
  contractAddress: string
  tokenId: string
}

const DecentralandAsset = (props: Props) => {
  const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)
  const { contractAddress, tokenId } = props

  const [showBidModal, setShowBidModal] = useState<boolean>(false)

  useEffect(() => {
    console.log(assetDetail);
  }, [assetDetail])


  const onBidClicked = () => {
    setShowBidModal(true)
  }

  return (
    <div className="decentraland-asset-c">
      <Spin spinning={!assetDetail}/>
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
          <Spin spinning={!assetDetail}/>
        }
      />
      <>
        <Title>{assetDetail?.name}</Title>
        <Button onClick={onBidClicked}>Bid</Button>
      </>
      <>
        <BidModal 
          visible={showBidModal} 
          setVisible={setShowBidModal}></BidModal>
      </>
    </div >
  )
}

export default DecentralandAsset