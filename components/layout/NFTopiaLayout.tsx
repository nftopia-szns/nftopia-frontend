import { Breadcrumb, Layout, Menu } from "antd"
import { Header, Content, Footer } from "antd/lib/layout/layout"
import { ReactNode } from "react"
import "./NFTopiaLayout.module.css"

const NFTopiaLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={new Array(15).fill(null).map((_, index) => {
                            const key = index + 1;
                            return {
                                key,
                                label: `nav ${key}`,
                            };
                        })}
                    />
                </Header>
                <Content style={{ padding: '100 50px' }}>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb> */}
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
