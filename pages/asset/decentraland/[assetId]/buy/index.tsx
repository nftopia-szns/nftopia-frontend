import { formatEther, parseEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Row, Col, Spin, Image, Typography, InputNumber, DatePicker, Alert, Button } from 'antd'
import Title from "antd/lib/typography/Title"
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { BigNumber } from 'ethers'
import moment, { Moment } from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MetaversePlatform } from '../../../../../components/search/SearchBar/SearchBar.types'
import { BN_ZERO } from '../../../../../constants/eth'
import { ERC20, ERC20__factory, ERC721Bid, IERC20 } from '../../../../../contracts/bid-contract/typechain-types'
import { useAssetBuyable, useFingerprint } from '../../../../../modules/asset/asset-hook'
import { assetSelectorIsLoading } from '../../../../../modules/asset/asset-selectors'
import { fetchAsset } from '../../../../../modules/asset/asset-slice'
import { buyRequest } from '../../../../../modules/buy/buy-slice'
import { useAppDispatch, useAppSelector } from '../../../../../modules/hook'
import { DecentralandSearchHitDto } from '../../../../api/search/search.types'

type Props = {}

function DecentralandAssetBuyPage({ }: Props) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { assetId } = router.query;
    const isLoading = useAppSelector(assetSelectorIsLoading)
    const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)
    const isBuyLoading = useAppSelector((state) => state.buy.isLoading)
    const { account, provider } = useWeb3React()

    const { order } = useAssetBuyable(assetDetail)

    const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>()
    const [expirationDate, setExpirationDate] = useState<Moment>(moment.utc())
    const [contractBid, setContractBid] = useState<ERC721Bid>(undefined)
    // only for estate
    const [fingerprint, isLoadingFingerprint] = useFingerprint(assetDetail)
    const [contractMana, setContractMana] = useState<ERC20>(undefined)


    useEffect(() => {
        if (assetId) {
            dispatch(fetchAsset({
                metaversePlatform: MetaversePlatform.Decentraland,
                id: assetId.toString()
            }))
        }
    }, [assetId])

    useEffect(() => {
        if (account && assetDetail && order) {
            const contractManaData: ContractData = getContract(
                ContractName.MANAToken,
                assetDetail.chain_id,
            )
            const contractMana = ERC20__factory.connect(
                contractManaData.address,
                provider.getSigner(),
            )
            contractMana.balanceOf(account).then((balance) => {
                setIsEnoughBalance(balance.gte(order.price))
            })
        }
    }, [account, assetDetail, order])

    const onBuy = () => {
        dispatch(buyRequest({
            caller: account,
            provider,
            asset: assetDetail,
            price: order.price,
            fingerprint,
        }))
    }

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
                    <Title>Buy "{assetDetail?.name}"</Title>
                </Row>
                <Row>
                    <Typography><b>{formatEther(order?.price.toString() ?? 0).toString()} MANA</b></Typography>
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
                    <Spin spinning={isBuyLoading}>
                        <Button
                            disabled={
                                !account &&
                                !isEnoughBalance
                            }
                            onClick={onBuy}>BUY</Button>
                    </Spin>
                </Row>

                {account ?
                    !isEnoughBalance &&
                    <Row>
                        <Alert message="Your balance is not enough" type="error" />
                    </Row>
                    :
                    < Row >
                        <Alert message="Please connect your wallet" type="error" />
                    </Row>
                }
            </Col >
        </Row >
    )
}

export default DecentralandAssetBuyPage