import { useWeb3React } from '@web3-react/core'
import { Drawer } from 'antd'
import { EthereumChainId, toCanonicalEthereumChainId } from 'nftopia-shared/dist/shared/network'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../services/hook'
import { setEthRequireChainId, setEthRequiredWalletConnect, setEthRequireSwitchChainIdPopup, setEthRequireWalletConnectPopup, setEthWallet } from '../../services/wallet/wallet-slice'
import CoinbaseWalletCard from './connectorCards/CoinbaseWalletCard'
import MetaMaskCard from './connectorCards/MetaMaskCard'
import WalletConnectCard from './connectorCards/WalletConnectCard'

type Props = {}

const EthWalletDrawer = (props: Props) => {
    const dispatch = useAppDispatch()
    const { account, provider, chainId } = useWeb3React()
    const {
        ethRequiredWalletConnect,
        ethRequiredChainId,
        ethRequireWalletConnectPopup,
        ethRequireSwitchChainIdPopup,
    } = useAppSelector((state) => state.wallet)
    const [ethShowConnectWallet, setEthShowConnectWallet] = useState(false)
    const [ethShowSwitchChainId, setEthShowSwitchChainId] = useState(false)

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

        const isWalletConnected = account && provider && true
        const isChainIdMatched = chainId === ethRequiredChainId
        dispatch(setEthRequireWalletConnectPopup(!isWalletConnected))
        dispatch(setEthRequireSwitchChainIdPopup(!isChainIdMatched))
    }, [account, provider, chainId])

    const onCloseEthWaletConnectDrawer = () => {
        setEthShowConnectWallet(false)
        dispatch(setEthRequireWalletConnectPopup(false))
    }

    const onCloseEthSwichChainIdDrawer = () => {
        setEthShowSwitchChainId(false)
        dispatch(setEthRequireSwitchChainIdPopup(false))
    }

    return (
        <>
            <Drawer
                title="Eth Wallet Connect Drawer" placement="right"
                onClose={() => onCloseEthWaletConnectDrawer()}
                visible={
                    ethRequireWalletConnectPopup &&
                    !account
                }>
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    <MetaMaskCard />
                    <WalletConnectCard />
                    <CoinbaseWalletCard />
                </div>
            </Drawer>
            <Drawer
                title="Eth Switch Chain Id Drawer" placement="right"
                onClose={() => onCloseEthSwichChainIdDrawer()}
                visible={
                    ethRequireSwitchChainIdPopup &&
                    chainId !== ethRequiredChainId
                }>
                <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                    Wrong network. Please connect to network chainid {ethRequiredChainId}
                </div>
            </Drawer>
        </>
    )
}

export default EthWalletDrawer