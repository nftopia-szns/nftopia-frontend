import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal, Row, Typography } from 'antd'
import router from 'next/router'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import React, { useEffect, useState } from 'react'
import { parameterizedRouter } from '../../../../router'
import { useDecentralandAssetHook } from '../../../../services/asset/asset-hook'
import { useAppDispatch } from '../../../../services/hook'
import { setWallet } from '../../../../services/wallet/wallet-slice'
import { isValidOrder } from '../../../../utils'
import CoinbaseWalletCard from '../../../connect-wallet/connectorCards/CoinbaseWalletCard'
import MetaMaskCard from '../../../connect-wallet/connectorCards/MetaMaskCard'
import WalletConnectCard from '../../../connect-wallet/connectorCards/WalletConnectCard'

type Props = {
    asset: DecentralandAssetDto,
}

const DecentralandTradingAssetDetail = (props: Props) => {
    const dispatch = useAppDispatch()
    const { account, provider, connector } = useWeb3React()
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
    
    const { asset } = props
    const { owner, buyable, bids, order } = useDecentralandAssetHook(asset)

    useEffect(() => {
        connector.connectEagerly()
    }, [])

    useEffect(() => {
        dispatch(setWallet({ account, provider }))
    }, [account, provider])

    const isWalletConnected = (account) => {
        return account !== undefined
    }

    const onBidClicked = () => {
        if (account) {       
            // TODO: check chain id
        } else {
            setShowConnectWalletModal(true)
        }
        // const url = parameterizedRouter.asset.decentraland.bid(index.toString(), assetId.toString())
        // router.push(url)
    }

    const onBuyClicked = () => {
        if (account) {
            // TODO: check chain id upon asset chain id
        } else {
            setShowConnectWalletModal(true)
        }
        // const url = parameterizedRouter.asset.decentraland.buy(index.toString(), assetId.toString())
        // router.push(url)
    }

    const onSellClicked = () => {
        if (account) {

        } else {
            setShowConnectWalletModal(true)
        }
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
            <Modal
                closable={false}
                maskClosable={true}
                footer={null}
                visible={showConnectWalletModal}
                onCancel={() => setShowConnectWalletModal(false)}
            >
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    <MetaMaskCard />
                    <WalletConnectCard />
                    <CoinbaseWalletCard />
                </div>
            </Modal>˝
        </>
    )
}

export default DecentralandTradingAssetDetail