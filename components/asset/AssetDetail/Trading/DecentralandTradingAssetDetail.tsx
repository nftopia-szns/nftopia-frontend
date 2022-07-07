import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Button, Row, Typography, Collapse } from 'antd'
import { useRouter } from 'next/router'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import React, { useEffect, useState } from 'react'
const { Panel } = Collapse;
import { useDecentralandAssetHook } from '../../../../services/asset/asset-hook'
import { useAppDispatch } from '../../../../services/hook'
import { setEthRequiredWalletConnect } from '../../../../services/wallet/wallet-slice'
import { isValidOrder } from '../../../../utils'
import BidList from '../../BidList/BidList'

type Props = {
    asset: DecentralandAssetDto,
}

const DecentralandTradingAssetDetail = (props: Props) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { index, assetId } = router.query
    const { account, provider, connector, chainId } = useWeb3React()
    const { asset } = props
    const { owner, buyable, bids, order } = useDecentralandAssetHook(asset)

    const [showBid, setShowBid] = useState(false)
    const [showBuy, setShowBuy] = useState(false)
    const [showSell, setShowSell] = useState(false)

    useEffect(() => {
        connector.connectEagerly()
    }, [])

    const isWalletConnected = (account) => {
        return account !== undefined
    }

    const onBidClicked = () => {
        dispatch(setEthRequiredWalletConnect(true))
        setShowBid(true)
    }

    const onBuyClicked = () => {
        dispatch(setEthRequiredWalletConnect(true))
        setShowBuy(true)
    }

    const onSellClicked = () => {
        dispatch(setEthRequiredWalletConnect(true))
        setShowSell(true)
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
                    </>
                    :
                    <>
                        {isValidOrder(order) && account !== owner &&
                            <Button onClick={onBuyClicked}>Buy</Button>
                        }
                        {account !== owner &&
                            <Button onClick={onBidClicked}>Bid</Button>
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