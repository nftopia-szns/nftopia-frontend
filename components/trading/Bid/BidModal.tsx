import { Modal } from 'antd'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import { MetaversePlatform } from 'nftopia-shared/dist/shared/platform'
import React from 'react'
import { useAppSelector } from '../../../services/hook'
import DecentralandBidModalContent from './DecentralandBidModalContent'

type Props = {
    visible?: boolean;
    onOk?: (e: React.MouseEvent<HTMLElement>) => void;
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

const BidModal = (props: Props) => {
    const { visible, onOk, onCancel } = props
    const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)

    const getBidModalContent = () => {
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                return <DecentralandBidModalContent />
            default:
                return <p>Bid isn't implemented for {asset.platform}</p>
        }
    }

    return (
        <Modal
            title="Bid Modal"
            footer={null}
            closable={true}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}>
            {getBidModalContent()}
        </Modal>
    )
}

export default BidModal