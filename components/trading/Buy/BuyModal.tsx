import { Modal } from 'antd'
import { Network, PolygonChainId } from 'nftopia-shared/dist/shared'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import React from 'react'
import { useAppSelector } from '../../../services/hook'
import GenericBuyModalContent from './GenericBuyModalContent'

type Props = {
    visible?: boolean;
    onOk?: (e: React.MouseEvent<HTMLElement>) => void;
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

const BuyModal = (props: Props) => {
    const { visible, onOk, onCancel } = props
    const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)

    const getBuyModalContent = () => {
        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        return <GenericBuyModalContent />

                    default:
                        return <p>Buy isn't implemented for network {asset.network}, chainid ${asset.chain_id}</p>
                }

            default:
                return <p>Buy isn't implemented for network {asset.network}, chainid ${asset.chain_id}</p>
        }
    }

    return (
        <Modal
            title="Buy Modal"
            footer={null}
            closable={true}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}>
            {getBuyModalContent()}
        </Modal>
    )
}

export default BuyModal