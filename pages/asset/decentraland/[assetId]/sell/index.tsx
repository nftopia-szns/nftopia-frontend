import { parseEther, formatEther } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import { Spin, Row, Col, Image, Typography, InputNumber, DatePicker, Button, Alert } from 'antd';
import Title from 'antd/lib/typography/Title';
import { ContractData, getContract, ContractName } from 'decentraland-transactions';
import { BigNumber } from 'ethers';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { MetaversePlatform } from '../../../../../components/search/SearchBar/SearchBar.types';
import { BN_ZERO } from '../../../../../constants/eth';
import { IERC20__factory } from '../../../../../contracts/bid-contract/typechain-types';
import { useAssetHook } from '../../../../../modules/asset/asset-hook';
import { assetSelectorIsLoading } from '../../../../../modules/asset/asset-selectors';
import { fetchAsset } from '../../../../../modules/asset/asset-slice';
import { bidRequest } from '../../../../../modules/bid/bid-slice';
import { useAppDispatch, useAppSelector } from '../../../../../modules/hook';
import { DecentralandSearchHitDto } from '../../../../api/search/search.types';

type Props = {}

const DecentralandAssetSellPage = (props: Props) => {
  const router = useRouter()
  const { assetId } = router.query;
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()

  const isAssetDetailLoading = useAppSelector(assetSelectorIsLoading)
  const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)

  const {
    order,
    fingerprint,
    isLoading
  } = useAssetHook(assetDetail)

  const [balanceOfMana, setBalanceOfMana] = useState<BigNumber>(BN_ZERO)
  const [bidAmount, setBidAmount] = useState<number>(1000)
  const [isValidBidAmount, setValidBidAmount] = useState<boolean>(true)
  const [duration, setDuration] = useState<number>(0)
  const [isValidDuration, setIsValidDuration] = useState<boolean>(false)

  useEffect(() => {
    if (assetId) {
      dispatch(fetchAsset({
        metaversePlatform: MetaversePlatform.Decentraland,
        id: assetId.toString()
      }))
    }
  }, [assetId])

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
    if (account && assetDetail) {
      const contractManaData: ContractData = getContract(
        ContractName.MANAToken,
        assetDetail.chain_id,
      )
      const _contractMana = IERC20__factory.connect(
        contractManaData.address,
        provider.getSigner(),
      )
      _contractMana.balanceOf(account).then((v) => {
        setBalanceOfMana(v)
      })
    }
  }, [assetDetail, account])

  const onSell = async () => {

    // dispatch(bidRequest({
    //   caller: account,
    //   provider,
    //   asset: assetDetail,
    //   price: parseEther(bidAmount.toString()),
    //   duration,
    //   fingerprint
    // }))
  }

  return (
    <Spin spinning={isAssetDetailLoading && isLoading}>
      <Row>
        <Col span={12}>
          <Image
            preview={false}
            width={200}
            src={assetDetail?.image}
            placeholder={<Spin spinning={!assetDetail} />} />
        </Col>
        <Col span={12}>
          <Row>
            <Title>Sell an item</Title>
          </Row>
          <Row>
            <Typography>Set a price and expiration date for your selling on <b>{assetDetail?.name}</b>.</Typography>
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
              onClick={onSell}>Sell</Button>
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
        </Col>
      </Row>
    </Spin>
  )
}

export default DecentralandAssetSellPage