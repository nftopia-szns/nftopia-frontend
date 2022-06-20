import { BigNumber } from "ethers"
import moment from "moment"
import { Order } from "../services/asset/asset-hook"

export const retrieveFromExternalUrl = (externalUrl: string) => {
    if (!externalUrl) {
        return {

        }
    }

    let match = externalUrl.matchAll(/(https:\/\/market.decentraland.org\/contracts\/)(?<contractAddress>\w+)(\/tokens\/)(?<tokenId>\w+)/g)
    let groups = match.next()?.value?.groups

    if (groups) {
        return groups
    } else return undefined
}

export const isExpiredFromNow = (expiresAt: number) => {
    return moment.utc().isAfter(moment.unix(expiresAt))
}

export const isValidOrder = (_order: Order) => {
    if (isNilOrder(_order) || isExpiredOrder(_order)) {
        return false
    }

    return true
}

export const isNilOrder = (_order: Order) => {
    return _order ?
        BigNumber.from(_order.id).eq(0) : true
}

export const isExpiredOrder = (_order: Order) => {
    return _order ?
        isExpiredFromNow(_order.expiresAt.valueOf() as number) : true
}