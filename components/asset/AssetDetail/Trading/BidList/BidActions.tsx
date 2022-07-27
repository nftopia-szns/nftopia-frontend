import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { Bid } from 'nftopia-shared/dist/shared'
import { DecentralandAssetDto } from 'nftopia-shared/dist/shared/asset'
import React from 'react'
import { acceptBidRequest, cancelBidRequest } from '../../../../../services/bid/bid-slice'
import { useAppDispatch, useAppSelector } from '../../../../../services/hook'

type Props = {
    bid: Bid
}

function BidActions(props: Props) {
    const { bid } = props
    const dispatch = useAppDispatch()
    const asset = useAppSelector((state) => state.asset.assetDetail)
    const { account, provider } = useWeb3React()

    const onCancelBid = () => {
        // dispatch(cancelBidRequest({
        //     provider,
        //     asset,
        // }))
    }

    const onAcceptBid = () => {
        // dispatch(acceptBidRequest({
        //     sender: account,
        //     recipient: bid.bidder,
        //     provider,
        //     asset,
        // }))
    }

    return (
        <div>
            {account === bid.bidder &&
                <Button onClick={onCancelBid}>Cancel Bid</Button>
            }
            {account === asset.owner &&
                <Button onClick={onAcceptBid}>Accept Bid</Button>
            }
        </div>
    )
}

export default BidActions