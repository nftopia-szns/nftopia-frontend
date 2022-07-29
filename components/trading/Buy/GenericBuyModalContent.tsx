import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Row, Col, Spin, Image, Typography, Alert, Button } from 'antd'
import Title from "antd/lib/typography/Title"
import React, { useEffect, useState } from 'react'
import { useAssetHook } from '../../../services/asset/asset-hook'
import { assetSelectorIsLoading } from '../../../services/asset/asset-selectors'
import { buyRequest } from '../../../services/sale/sale-slice'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import { IERC20__factory } from '../../../contracts/nftopia-mpsc/typechain-types'
import { BN_ZERO } from '../../../constants/eth'
import { BigNumber } from 'ethers'

type Props = {
}

const GenericBuyModalContent = (props: Props) => {
    const dispatch = useAppDispatch()
    const { account, provider } = useWeb3React()
    const isAssetDetailLoading = useAppSelector(assetSelectorIsLoading)
    const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)
    const isBuyLoading = useAppSelector((state) => state.sale.isLoading)
    const {
        owner,
        ask,
        isLoading
    } = useAssetHook(asset)

    const [balance, setBalance] = useState<BigNumber>(BN_ZERO)
    const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true)

    useEffect(() => {
        if (account && asset && ask) {
            const _quoteTokenAddr = ask.quoteToken
            const _quoteToken = IERC20__factory.connect(
                _quoteTokenAddr,
                provider,
            )

            _quoteToken.balanceOf(account).then((v) => {
                setBalance(v)
            })
        }
    }, [account, asset, ask])

    useEffect(() => {
        if (ask) {
            setIsEnoughBalance(balance >= ask.price)
        } else {
            setIsEnoughBalance(false)
        }
    }, [balance, ask])

    const onBuy = () => {
        dispatch(buyRequest({
            ask: ask
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
                        <Title>Buy "{asset?.name}"</Title>
                    </Row>
                    <Row>
                        <Typography><b>{formatEther(ask?.price.toString() ?? 0).toString()}</b></Typography>
                    </Row>
                    <Row>
                        <Spin spinning={isBuyLoading}>
                            <Button
                                disabled={
                                    !account ||
                                    account === owner ||
                                    !isEnoughBalance
                                }
                                onClick={onBuy}>BUY</Button>
                        </Spin>
                    </Row>

                    {!isEnoughBalance &&
                        <Row>
                            <Alert message="Your balance is not enough" type="error" />
                        </Row>
                    }
                </Col >
            </Row >
        </Spin >
    )
}

export default GenericBuyModalContent