import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types";
import { Network, PolygonChainId } from "nftopia-shared/dist/shared/network";
import axios from "axios"
import { BigNumber } from "ethers";

const _getSubgraphURL = (asset: GenericAssetDto) => {
    let url = ""

    switch (asset.network) {
        case Network.Polygon:
            switch (asset.chain_id) {
                case PolygonChainId.Mumbai:
                    url = "https://api.thegraph.com/subgraphs/name/phatngluu/nftopia-subgraph-mumbai"
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }

    return url
}

export const getToken = async (asset: GenericAssetDto): Promise<Token> => {
    const r = await graphql(
        _getSubgraphURL(asset),
        {
            "query": `{
                token(
                    id: "${asset.contract_address}-${asset.id}"
                ) {
                    id
                    owner
                    createdAt
                    updatedAt
                }
            }`,
            "variables": null
        }
    )

    return r.token as Token
}

export const getAsks = async (asset: GenericAssetDto): Promise<Ask[]> => {
    const r = await graphql(
        _getSubgraphURL(asset),
        {
            "query": `{
                asks(
                    first: 100,
                    where: {
                        address: "${asset.contract_address}" 
                        tokenId: "${asset.id}"
                    }
                ) {
                    id
                    address
                    tokenId
                    seller
                    status
                }
            }`,
            "variables": null
        }
    )

    return r.asks as Ask[]
}

export const getBids = async (asset: GenericAssetDto): Promise<Bid[]> => {
    const r = await graphql(
        _getSubgraphURL(asset),
        {
            "query": `{
                bids(
                    first: 100,
                    where: {
                        address: "${asset.contract_address}" 
                        tokenId: "${asset.id}"
                    }
                ) {
                    id
                address
                tokenId
                bidder
                quoteToken
                price
                createdAt
                updatedAt
                status
                }
            }`,
            "variables": null
        }
    )

    return r.bids as Bid[]
}

export async function graphql(url: string, query: object, retries = 5, retryDelay = 500): Promise<any> {
    try {
        const res = await axios.post(url, query)
        return res.data.data
    } catch (ex) {
        console.error(ex)
    }
}

export interface Token {
    id: string
    owner: string
    createdAt: string
    updatedAt: string
}

export interface Ask {
    id: string
    address: string
    tokenId: BigNumber
    seller: string
    quoteToken: string
    price: BigNumber
    createdAt: BigNumber
    updatedAt: BigNumber
    status: Status
    buyer?: string
}

export interface Bid {
    id: string
    address: string
    tokenId: BigNumber
    bidder: string
    quoteToken: string
    price: BigNumber
    createdAt: BigNumber
    updatedAt: BigNumber
    status: Status
}

export enum Status {
    New = "New",
    Cancelled = "Cancelled",
    Accepted = "Accepted",
}