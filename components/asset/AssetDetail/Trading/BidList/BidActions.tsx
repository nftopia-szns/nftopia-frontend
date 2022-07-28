import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { Bid } from 'nftopia-shared/dist/shared'
import React, { useEffect } from 'react'
import { acceptBid, cancelBid, setAssetForBid } from '../../../../../services/bid/bid-slice'
import { useAppDispatch, useAppSelector } from '../../../../../services/hook'

type Props = {
    bid: Bid
}

function BidActions(props: Props) {
    const { bid } = props
    const dispatch = useAppDispatch()
    const asset = useAppSelector((state) => state.asset.assetDetail)
    const { account } = useWeb3React()

    useEffect(() => {
        if (asset) {
            dispatch(setAssetForBid(asset))
        }
    }, [asset])

    const onCancelBid = () => {
        dispatch(cancelBid({
            bid: bid
        }))
    }

    const onAcceptBid = () => {
        dispatch(acceptBid({
            bid: bid
        }))
    }

    return (
        <div>
            {account?.toLowerCase() === bid.bidder &&
                <Button onClick={onCancelBid}>Cancel Bid</Button>
            }
            {account?.toLowerCase() === asset.owner &&
                <Button onClick={onAcceptBid}>Accept Bid</Button>
            }
        </div>
    )
}

export default BidActions