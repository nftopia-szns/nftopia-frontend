import { useWeb3React } from '@web3-react/core';
import { Spin, Row, Col, Image, Typography, InputNumber, Button, Alert } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react'
import { useAssetHook } from '../../../services/asset/asset-hook';
import { assetSelectorIsLoading } from '../../../services/asset/asset-selectors';
import { useAppDispatch, useAppSelector } from '../../../services/hook';
import { sellRequest, cancelSellingRequest } from '../../../services/sale/sale-slice';
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types';
import { ContractInfo, ContractType } from 'nftopia-shared/dist/shared/contract';
import { BigNumber } from 'ethers';
import { Network, PolygonChainId } from 'nftopia-shared/dist/shared';

type Props = {}

const GenericSellModalContent = (props: Props) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  const isAssetDetailLoading = useAppSelector(assetSelectorIsLoading)
  const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)

  const {
    ask,
    isLoading
  } = useAssetHook(asset)

  const [price, setPrice] = useState<number>(1000)
  const [isValidPrice, setIsValidPrice] = useState<boolean>(true)
  const [currency, setCurrency] = useState(undefined)
  const [quoteToken, setQuoteToken] = useState<string>(undefined)

  useEffect(() => {
    // TODO: allow users to choose token
    setCurrency(ContractType.TestERC20)
    setQuoteToken(ContractInfo[ContractType.TestERC20][Network.Polygon][PolygonChainId.Mumbai])
  }, [])

  useEffect(() => {
    // selling price must be at least 1 MANA
    setIsValidPrice(price >= 1)
  }, [price])

  const onSell = async () => {
    dispatch(sellRequest({
      quoteToken,
      price: BigNumber.from(price).mul(BigNumber.from(10).pow(18)),
      // TODO: set fingerprint if this asset has fingerprint registry
    }))
  }

  const onStopSelling = async () => {
    dispatch(cancelSellingRequest({
      ask,
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
          <Row>
            <Title>Sell an item</Title>
          </Row>
          {ask && ask.seller === account ?
            <Button onClick={onStopSelling}>Stop Selling</Button>
            :
            <>
              <Row>
                <Typography>Set a price your selling on <b>{asset?.name}</b>.</Typography>
              </Row>
              <Row>
                <Typography>!!TODO: Token selection!!</Typography>
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

                <Button
                  disabled={
                    !account ||
                    !isValidPrice
                  }
                  onClick={onSell}>Sell</Button>
              </Row>
              {!isValidPrice &&
                <Row>
                  <Alert message="Your balance is not enough" type="error" />
                </Row>
              }
            </>
          }
        </Col>
      </Row>
    </Spin>
  )
}

export default GenericSellModalContent