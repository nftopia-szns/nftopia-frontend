import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Button, Row, Typography, Collapse } from 'antd'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import { EthereumChainId, toCanonicalEthereumChainId } from 'nftopia-shared/dist/shared/network'
import React, { useEffect, useState } from 'react'
const { Panel } = Collapse;
import { useDecentralandAssetHook } from '../../../../services/asset/asset-hook'
import { useAppDispatch } from '../../../../services/hook'
import { setEthRequireChainId, setEthRequiredWalletConnect } from '../../../../services/wallet/wallet-slice'
import { isValidOrder } from '../../../../utils'
import BidModal from '../../../trading/Bid/BidModal'
import BuyModal from '../../../trading/Buy/BuyModal'
import SellModal from '../../../trading/Sell/SellModal'
import BidList from '../../BidList/BidList'

type Props = {
    asset: DecentralandAssetDto,
}

const DecentralandTradingAssetDetail = (props: Props) => {
    const dispatch = useAppDispatch()
    const { account, connector, chainId } = useWeb3React()
    const { asset } = props
    const { owner, bids, order } = useDecentralandAssetHook(asset)

    const [showBid, setShowBid] = useState(false)
    const [showBuy, setShowBuy] = useState(false)
    const [showSell, setShowSell] = useState(false)

    useEffect(() => {
        connector.connectEagerly()
    }, [])

    const isWalletReady = (): boolean => {
        if (account === undefined) {
            dispatch(setEthRequiredWalletConnect(true))
            return false
        }

        const assetChainId = toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)
        if (chainId !== assetChainId) {
            dispatch(setEthRequireChainId(assetChainId))
            return false
        }

        return true
    }

    const onBidClicked = () => {
        if (isWalletReady()) {
            setShowBid(true)
        }
    }

    const onBuyClicked = () => {
        if (isWalletReady()) {
            setShowBuy(true)
        }
    }

    const onSellClicked = () => {
        if (isWalletReady()) {
            setShowSell(true)
        }
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
                {account === owner ?
                    <>
                        <Button onClick={onSellClicked}>Sell</Button>
                        <SellModal
                            visible={showSell}
                            onCancel={() => setShowSell(false)} />
                    </>
                    :
                    <>
                        {isValidOrder(order) && account !== owner &&
                            <>
                                <Button onClick={onBuyClicked}>Buy</Button>
                                <BuyModal
                                    visible={showBuy}
                                    onCancel={() => setShowBuy(false)} />
                            </>
                        }
                        {account !== owner &&
                            <>
                                <Button onClick={onBidClicked}>Bid</Button>
                                <BidModal
                                    visible={showBid}
                                    onCancel={() => setShowBid(false)} />
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