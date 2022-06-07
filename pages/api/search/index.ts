import axios, { AxiosResponse } from "axios"
import { NEXT_NFTOPIA_BACKEND_BASE_URL } from "../../../constants"
import { SearchDto, SearchResultDto } from "./search.types"

export async function enhancedSearch<T>(searchDto: SearchDto): Promise<SearchResultDto<T>> {
    try {
        const resp = await axios.post<SearchDto, AxiosResponse<SearchResultDto<T>>>(
            NEXT_NFTOPIA_BACKEND_BASE_URL + '/search', 
            searchDto
        )

        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}