import { useWeb3React } from "@web3-react/core"
import { Col, Modal, Row, Image, Spin, Typography, Alert } from "antd"
import Title from "antd/lib/typography/Title"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../modules/hook"
import {
    ContractData,
    ContractName,
    getContract
} from 'decentraland-transactions'
import NoWalletConnected from "../../connect-wallet/NoWalletConnected"
import { formatEther } from "@ethersproject/units"
import { ERC721Bid, IERC20, IERC20__factory } from "../../../contracts/bid-contract/typechain-types"
import { BigNumber } from "@ethersproject/bignumber"
import { BN_ZERO } from "../../../constants/eth"
import { useAssetOrder, useFingerprint } from "../../../modules/asset/asset-hook"
import { DecentralandSearchHitDto } from "../../search/search.types"
import { buyRequest } from "../../../modules/buy/buy-slice"

type Props = {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
}

const BuyModal = (props: Props) => {
    const dispatch = useAppDispatch()
    const { visible, setVisible } = props
    const { account, provider } = useWeb3React()
    const assetDetail = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)

    const [fingerprint] = useFingerprint(assetDetail) // only for estate
    const [order] = useAssetOrder(assetDetail)

    const [balanceOfMana, setBalanceOfMana] = useState<BigNumber>()

    useEffect(() => {
        if (account && assetDetail) {
            const nft = assetDetail
            if (!balanceOfMana) {
                // get info
                const contractManaData: ContractData = getContract(
                    ContractName.MANAToken,
                    nft.chain_id,
                )
                const contractMana = IERC20__factory.connect(
                    contractManaData.address,
                    provider.getSigner(),
                )
                contractMana.balanceOf(account).then((v) => {
                    setBalanceOfMana(v)
                })
            }
        }
    }, [assetDetail, account])

    const onBuy = async () => {
        if (order) {
            dispatch(buyRequest({
                caller: account,
                provider,
                asset: assetDetail,
                price: order.price,
                fingerprint
            }))
        }
    }

    return (
        <Modal
            closable={false}
            maskClosable={true}
            width={700}
            visible={visible}
            okText="Buy"
            onCancel={() => setVisible(false)}
            onOk={onBuy}
            footer={account ? undefined : null}
        >
            {account ?
                <>
                    <Row>
                        <Col span={12}>
                            <Image
                                preview={false}
                                width={200}
                                src={assetDetail?.image}
                                placeholder={<Spin spinning={!assetDetail} />} />
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Title>Purchase an item</Title>
                                <Typography>Set a price and expiration date for your purchase on <b>{assetDetail?.name}</b>.</Typography>
                            </Row>
                            <Row>
                                <Typography>This asset costs <b>{order ? formatEther(order.price) : 0} MANA</b>.</Typography>
                            </Row>
                            {(balanceOfMana && order && balanceOfMana.lt(order.price)) &&
                                <Row>
                                    <Alert message="Your balance is not enough" type="error" />
                                </Row>
                            }
                        </Col>
                    </Row>
                </>
                :
                <>
                    <NoWalletConnected />
                </>
            }
        </Modal>
    )
}

export default BuyModal