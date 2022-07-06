import { formatEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal, Row, Typography, Collapse } from 'antd'
import router, { useRouter } from 'next/router'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import { EthereumChainId, toCanonicalEthereumChainId } from 'nftopia-shared/dist/shared/network'
import React, { useEffect, useState } from 'react'
const { Panel } = Collapse;
import { parameterizedRouter } from '../../../../router'
import { useDecentralandAssetHook } from '../../../../services/asset/asset-hook'
import { useAppDispatch } from '../../../../services/hook'
import { setWallet } from '../../../../services/wallet/wallet-slice'
import { isValidOrder } from '../../../../utils'
import CoinbaseWalletCard from '../../../connect-wallet/connectorCards/CoinbaseWalletCard'
import MetaMaskCard from '../../../connect-wallet/connectorCards/MetaMaskCard'
import WalletConnectCard from '../../../connect-wallet/connectorCards/WalletConnectCard'
import BidList from '../../BidList/BidList'

type Props = {
    asset: DecentralandAssetDto,
}

const DecentralandTradingAssetDetail = (props: Props) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { index, assetId } = router.query
    const { account, provider, connector, chainId } = useWeb3React()
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
    const [showWrongChainId, setShowWrongChainId] = useState(false)

    const { asset } = props
    const { owner, buyable, bids, order } = useDecentralandAssetHook(asset)

    useEffect(() => {
        connector.connectEagerly()
    }, [])

    useEffect(() => {
        dispatch(setWallet({ account, provider }))
        if (chainId) {
            setShowWrongChainId(chainId !== toCanonicalEthereumChainId(asset.chain_id as EthereumChainId))
        }
    }, [account, provider, chainId])

    const isWalletConnected = (account) => {
        return account !== undefined
    }

    const onBidClicked = () => {
        if (account) {
            // TODO: check chain id
            const url = parameterizedRouter.asset.decentraland.bid(index.toString(), assetId.toString())
            router.push(url)
        } else {
            setShowConnectWalletModal(true)
        }
    }

    const onBuyClicked = () => {
        if (account) {
            // TODO: check chain id upon asset chain id
            const url = parameterizedRouter.asset.decentraland.buy(index.toString(), assetId.toString())
            router.push(url)
        } else {
            setShowConnectWalletModal(true)
        }
    }

    const onSellClicked = () => {
        if (account) {
            const url = parameterizedRouter.asset.decentraland.sell(index.toString(), assetId.toString())
            router.push(url)
        } else {
            setShowConnectWalletModal(true)
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
            <Row>
            </Row>
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
            </Modal>
            <Modal
                closable={false}
                maskClosable={true}
                footer={null}
                visible={showWrongChainId}
            >
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    Wrong network. Please connect to network {asset.network}, chainid {asset.chain_id}
                </div>
            </Modal>
        </>
    )
}

export default DecentralandTradingAssetDetail