import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { Ask } from 'nftopia-shared/dist/shared'
import React from 'react'
import { useAppDispatch } from '../../../../../services/hook'

type Props = {
    ask: Ask
}

function AskActions(props: Props) {
    const { ask } = props
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()

    const onCancelAsk = () => {
        // dispatch(cancelBidRequest({
        //     provider,
        //     asset,
        // }))
    }

    const onBuy = () => {
        // dispatch(acceptBidRequest({
        //     sender: account,
        //     recipient: bid.bidder,
        //     provider,
        //     asset,
        // }))
    }

    return (
        <div>
            {account === ask.seller ?
                <Button onClick={onCancelAsk}>Cancel Ask</Button>
                :
                <Button onClick={onBuy}>Buy</Button>
            }
        </div>
    )
}

export default AskActions