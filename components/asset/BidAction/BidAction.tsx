import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import React from 'react'
import { Bid, useDecentralandAssetHook } from '../../../services/asset/asset-hook'
import { acceptBidRequest, cancelBidRequest } from '../../../services/bid/bid-slice'
import { useAppDispatch, useAppSelector } from '../../../services/hook'
import { DecentralandSearchHitDto } from '../../../pages/api/search/search.types'

type Props = {
    bid: Bid
}

function BidAction(props: Props) {
    const { bid } = props
    const dispatch = useAppDispatch()
    const asset = useAppSelector((state) => state.asset.assetDetail as DecentralandSearchHitDto)
    const { owner } = useDecentralandAssetHook(asset)
    const { account, provider } = useWeb3React()

    const onCancelBid = () => {
        dispatch(cancelBidRequest({
            provider,
            asset,
        }))
    }

    const onAcceptBid = () => {
        dispatch(acceptBidRequest({
            sender: account,
            recipient: bid.bidder,
            provider,
            asset,
        }))
    }

    return (
        <div>
            {account === bid.bidder ?
                <Button onClick={onCancelBid}>Cancel Bid</Button>
                :
                owner === account ?
                    <Button onClick={onAcceptBid}>Accept Bid</Button> : null
            }
        </div>
    )
}

export default BidAction