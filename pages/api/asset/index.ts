import axios from "axios"
import { NEXT_NFTOPIA_BACKEND_BASE_URL } from "../../../constants"
import { Ask, Bid, GetAssetAsksParams, GetAssetBidsParams, GetAssetParams, Token } from "nftopia-shared/dist"

export async function getAsset(params: GetAssetParams): Promise<Token> {
    try {
        const URL = NEXT_NFTOPIA_BACKEND_BASE_URL + `/asset/getAsset`
        const resp = await axios.post(URL, params)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getAssetAsks(params: GetAssetAsksParams): Promise<Ask[]> {
    try {
        const URL = NEXT_NFTOPIA_BACKEND_BASE_URL + `/asset/getAsksOfToken`
        const resp = await axios.post(URL, params)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getAssetBids(params: GetAssetBidsParams): Promise<Bid[]> {
    try {
        const URL = NEXT_NFTOPIA_BACKEND_BASE_URL + `/asset/getBidsOfToken`
        const resp = await axios.post(URL, params)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}