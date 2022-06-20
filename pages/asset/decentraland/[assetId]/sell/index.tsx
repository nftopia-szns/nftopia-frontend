import { parseEther } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import { Spin, Row, Col, Image, Typography, InputNumber, DatePicker, Button, Alert } from 'antd';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { MetaversePlatform } from '../../../../../components/search/SearchBar/SearchBar.types';
import { useAssetHook } from '../../../../../services/asset/asset-hook';
import { assetSelectorIsLoading } from '../../../../../services/asset/asset-selectors';
import { fetchAsset } from '../../../../../services/asset/asset-slice';
import { useAppDispatch, useAppSelector } from '../../../../../services/hook';
import { sellRequest, stopSellingRequest } from '../../../../../services/sale/sale-slice';
import { isValidOrder } from '../../../../../utils';
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
    isLoading
  } = useAssetHook(assetDetail)

  const [price, setPrice] = useState<number>(1000)
  const [isValidPrice, setIsValidPrice] = useState<boolean>(true)
  const [expiresAt, setExpiresAt] = useState<number>(0)
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
    // selling price must be at least 1 MANA
    setIsValidPrice(price >= 1)
  }, [price])

  const onExpirationDateChange = (expirationDate: moment.Moment) => {
    const durationMilis = expirationDate.valueOf()
    const duration = durationMilis <= 0 ? 0 : Math.floor(durationMilis / 1000)

    if (duration === 0) {
      setExpiresAt(0)
      setIsValidDuration(false)
    } else {
      setExpiresAt(duration)
      setIsValidDuration(true)
    }
  }

  const onSell = async () => {
    dispatch(sellRequest({
      caller: account,
      provider,
      asset: assetDetail,
      price: parseEther(price.toString()),
      expiresAt: expiresAt * 1000, // converts to miliseconds
    }))
  }

  const onStopSelling = async () => {
    dispatch(stopSellingRequest({
      caller: account,
      provider,
      asset: assetDetail,
    }))
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
          {isValidOrder(order) ?
            <Button onClick={onStopSelling}>Stop Selling</Button>
            : <>
              <Row>
                <Typography>Set a price and expiration date for your selling on <b>{assetDetail?.name}</b>.</Typography>
              </Row>
              <Row>
                <InputNumber
                  size="large"
                  min={1}
                  controls={false}
                  value={price}
                  onChange={(v) => { setPrice(v) }}
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
                    !isValidPrice ||
                    !isValidDuration
                  }
                  onClick={onSell}>Sell</Button>
              </Row>
              {!isValidPrice &&
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
    </Spin>
  )
}

export default DecentralandAssetSellPage