import { useWeb3React } from '@web3-react/core'
import { Drawer } from 'antd'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../services/hook'
import {
    setEthShowSwitchChainIdPopup,
    setEthShowWalletConnectPopup,
    setEthWallet
} from '../../services/wallet/wallet-slice'
import CoinbaseWalletCard from './connectorCards/CoinbaseWalletCard'
import MetaMaskCard from './connectorCards/MetaMaskCard'
import WalletConnectCard from './connectorCards/WalletConnectCard'

type Props = {}

const EthWalletDrawer = (props: Props) => {
    const dispatch = useAppDispatch()
    const { account, provider, chainId } = useWeb3React()
    const {
        ethRequiredChainId,
        ethShowWalletConnectPopup,
        ethShowSwitchChainIdPopup,
    } = useAppSelector((state) => state.wallet)

    // useEffect(() => {
    //     // show wallet connect
    //     setEthShowConnectWallet(
    //         ethRequiredWalletConnect &&
    //         account === undefined)
    // }, [ethRequiredWalletConnect, account])

    // useEffect(() => {
    //     setEthShowSwitchChainId(
    //         account &&
    //         ethRequiredChainId !== ethRequiredChainId)
    // }, [ethRequiredChainId, account, chainId])

    // const onCloseEthWaletConnectDrawer = () => {
    //     setEthShowConnectWallet(false)
    //     dispatch(setEthRequiredWalletConnect(false))
    // }

    // const onCloseEthSwichChainIdDrawer = () => {
    //     setEthShowSwitchChainId(false)
    //     dispatch(setEthRequireChainId(undefined))
    // }

    // useEffect(() => {
    //     // show wallet connect
    //     setEthShowConnectWallet(
    //         ethRequiredWalletConnect &&
    //         account === undefined)
    // }, [ethRequiredWalletConnect, account])

    useEffect(() => {
        dispatch(setEthWallet({
            account,
            provider,
            chainId
        }))

    }, [account, provider, chainId])

    const onCloseEthWaletConnectDrawer = () => {
        dispatch(setEthShowWalletConnectPopup(false))
    }

    const onCloseEthSwichChainIdDrawer = () => {
        dispatch(setEthShowSwitchChainIdPopup(false))
    }

    return (
        <>
            <Drawer
                title="Eth Wallet Connect Drawer" placement="right"
                onClose={() => onCloseEthWaletConnectDrawer()}
                visible={ethShowWalletConnectPopup}>
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    <MetaMaskCard />
                    <WalletConnectCard />
                    <CoinbaseWalletCard />
                </div>
            </Drawer>
            <Drawer
                title="Eth Switch Chain Id Drawer" placement="right"
                onClose={() => onCloseEthSwichChainIdDrawer()}
                visible={ethShowSwitchChainIdPopup}>
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    Wrong network. Please connect to network chainid {ethRequiredChainId}
                </div>
            </Drawer>
        </>
    )
}

export default EthWalletDrawer