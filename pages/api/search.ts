import axios, { AxiosResponse } from "axios"
import { SearchQueryDto, SearchResultDto } from "../../components/search/search.types"
import { NEXT_SERVER_URI } from "../../constants"

export default async function search<T>(
    query: string,
    page: number,
    pageSize: number,
): Promise<SearchResultDto<T>> {
    try {
        const searchQueryDto: SearchQueryDto = {
            query,
            page,
            pageSize
        }

        const resp = await axios.post<SearchQueryDto, AxiosResponse<SearchResultDto<T>>>(NEXT_SERVER_URI, searchQueryDto)

        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}