
import { Modal } from 'antd'
import { Network, PolygonChainId } from 'nftopia-shared/dist/shared'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import React from 'react'
import { useAppSelector } from '../../../services/hook'
import GenericSellModalContent from './GenericSellModalContent'

type Props = {
    visible?: boolean;
    onOk?: (e: React.MouseEvent<HTMLElement>) => void;
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

const SellModal = (props: Props) => {
    const { visible, onOk, onCancel } = props
    const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)

    const getSellModalContent = () => {
        switch (asset.network) {
            case Network.Polygon:
                switch (asset.chain_id) {
                    case PolygonChainId.Mumbai:
                        return <GenericSellModalContent />

                    default:
                        return <p>Sell isn't implemented for network {asset.network}, chainid ${asset.chain_id}</p>
                }

            default:
                return <p>Sell isn't implemented for network {asset.network}, chainid ${asset.chain_id}</p>
        }
    }

    return (
        <Modal
            title="Sell Modal"
            footer={null}
            closable={true}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}>
            {getSellModalContent()}
        </Modal>
    )
}

export default SellModal