import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Button, Row, Typography, Collapse } from 'antd'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import { EthereumChainId, toCanonicalEthereumChainId } from 'nftopia-shared/dist/shared/network'
import React, { useEffect, useState } from 'react'
const { Panel } = Collapse;
import { useDecentralandAssetHook } from '../../../../services/asset/asset-hook'
import {
    setAssetForBid,
    setBidModalRequired,
} from '../../../../services/bid/bid-slice'
import {
    useAppDispatch,
    useAppSelector
} from '../../../../services/hook'
import {
    setAssetForSale,
    setBuyModalRequired,
    setSellModalRequired,
} from '../../../../services/sale/sale-slice'
import {
    walletSelectorEthIsChainIdMatched,
    walletSelectorEthIsWalletConnected
} from '../../../../services/wallet/wallet-selectors'
import { setEthRequiredChainId } from '../../../../services/wallet/wallet-slice'
import { isValidOrder } from '../../../../utils'
import BidModal from '../../../trading/Bid/BidModal'
import BuyModal from '../../../trading/Buy/BuyModal'
import SellModal from '../../../trading/Sell/SellModal'
import BidList from '../../BidList/BidList'

type Props = {
    asset: DecentralandAssetDto,
}

const DecentralandTradingAssetDetail = (props: Props) => {
    const { asset } = props
    const dispatch = useAppDispatch()
    const isWalletConnected = useAppSelector(walletSelectorEthIsWalletConnected)
    const isChainIdMatched = useAppSelector(walletSelectorEthIsChainIdMatched)
    const bidModalRequired = useAppSelector((state) => state.bid.bidModalRequired)
    const {
        sellModalRequired,
        buyModalRequired
    } = useAppSelector((state) => state.sale)
    const { account, connector } = useWeb3React()
    const { owner, bids, order } = useDecentralandAssetHook(asset)

    useEffect(() => {
        connector.connectEagerly()
        dispatch(
            setEthRequiredChainId(
                toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)
            )
        )
    }, [])

    // const isWalletReady = (): boolean => {
    //     if (account === undefined) {
    //         dispatch(setEthRequiredWalletConnect(true))
    //         return false
    //     }

    //     const assetChainId = toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)
    //     if (chainId !== assetChainId) {
    //         dispatch(setEthRequiredChainId(assetChainId))
    //         return false
    //     }

    //     return true
    // }

    const onBidClicked = () => {
        dispatch(setAssetForBid(asset))
        dispatch(setBidModalRequired(true))
    }

    const onBuyClicked = () => {
        dispatch(setAssetForSale(asset))
        dispatch(setBuyModalRequired(true))
    }

    const onSellClicked = () => {
        dispatch(setAssetForSale(asset))
        dispatch(setSellModalRequired(true))
    }

    return (
        <>
            <Row>
                {isValidOrder(order) &&
                    <>
                        <Typography>Current price: </Typography>
                        <Typography>{formatEther(order.price)}</Typography>
                    </>
                }
            </Row>
            <Row></Row>
            <Row>
                {account !== owner ?
                    <>
                        <Button onClick={onSellClicked}>Sell</Button>
                        <SellModal
                            visible={
                                sellModalRequired &&
                                isWalletConnected &&
                                isChainIdMatched
                            }
                            onCancel={() => dispatch(setSellModalRequired(false))} />
                    </>
                    :
                    <>
                        {isValidOrder(order) && account !== owner &&
                            <>
                                <Button onClick={onBuyClicked}>Buy</Button>
                                <BuyModal
                                    visible={
                                        buyModalRequired &&
                                        isWalletConnected &&
                                        isChainIdMatched
                                    }
                                    onCancel={() => dispatch(setBuyModalRequired(false))} />
                            </>
                        }
                        {account !== owner &&
                            <>
                                <Button onClick={onBidClicked}>Bid</Button>
                                <BidModal
                                    visible={
                                        bidModalRequired &&
                                        isWalletConnected &&
                                        isChainIdMatched
                                    }
                                    onCancel={() => dispatch(setBidModalRequired(false))} />
                            </>
                        }
                    </>
                }
            </Row>
            <Row>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="Listing history" key="1" style={{ width: "100%" }}>
                    </Panel>
                    <Panel header="Bid history" key="2" style={{ width: "100%" }}>
                        <BidList bids={bids} />
                    </Panel>
                </Collapse>
            </Row>

        </>
    )
}

export default DecentralandTradingAssetDetail