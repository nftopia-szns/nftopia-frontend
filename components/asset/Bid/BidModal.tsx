import { useWeb3React } from "@web3-react/core"
import { Col, Modal, Row, Image, Spin, Typography, DatePicker, InputNumber, Alert } from "antd"
import Title from "antd/lib/typography/Title"
import moment, { Moment } from "moment"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useAppSelector } from "../../../redux/hook"
import {
    ContractData,
    ContractName,
    getContract
} from 'decentraland-transactions'
import NoWalletConnected from "../../connect-wallet/NoWalletConnected"
import { Network } from "../DecentralandAsset/DecentralandAsset.type"
import { AssetDetail } from "../../../redux/features/asset/asset-slice"
import { parseUnits } from "@ethersproject/units"
import { ERC721Bid, ERC721Bid__factory, IERC20, IERC20__factory } from "../../../contracts/bid-contract/typechain-types"
import { BigNumber } from "@ethersproject/bignumber"
import { BN_ZERO } from "../../../constants/eth"
import { useFingerprint } from "../../../redux/features/asset/asset-hook"

type Props = {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
}

const BidModal = (props: Props) => {
    const assetDetail = useAppSelector((state) => state.asset.assetDetail as AssetDetail)

    const { account, provider } = useWeb3React()
    const { visible, setVisible } = props

    const [bidAmount, setBidAmount] = useState<number>(1000)
    const [expirationDate, setExpirationDate] = useState<Moment>(moment.utc())

    const [contractBid, setContractBid] = useState<ERC721Bid>(undefined)
    // only for estate
    const [fingerprint, isLoadingFingerprint] = useFingerprint(assetDetail?.data[0]?.nft)

    const [contractMana, setContractMana] = useState<IERC20>(undefined)
    const [balanceOfMana, setBalanceOfMana] = useState<BigNumber>(BN_ZERO)

    useEffect(() => {
        if (account && assetDetail) {
            const nft = assetDetail.data[0].nft
            if (!contractMana) {
                // get info
                const contractManaData: ContractData = getContract(
                    ContractName.MANAToken,
                    nft.chainId,
                )
                const _contractMana = IERC20__factory.connect(
                    contractManaData.address,
                    provider.getSigner(),
                )
                _contractMana.balanceOf(account).then((v) => {
                    setBalanceOfMana(v)
                })
                setContractMana(_contractMana)
            }
            if (!contractBid) {
                // get info
                const contractBidData: ContractData = getContract(
                    ContractName.Bid,
                    nft.chainId,
                )
                setContractBid(
                    ERC721Bid__factory.connect(
                        contractBidData.address,
                        provider.getSigner(),
                    )
                )
            }
        }
    }, [assetDetail, account, contractMana])

    const onBid = () => {
        const nft = assetDetail.data[0].nft

        const priceInWei = parseUnits(bidAmount.toString(), 'ether')
        const expiresIn = Math.round((moment.utc().valueOf() - expirationDate.valueOf()) / 1000)

        switch (nft.network) {
            case Network.ETHEREUM: {
                if (fingerprint) {
                    return contractBid['placeBid(address,uint256,uint256,uint256,bytes)'](
                        nft.contractAddress,
                        nft.tokenId,
                        priceInWei,
                        expiresIn,
                        fingerprint
                    )
                } else {
                    return contractBid['placeBid(address,uint256,uint256,uint256)'](
                        nft.contractAddress,
                        nft.tokenId,
                        priceInWei,
                        expiresIn
                    )
                }
            }
            case Network.MATIC: {
                contractBid['placeBid(address,uint256,uint256,uint256)'](
                    nft.contractAddress,
                    nft.tokenId,
                    priceInWei,
                    expiresIn
                )
            }
        }
    }

    return (
        <Modal
            closable={false}
            maskClosable={true}
            width={700}
            visible={visible}
            okText="Bid"
            onCancel={() => setVisible(false)}
            onOk={onBid}
            footer={account ? undefined : null}
        >
            {account ?
                <>
                    <Row>
                        <Col span={12}>
                            <Image
                                preview={false}
                                width={200}
                                src={assetDetail?.data[0]?.nft.image}
                                placeholder={<Spin spinning={!assetDetail} />} />
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Title>Place a bid</Title>
                                <Typography>Set a price and expiration date for your bid on <b>{assetDetail?.data[0]?.nft.name}</b>.</Typography>
                            </Row>
                            <Row>
                                <InputNumber
                                    size="large"
                                    min={1}
                                    controls={false}
                                    value={bidAmount}
                                    onChange={(v) => { setBidAmount(v) }} />
                            </Row>
                            <Row>
                                <DatePicker
                                    size="large"
                                    defaultValue={moment('01/01/2015', 'DD/MM/YYYY')}
                                    format={'DD/MM/YYYY'}
                                    value={expirationDate}
                                    onChange={(v) => setExpirationDate(v)} />
                            </Row>
                            {(balanceOfMana <= BN_ZERO || balanceOfMana < BigNumber.from(bidAmount)) &&
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

export default BidModal