import { formatEther, parseEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Row, Col, Spin, Image, Typography, InputNumber, DatePicker, Alert, Button } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ContractData, getContract, ContractName } from 'decentraland-transactions'
import { BigNumber } from 'ethers'
import moment from "moment"
import React, { useEffect, useState } from 'react'
import BidList from '../../asset/AssetDetail/Trading/BidList/BidList'
import { BN_ZERO } from '../../../constants/eth'
import { ERC20__factory } from '../../../contracts/land-contract/typechain'
import { useDecentralandAssetHook } from '../../../services/asset/asset-hook'
import { assetSelectorIsLoading } from '../../../services/asset/asset-selectors'
import { bidRequest } from '../../../services/bid/bid-slice'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import { toCanonicalEthereumChainId, EthereumChainId } from 'nftopia-shared/dist/shared/network'

type Props = {}

const DecentralandBidModal = (props: Props) => {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()

  const isAssetDetailLoading = useAppSelector(assetSelectorIsLoading)
  const asset = useAppSelector((state) => state.asset.assetDetail as DecentralandAssetDto)

  const {
    owner,
    bids,
    fingerprint,
    isLoading
  } = useDecentralandAssetHook(asset)

  const [balanceOfMana, setBalanceOfMana] = useState<BigNumber>(BN_ZERO)
  const [bidAmount, setBidAmount] = useState<number>(1000)
  const [isValidBidAmount, setValidBidAmount] = useState<boolean>(true)
  const [duration, setDuration] = useState<number>(0)
  const [isValidDuration, setIsValidDuration] = useState<boolean>(false)

  useEffect(() => {
    setValidBidAmount(balanceOfMana >= BigNumber.from(bidAmount).mul(BigNumber.from(10).pow(18)))
  }, [balanceOfMana, bidAmount])

  const onExpirationDateChange = (expirationDate: moment.Moment) => {
    const durationMilis = expirationDate.valueOf() - moment.utc().valueOf()
    const duration = durationMilis <= 0 ? 0 : Math.floor(durationMilis / 1000)
    if (duration === 0) {
      setDuration(0)
      setIsValidDuration(false)
    } else {
      setDuration(duration)
      setIsValidDuration(true)
    }
  }

  useEffect(() => {
    if (account && asset) {
      const contractManaData: ContractData = getContract(
        ContractName.MANAToken,
        toCanonicalEthereumChainId(asset.chain_id as EthereumChainId),
      )
      const _contractMana = ERC20__factory.connect(
        contractManaData.address,
        provider,
      )
      _contractMana.balanceOf(account).then((v) => {
        setBalanceOfMana(v)
      })
    }
  }, [asset, account])

  const onBid = async () => {

    dispatch(bidRequest({
      caller: account,
      provider,
      asset: asset,
      price: parseEther(bidAmount.toString()),
      duration,
      fingerprint
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
                <InputNumber
                  size="large"
                  min={0}
                  max={Number(formatEther(balanceOfMana))}
                  controls={false}
                  value={bidAmount}
                  onChange={(v) => { setBidAmount(v) }}
                  width={'400px'} />
              </Row>
              <Row>
                <DatePicker
                  size="large"
                  defaultValue={moment.utc()}
                  format={'DD/MM/YYYY'}
                  onChange={onExpirationDateChange} />
              </Row>
              <Row>
                <Button
                  disabled={
                    !account ||
                    !isValidBidAmount ||
                    !isValidDuration
                  }
                  onClick={onBid}>Bid</Button>
              </Row>
              {!isValidBidAmount &&
                <Row>
                  <Alert message="Your balance is not enough" type="error" />
                </Row>
              }
              {!isValidDuration &&
                <Row>
                  <Alert message="Duration is invalid" type="error" />
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

export default DecentralandBidModal