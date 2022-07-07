import { useWeb3React } from '@web3-react/core'
import { Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../services/hook'
import { setEthRequireChainId, setEthRequiredWalletConnect } from '../../services/wallet/wallet-slice'
import CoinbaseWalletCard from './connectorCards/CoinbaseWalletCard'
import MetaMaskCard from './connectorCards/MetaMaskCard'
import WalletConnectCard from './connectorCards/WalletConnectCard'

type Props = {}

const EthWalletDrawer = (props: Props) => {
    const dispatch = useAppDispatch()
    const { account, chainId } = useWeb3React()
    const { ethRequiredWalletConnect, ethRequiredChainId } = useAppSelector((state) => state.wallet)
    const [ethShowConnectWallet, setEthShowConnectWallet] = useState(false)
    const [ethShowSwitchChainId, setEthShowSwitchChainId] = useState(false)

    useEffect(() => {
        // show wallet connect
        setEthShowConnectWallet(
            ethRequiredWalletConnect &&
            account === undefined)
    }, [ethRequiredWalletConnect, account])

    useEffect(() => {
        setEthShowSwitchChainId(
            account &&
            ethRequiredChainId !== ethRequiredChainId)
    }, [ethRequiredChainId, account, chainId])

    const onCloseEthWaletConnectDrawer = () => {
        setEthShowConnectWallet(false)
        dispatch(setEthRequiredWalletConnect(false))
    }

    const onCloseEthSwichChainIdDrawer = () => {
        setEthShowSwitchChainId(false)
        dispatch(setEthRequireChainId(undefined))
    }

    return (
        <>
            <Drawer
                title="Eth Wallet Connect Drawer" placement="right"
                onClose={() => onCloseEthWaletConnectDrawer()}
                visible={ethShowConnectWallet}>
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    <MetaMaskCard />
                    <WalletConnectCard />
                    <CoinbaseWalletCard />
                </div>
            </Drawer>
            <Drawer
                title="Eth Switch Chain Id Drawer" placement="right"
                onClose={() => onCloseEthSwichChainIdDrawer()}
                visible={ethShowSwitchChainId}>
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    Wrong network. Please connect to network chainid {chainId}
                </div>
            </Drawer>
        </>
    )
}

export default EthWalletDrawer