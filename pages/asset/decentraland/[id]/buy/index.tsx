import { useWeb3React } from '@web3-react/core'
import { Row, Col, Spin, Image, Typography, InputNumber, DatePicker, Alert, Grid, Button } from 'antd'
import Title from "antd/lib/typography/Title"
import { BigNumber } from 'ethers'
import moment, { Moment } from 'moment'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import { MetaversePlatform } from '../../../../../components/search/SearchBar/SearchBar.types'
import { BN_ZERO } from '../../../../../constants/eth'
import { ERC721Bid, IERC20 } from '../../../../../contracts/bid-contract/typechain-types'
import { useFingerprint } from '../../../../../modules/asset/asset-hook'
import { assetSelectorIsLoading } from '../../../../../modules/asset/asset-selectors'
import { fetchAsset } from '../../../../../modules/asset/asset-slice'
import { useAppDispatch, useAppSelector } from '../../../../../modules/hook'
import { DecentralandSearchHitDto } from '../../../../api/search/search.types'

type Props = {}

function DecentralandAssetBuyPage({ }: Props) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { id } = router.query;
    const isLoading = useAppSelector(assetSelectorIsLoading)
    const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)
    const { account, provider } = useWeb3React()

    const [bidAmount, setBidAmount] = useState<number>(1000)
    const [expirationDate, setExpirationDate] = useState<Moment>(moment.utc())
    const [contractBid, setContractBid] = useState<ERC721Bid>(undefined)
    // only for estate
    const [fingerprint, isLoadingFingerprint] = useFingerprint(assetDetail)
    const [contractMana, setContractMana] = useState<IERC20>(undefined)
    const [balanceOfMana, setBalanceOfMana] = useState<BigNumber>(BN_ZERO)

    useEffect(() => {
        if (id) {
            dispatch(fetchAsset({
                metaversePlatform: MetaversePlatform.Decentraland,
                id: id.toString()
            }))
        }
    }, [id])
    return (
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
                    <Title>Place a bid</Title>
                </Row>
                <Row>
                    <Typography>Set a price and expiration date for your bid on <b>{assetDetail?.name}</b>.</Typography>
                </Row>
                <Row>
                    <InputNumber
                        size="large"
                        min={1}
                        controls={false}
                        value={bidAmount}
                        onChange={(v) => { setBidAmount(v) }} />
                </Row>
                <Row>
                    <DatePicker
                        size="large"
                        defaultValue={moment('01/01/2015', 'DD/MM/YYYY')}
                        format={'DD/MM/YYYY'}
                        value={expirationDate}
                        onChange={(v) => setExpirationDate(v)} />
                </Row>
                <Row>
                    <Button
                        disabled={
                            !account &&
                            (balanceOfMana <= BN_ZERO || balanceOfMana < BigNumber.from(bidAmount))
                        }>BUY</Button>
                </Row>
                {!account &&
                    <Row>
                        <Alert message="Please connect your wallet" type="error" />
                    </Row>
                }
                {(balanceOfMana <= BN_ZERO || balanceOfMana < BigNumber.from(bidAmount)) &&
                    <Row>
                        <Alert message="Your balance is not enough" type="error" />
                    </Row>
                }
            </Col>
        </Row>
    )
}

export default DecentralandAssetBuyPage