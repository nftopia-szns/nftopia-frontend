import axios from "axios"
import { NEXT_NFTOPIA_BACKEND_BASE_URL } from "../../../constants"
import { SearchResultDto, DecentralandSearchHitDto } from "../search/search.types"

export default async function searchById(id: string): Promise<SearchResultDto<DecentralandSearchHitDto>> {
    try {
        const URL = NEXT_NFTOPIA_BACKEND_BASE_URL + `/search/byId?id=${id}`
        const resp = await axios.post(URL)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}