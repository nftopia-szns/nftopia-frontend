import { MetaversePlatform } from "nftopia-shared/dist/shared/platform";
import { ChainId, EthereumNetwork, SolanaNetwork } from "nftopia-shared/dist/shared/network";
import { SearchDto } from "../../pages/api/search/search.types";
import { SearchState } from "./search-slice";
import {
    CryptovoxelsSearchState,
    DecentralandSaleFilter,
    DecentralandSearchState,
    DecentralandSortByCriterias,
    SandBoxSearchState,
    SolanaTownSearchState
} from "./search.types";
import { DecentralandAssetCategory } from "nftopia-shared/dist/shared/asset";

export const buildSearchDtoFromState = (state: SearchState): SearchDto => {
    switch (state.platform) {
        case MetaversePlatform.Decentraland:
            return _buildDecentralandSearchDtoFromState(state)
        case MetaversePlatform.SandBox:
            return _buildSandBoxSearchDtoFromState(state);
        case MetaversePlatform.Cryptovoxels:
            return _buildCryptovoxelsSearchDtoFromState(state);
        case MetaversePlatform.SolanaTown:
            return _buildSolanaTownSearchDtoFromState(state);
        default:
            throw new Error(`${state.platform} is not supported`)
    }
}

export const _buildDecentralandSearchDtoFromState = (state: SearchState): SearchDto => {
    let should = []
    let must = []
    let must_not = []

    if (state.query && state.query !== '') {
        must.push({
            "multi_match": {
                "query": state.query,
                "fields": [
                    "name",
                    "description",
                    // "attributes.coordinate",
                    "owner"
                ]
            }
        })
    }

    const platformSearchState = state.platformSearchState as DecentralandSearchState

    switch (platformSearchState.saleFilter) {
        case DecentralandSaleFilter.OnSale:
            must.push({
                "exists": {
                    "field": "attributes.active_order"
                }
            })
            break;
        case DecentralandSaleFilter.NotOnSale:
            must_not.push({
                "exists": {
                    "field": "attributes.active_order"
                }
            })
            break;
        case DecentralandSaleFilter.All:
        default:
            break;
    }

    must.push({
        terms: {
            "attributes.category": platformSearchState.categoryFilter
        }
    })

    if (platformSearchState.ownerFilter) {
        must.push({
            "match": {
                "owner": platformSearchState.ownerFilter
            }
        })
    }

    // filter price
    if (platformSearchState.priceMinFilter || platformSearchState.priceMaxFilter) {
        // build range
        const range = {}

        if (platformSearchState.priceMinFilter) {
            range["attributes.active_order.price"] = {
                gte: platformSearchState.priceMinFilter
            }
        }

        if (platformSearchState.priceMaxFilter) {
            range["attributes.active_order.price"] = {
                ...range["active_order.price"],
                lte: platformSearchState.priceMaxFilter
            }
        }

        must.push({ range: range })
    }

    // filter out invalid estate (size = 0)
    if (platformSearchState.categoryFilter.includes(DecentralandAssetCategory.Estate)) {
        must_not.push({
            "match": {
                "attributes.estate_size": 0
            }
        })
    }

    // build query
    const query = {
        bool: {
            should: should,
            must: must,
            must_not: must_not,
        }
    }

    // build sort
    const sort = {}
    switch (platformSearchState.sortBy) {
        case DecentralandSortByCriterias.RecentlyBought:
            sort["attributes.sold_at"] = {
                order: "desc"
            }
            break;
        case DecentralandSortByCriterias.TotalSales:
            sort["attributes.sales"] = {
                order: "desc"
            }
            break;
        case DecentralandSortByCriterias.RecentlyListed:
            sort["attributes.active_order.updated_at"] = {
                order: "desc"
            }
            break;
        case DecentralandSortByCriterias.Price:
        default:
            sort["attributes.active_order.price"] = {
                order: "desc"
            }
            break;
    }

    // build index
    const index = `${MetaversePlatform.Decentraland}-${ChainId.Ethereum}-${EthereumNetwork.Mainnet}`

    // build searchDto
    const searchDto = {
        indices: [index],
        query: query,
        sort: sort,
        page: state.page,
        pageSize: state.pageSize
    }

    return searchDto;
}

export const _buildSandBoxSearchDtoFromState = (state: SearchState): SearchDto => {
    let should = []
    let must = []
    let must_not = []

    if (state.query && state.query !== '') {
        must.push({
            "multi_match": {
                "query": state.query,
                "fields": [
                    "name",
                    "description",
                    // "attributes.coordinate",
                    "owner"
                ]
            }
        })
    }

    const platformSearchState = state.platformSearchState as SandBoxSearchState

    must = must.concat(
        {
            terms: {
                "attributes.category": platformSearchState.categoryFilter
            }
        },
        {
            terms: {
                "attributes.land_type": platformSearchState.landTypeFilter
            }
        }
    )

    if (platformSearchState.ownerFilter) {
        must.push({
            "match": {
                "owner": platformSearchState.ownerFilter
            }
        })
    }

    // build query
    const query = {
        bool: {
            should: should,
            must: must,
            must_not: must_not,
        }
    }

    // build sort
    const sort = {}

    // build index
    const index = `${MetaversePlatform.SandBox}-${ChainId.Ethereum}-${EthereumNetwork.Mainnet}`

    // build searchDto
    const searchDto = {
        indices: [index],
        query: query,
        sort: sort,
        page: state.page,
        pageSize: state.pageSize
    }

    return searchDto;
}

export const _buildCryptovoxelsSearchDtoFromState = (state: SearchState): SearchDto => {
    let should = []
    let must = []
    let must_not = []

    if (state.query && state.query !== '') {
        must.push({
            "multi_match": {
                "query": state.query,
                "fields": [
                    "name",
                    "description",
                    "owner"
                ]
            }
        })
    }

    const platformSearchState = state.platformSearchState as CryptovoxelsSearchState

    must = must.concat(
        {
            terms: {
                "attributes.suburb": platformSearchState.suburbFilter
            }
        },
        {
            terms: {
                "attributes.island": platformSearchState.islandFilter
            }
        }
    )

    if (platformSearchState.areaMaxFilter ||
        platformSearchState.areaMinFilter) {
        const range = {}
        if (platformSearchState.areaMinFilter) {
            range["attributes.area"] = {
                ...range["attributes.area"],
                gte: platformSearchState.areaMinFilter
            }
        }

        if (platformSearchState.areaMaxFilter) {
            range["attributes.area"] = {
                ...range["attributes.area"],
                lte: platformSearchState.areaMaxFilter
            }
        }

        must.push({ range: range })
    }

    if (platformSearchState.heightMaxFilter ||
        platformSearchState.heightMinFilter) {
        const range = {}
        if (platformSearchState.heightMinFilter) {
            range["attributes.height"] = {
                ...range["attributes.height"],
                gte: platformSearchState.heightMinFilter
            }
        }

        if (platformSearchState.heightMaxFilter) {
            range["attributes.height"] = {
                ...range["attributes.height"],
                lte: platformSearchState.heightMaxFilter
            }
        }

        must.push({ range: range })
    }

    // build query
    const query = {
        bool: {
            should: should,
            must: must,
            must_not: must_not,
        }
    }

    // // build sort
    // const sort = {}
    // switch (platformSearchState.sortBy) {
    //     case DecentralandSortByCriterias.RecentlyBought:
    //         sort["sold_at"] = {
    //             order: "desc"
    //         }
    //         break;
    //     case DecentralandSortByCriterias.TotalSales:
    //         sort["sales"] = {
    //             order: "desc"
    //         }
    //         break;
    //     case DecentralandSortByCriterias.RecentlyListed:
    //         sort["active_order.updated_at"] = {
    //             order: "desc"
    //         }
    //         break;
    //     case DecentralandSortByCriterias.Price:
    //     default:
    //         sort["active_order.price"] = {
    //             order: "desc"
    //         }
    //         break;
    // }

    // build index
    const index = `${MetaversePlatform.Cryptovoxels}-${ChainId.Ethereum}-${EthereumNetwork.Mainnet}`

    // build searchDto
    const searchDto = {
        indices: [index],
        query: query,
        // sort: sort,
        page: state.page,
        pageSize: state.pageSize
    }

    return searchDto;
}

export const _buildSolanaTownSearchDtoFromState = (state: SearchState): SearchDto => {
    let should = []
    let must = []
    let must_not = []

    if (state.query && state.query !== '') {
        must.push({
            "multi_match": {
                "query": state.query,
                "fields": [
                    "name",
                    "description",
                    //  TODO: how to get owner solana nft
                    // "owner"
                ]
            }
        })
    }

    const platformSearchState = state.platformSearchState as SolanaTownSearchState

    must = must.concat(
        {
            terms: {
                "attributes.type": platformSearchState.categoryFilter
            }
        }
    )

    // build query
    const query = {
        bool: {
            should: should,
            must: must,
            must_not: must_not,
        }
    }

    // build index
    const index = `${MetaversePlatform.SolanaTown}-${ChainId.Solana}-${SolanaNetwork.Mainnet}`

    const searchDto = {
        indices: [index],
        query: query,
        // sort: sort,
        page: state.page,
        pageSize: state.pageSize
    }

    return searchDto
}