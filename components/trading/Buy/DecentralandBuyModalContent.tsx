import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Row, Col, Spin, Image, Typography, Alert, Button } from 'antd'
import Title from "antd/lib/typography/Title"
import { ContractData, ContractName, getContract } from 'decentraland-transactions'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDecentralandAssetHook } from '../../../services/asset/asset-hook'
import { assetSelectorIsLoading } from '../../../services/asset/asset-selectors'
import { fetchAsset } from '../../../services/asset/asset-slice'
import { buyRequest } from '../../../services/sale/sale-slice'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { isValidOrder } from '../../../utils'
import { ERC20__factory } from '../../../contracts/land-contract/typechain'
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import { EthereumChainId, toCanonicalEthereumChainId } from 'nftopia-shared/dist/shared/network'

type Props = {}

function DecentralandBidModalContent({ }: Props) {
    const router = useRouter()
    const { index, assetId } = router.query;
    const dispatch = useAppDispatch()
    const { account, provider } = useWeb3React()

    const isAssetDetailLoading = useAppSelector(assetSelectorIsLoading)
    const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandAssetDto)
    const isBuyLoading = useAppSelector((state) => state.sale.isLoading)

    const {
        fingerprint,
        owner,
        order,
        isLoading
    } = useDecentralandAssetHook(assetDetail)
    const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true)

    useEffect(() => {
        if (assetId) {
            dispatch(fetchAsset({
                platform: MetaversePlatform.Decentraland,
                index: index.toString(),
                id: assetId.toString()
            }))
        }
    }, [assetId])

    useEffect(() => {
        if (account && assetDetail && order) {
            const contractManaData: ContractData = getContract(
                ContractName.MANAToken,
                toCanonicalEthereumChainId(assetDetail.chain_id as EthereumChainId),
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
                        <Title>Buy "{assetDetail?.name}"</Title>
                    </Row>
                    <Row>
                        <Typography><b>{formatEther(order?.price.toString() ?? 0).toString()} MANA</b></Typography>
                    </Row>
                    <Row>
                        <Spin spinning={isBuyLoading}>
                            <Button
                                disabled={
                                    !account ||
                                    account === owner ||
                                    !isEnoughBalance ||
                                    !isValidOrder(order)
                                }
                                onClick={onBuy}>BUY</Button>
                        </Spin>
                    </Row>

                    {account ?
                        (!isEnoughBalance ?
                            <Row>
                                <Alert message="Your balance is not enough" type="error" />
                            </Row> : null)
                        :
                        < Row >
                            <Alert message="Please connect your wallet" type="error" />
                        </Row>
                    }
                </Col >
            </Row >
        </Spin >
    )
}

export default DecentralandBidModalContent