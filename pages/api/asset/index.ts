import axios from "axios"
import { DecentralandSearchHitDto, SearchResultDto } from "../../../components/search/search.types"
import { NEXT_NFTOPIA_BACKEND_BASE_URL } from "../../../constants"

export default async function searchById(id: string): Promise<SearchResultDto<DecentralandSearchHitDto>> {
    try {
        const URL = NEXT_NFTOPIA_BACKEND_BASE_URL + `/search/byId?id=${id}`

        const resp = await axios.post(URL)

        console.log(resp.data);

        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}