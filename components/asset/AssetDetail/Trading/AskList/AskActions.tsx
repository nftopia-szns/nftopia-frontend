import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { Ask } from 'nftopia-shared/dist/shared'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../services/hook'
import { cancelSellingRequest, setAssetForSale, setBuyModalRequired } from '../../../../../services/sale/sale-slice'

type Props = {
    ask: Ask
}

function AskActions(props: Props) {
    const { ask } = props
    const dispatch = useAppDispatch()
    const asset = useAppSelector((state) => state.asset.assetDetail)
    const { account } = useWeb3React()

    useEffect(() => {
        if (asset) {
            dispatch(setAssetForSale(asset))
        }
    }, [asset])

    const onCancelAsk = () => {
        dispatch(cancelSellingRequest({
            ask: ask,
        }))
    }

    const onBuy = () => {
        dispatch(setBuyModalRequired(true))
    }

    return (
        <div>
            {account?.toLowerCase() === ask.seller ?
                <Button onClick={onCancelAsk}>Cancel Ask</Button>
                :
                <Button onClick={onBuy}>Buy</Button>
            }
        </div>
    )
}

export default AskActions