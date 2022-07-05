import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Button, Row, Typography } from 'antd'
import router from 'next/router'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import React from 'react'
import { parameterizedRouter } from '../../../../router'
import { useDecentralandAssetHook } from '../../../../services/asset/asset-hook'
import { isValidOrder } from '../../../../utils'

type Props = {
    asset: DecentralandAssetDto,
}

const DecentralandTradingAssetDetail = (props: Props) => {
    const { asset } = props
    const { account } = useWeb3React()
    const { owner, buyable, bids, order } = useDecentralandAssetHook(asset)

    const onBidClicked = () => {
        // const url = parameterizedRouter.asset.decentraland.bid(index.toString(), assetId.toString())
        // router.push(url)
    }

    const onBuyClicked = () => {
        // const url = parameterizedRouter.asset.decentraland.buy(index.toString(), assetId.toString())
        // router.push(url)
    }

    const onSellClicked = () => {
        // const url = parameterizedRouter.asset.decentraland.sell(index.toString(), assetId.toString())
        // router.push(url)
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
            <Row></Row>
            <Row></Row>
        </>
    )
}

export default DecentralandTradingAssetDetail