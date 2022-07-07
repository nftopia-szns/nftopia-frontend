import { Modal } from 'antd'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import { MetaversePlatform } from 'nftopia-shared/dist/shared/platform'
import React from 'react'
import { useAppSelector } from '../../../services/hook'
import DecentralandSellModalContent from './DecentralandSellModalContent'

type Props = {
    visible?: boolean;
    onOk?: (e: React.MouseEvent<HTMLElement>) => void;
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

const SellModal = (props: Props) => {
    const { visible, onOk, onCancel } = props
    const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)

    const getSellModalContent = () => {
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                return <DecentralandSellModalContent />
            default:
                return <p>Sell isn't implemented for {asset.platform}</p>
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