import axios from "axios"
import { NEXT_DCL_NFT_API } from "../../../constants"

export default async function fetch(
    contractAddress: string,
    tokenId: string
): Promise<object> {
    try {
        const URL = NEXT_DCL_NFT_API + `?contractAddress=${contractAddress}&tokenId=${tokenId}`

        const resp = await axios.get(URL)

        console.log(resp.data);
        

        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}