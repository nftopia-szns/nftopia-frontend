import { Modal } from 'antd'
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types'
import { MetaversePlatform } from 'nftopia-shared/dist/shared/platform'
import React from 'react'
import { useAppSelector } from '../../../services/hook'
import DecentralandBuyModalContent from './DecentralandBuyModalContent'

type Props = {
    visible?: boolean;
    onOk?: (e: React.MouseEvent<HTMLElement>) => void;
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

const BuyModal = (props: Props) => {
    const { visible, onOk, onCancel } = props
    const asset = useAppSelector((state) => state.asset.assetDetail as GenericAssetDto)

    const getBuyModalContent = () => {
        switch (asset.platform) {
            case MetaversePlatform.Decentraland:
                return <DecentralandBuyModalContent />
            default:
                return <p>Buy isn't implemented for {asset.platform}</p>
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