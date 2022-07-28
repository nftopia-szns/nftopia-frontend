import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Row, Col, Spin, Image, Typography, InputNumber, Alert, Button } from 'antd'
import Title from 'antd/lib/typography/Title'
import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import BidList from '../../asset/AssetDetail/Trading/BidList/BidList'
import { BN_ZERO } from '../../../constants/eth'
import { useAssetHook } from '../../../services/asset/asset-hook'
import { assetSelectorIsLoading } from '../../../services/asset/asset-selectors'
import { createBid } from '../../../services/bid/bid-slice'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { ContractInfo, ContractType } from 'nftopia-shared/dist/shared/contract'
import { IERC20__factory } from '../../../contracts/nftopia-mpsc/typechain-types'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'

type Props = {}

const GenericBidModalContent = (props: Props) => {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()

  const isAssetDetailLoading = useAppSelector(assetSelectorIsLoading)
  const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)

  const {
    owner,
    bids,
    isLoading
  } = useAssetHook(asset)

  const [balance, setBalance] = useState<BigNumber>(BN_ZERO)
  const [bidPrice, setBidPrice] = useState<number>(1000)
  const [isValidBidAmount, setValidBidAmount] = useState<boolean>(true)
  const [currency, setCurrency] = useState(undefined)
  const [quoteToken, setQuoteToken] = useState<string>(undefined)

  useEffect(() => {
    setCurrency(ContractType.TestERC20)
  }, [])

  useEffect(() => {
    if (account && asset && provider && currency) {
      const _quoteTokenAddr = ContractInfo[currency][asset.network][asset.chain_id]
      setQuoteToken(_quoteTokenAddr)
      const _quoteToken = IERC20__factory.connect(
        _quoteTokenAddr,
        provider,
      )

      _quoteToken.balanceOf(account).then((v) => {
        setBalance(v)
      })
    }
  }, [asset, account, provider, currency])

  useEffect(() => {
    setValidBidAmount(balance >= BigNumber.from(bidPrice).mul(BigNumber.from(10).pow(18)))
  }, [balance, bidPrice])

  const onCreateBid = async () => {
    dispatch(createBid({
      quoteToken,
      price: BigNumber.from(bidPrice).mul(BigNumber.from(10).pow(18)),
      // TODO: set fingerprint if this asset has fingerprint registry
    }))
  }

  return (
    <Spin spinning={isAssetDetailLoading && isLoading}>
      <Row>
        <Col span={12}>
          <Image
            preview={false}
            width={200}
            src={asset?.image}
            placeholder={<Spin spinning={!asset} />} />
        </Col>
        <Col span={12}>
          {
            account !== owner &&
            <>
              <Row>
                <Title>Place a bid</Title>
              </Row>
              <Row>
                <Typography>Set a price and expiration date for your bid on <b>{asset?.name}</b>.</Typography>
              </Row>
              <Row>
                <Typography>!!TODO: Token selection!!</Typography>
              </Row>
              <Row>
                <InputNumber
                  size="large"
                  min={0}
                  max={Number(formatEther(balance))}
                  controls={false}
                  value={bidPrice}
                  onChange={(v) => { setBidPrice(v) }}
                  width={'400px'} />
              </Row>
              <Row>
                <Button
                  disabled={
                    !account ||
                    !isValidBidAmount
                  }
                  onClick={onCreateBid}>Bid</Button>
              </Row>
              {!isValidBidAmount &&
                <Row>
                  <Alert message="Your balance is not enough" type="error" />
                </Row>
              }
            </>
          }
        </Col>
      </Row>
      <Row>
        <BidList bids={bids} />
      </Row>
    </Spin >
  )
}

export default GenericBidModalContent