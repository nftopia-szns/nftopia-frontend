import { useWeb3React } from "@web3-react/core"
import { Button, Dropdown, Layout, Menu, Space } from "antd"
import { Header, Content, Footer } from "antd/lib/layout/layout"
import { ReactNode, useEffect, useState } from "react"
import { DownOutlined } from '@ant-design/icons';

import { shortenAddress } from "../../utils/eth";
import { useAppDispatch } from "../../services/hook"
import EthWalletDrawer from "../connect-wallet/EthWalletDrawer"

import "./NFTopiaLayout.module.css"
import { setEthRequiredWalletConnect, setEthWallet } from "../../services/wallet/wallet-slice";

const NFTopiaLayout = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch()
    const { account, connector, provider, chainId } = useWeb3React()
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)

    useEffect(() => {
        connector.connectEagerly()
    }, [])

    useEffect(() => {
        if (account) {
            dispatch(setEthWallet({ account, provider, chainId }))
        } else {
            // in case user disconnect wallet
            dispatch(setEthWallet(undefined))
        }
    }, [account, provider, chainId])

    const setShowEthWalletConnectPopup = () => {
        dispatch(setEthRequiredWalletConnect(true))
    }

    const onDisconnect = (_) => {
        connector.deactivate()
        dispatch(setEthWallet(undefined))
    }

    return (
        <>
            <Layout className="layout">
                <Header>
                    {/* <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        items={new Array(3).fill(null).map((_, index) => {
                            const key = index + 1;
                            return {
                                key,
                                label: `nav ${key}`,
                            };
                        })}
                    /> */}
                    {account ?
                        <Dropdown
                            className="dropdown-btn"
                            trigger={['click']}
                            overlay={
                                <Menu
                                    items={[
                                        {
                                            label: 'Disconnect',
                                            key: 'disconnect',
                                            onClick: onDisconnect,
                                        },
                                    ]}
                                />
                            }>
                            <a onClick={e => e.preventDefault()}>
                                <Space>
                                    {shortenAddress(account)}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                        :
                        <Button
                            key="connect-wallet"
                            onClick={() => setShowEthWalletConnectPopup()}
                        >
                            Connect Wallet
                        </Button>
                    }
                    <EthWalletDrawer />
                </Header>
                <Content style={{ padding: '100 50px' }}>
                    <div className="site-layout-content" style={{ padding: '100 50px' }}>
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>NFTopia ©2022</Footer>
            </Layout>

        </>
    )
}

export default NFTopiaLayout
