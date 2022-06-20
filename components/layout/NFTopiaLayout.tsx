import { useWeb3React } from "@web3-react/core"
import { Button, Dropdown, Layout, Menu, Modal, Space } from "antd"
import { Header, Content, Footer } from "antd/lib/layout/layout"
import { ReactNode, useEffect, useState } from "react"
import CoinbaseWalletCard from "../connect-wallet/connectorCards/CoinbaseWalletCard"
import MetaMaskCard from "../connect-wallet/connectorCards/MetaMaskCard"
import WalletConnectCard from "../connect-wallet/connectorCards/WalletConnectCard"
import { shortenAddress } from "../../utils/eth";
import { DownOutlined } from '@ant-design/icons';

import "./NFTopiaLayout.module.css"
import { MenuInfo } from "rc-menu/lib/interface"
import { useAppDispatch } from "../../services/hook"
import { setWallet } from "../../services/wallet/wallet-slice"

const NFTopiaLayout = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch()
    const { account, connector, provider } = useWeb3React()
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)

    useEffect(() => {
        connector.connectEagerly()
    }, [])

    useEffect(() => {
        dispatch(setWallet({ account, provider }))
    }, [account, provider])

    const onDisconnect = (info: MenuInfo) => {
        connector.deactivate()
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
                                            onClick: (_) => { connector.deactivate() }
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
                        <>
                            <Button
                                key="connect-wallet"
                                onClick={() => { setShowConnectWalletModal(true) }}
                            >
                                Connect Wallet
                            </Button>
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
                        </>
                    }
                </Header>
                <Content style={{ padding: '100 50px' }}>
                    <div className="site-layout-content" style={{ padding: '100 50px' }}>
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>

        </>
    )
}

export default NFTopiaLayout
