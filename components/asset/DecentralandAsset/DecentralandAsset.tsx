import { PageHeader, Image, Spin, Button } from 'antd'
import Title from 'antd/lib/typography/Title'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { fetchStart } from '../../../redux/features/asset/asset-slice'
import './DecentralandAsset.module.css'
import { NFT } from './DecentralandAsset.type'
import BidModal from '../Bid/BidModal'

type Props = {
  contractAddress: string
  tokenId: string
}

const DecentralandAsset = (props: Props) => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((state) => state.asset.isLoading)
  const assetDetail = useAppSelector((state) => state.asset.assetDetail as NFT)
  const { contractAddress, tokenId } = props

  const [showBidModal, setShowBidModal] = useState<boolean>(false)

  useEffect(() => {
    if (contractAddress && tokenId) {
      dispatch(fetchStart({ contractAddress, tokenId }))
    }
  }, [props])

  useEffect(() => {
    console.log(assetDetail);
  }, [assetDetail])


  const onBidClicked = () => {
    setShowBidModal(true)
  }

  return (
    <div className="decentraland-asset-c">
      <Spin spinning={isLoading}/>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="Title"
        subTitle="This is a subtitle"
      />
      <Image
        width={200}
        src={assetDetail?.data[0]?.nft.image}
        placeholder={
          <Spin spinning={!assetDetail}/>
        }
      />
      <>
        <Title>{assetDetail?.data[0]?.nft.name}</Title>
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