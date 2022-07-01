import { MetaversePlatform } from "nftopia-shared/dist/shared/platform";
import { ChainId, EthereumNetwork, SolanaNetwork } from "nftopia-shared/dist/shared/network";
import { SearchDto } from "../../pages/api/search/search.types";
import { SearchState } from "./search-slice";
import { CryptovoxelsIslandFilter, CryptovoxelsSearchState, CryptovoxelsSuburbFilter, DecentralandCategoryFilter, DecentralandSaleFilter, DecentralandSearchState, DecentralandSortByCriterias, SandBoxSearchState, SolanaTownCategoryFilter, SolanaTownSearchState } from "./search.types";

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
                    "attributes.coordinate",
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
                    "field": "active_order"
                }
            })
            break;
        case DecentralandSaleFilter.NotOnSale:
            must_not.push({
                "exists": {
                    "field": "active_order"
                }
            })
            break;
        case DecentralandSaleFilter.All:
        default:
            break;
    }

    must.push({
        terms: {
            category: platformSearchState.categoryFilter.map((item) => getDecentralandKeyCategoryFilter(item))
        }
    })

    if (platformSearchState.ownerFilter) {
        must.push({
            "match": {
                "owner": platformSearchState.ownerFilter
            }
        })
    }

    const range = {}
    if (platformSearchState.priceMinFilter || platformSearchState.priceMaxFilter) {
        if (platformSearchState.priceMinFilter) {
            range["active_order.price"] = {
                gte: platformSearchState.priceMinFilter
            }
        }

        if (platformSearchState.priceMaxFilter) {
            range["active_order.price"] = {
                ...range["active_order.price"],
                lte: platformSearchState.priceMaxFilter
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

    // build sort
    const sort = {}
    switch (platformSearchState.sortBy) {
        case DecentralandSortByCriterias.RecentlyBought:
            sort["sold_at"] = {
                order: "desc"
            }
            break;
        case DecentralandSortByCriterias.TotalSales:
            sort["sales"] = {
                order: "desc"
            }
            break;
        case DecentralandSortByCriterias.RecentlyListed:
            sort["active_order.updated_at"] = {
                order: "desc"
            }
            break;
        case DecentralandSortByCriterias.Price:
        default:
            sort["active_order.price"] = {
                order: "desc"
            }
            break;
    }

    // build searchDto
    const searchDto = {
        // TODO: remove this hardcode
        indices: ['decentraland-ethereum-3'],
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
                "attributes.suburb": platformSearchState.suburbFilter.map((item) => getCryptovoxelsKeySuburbFilter(item))
            }
        },
        {
            terms: {
                "attributes.island": platformSearchState.islandFilter.map((item) => getCryptovoxelsKeyIslandFilter(item))
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
                "attributes.type": platformSearchState.categoryFilter.map((item) => getSolanaTownKeyCategoryFilter(item))
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

const getDecentralandKeyCategoryFilter = (cat: DecentralandCategoryFilter) => {
    switch (cat) {
        case DecentralandCategoryFilter.Estate:
            return 'estate';
        case DecentralandCategoryFilter.Parcel:
            return 'parcel';
        default:
            throw new Error(`${cat} does not exist!`);
    }
}

const getCryptovoxelsKeyIslandFilter = (cat: CryptovoxelsIslandFilter) => {
    switch (cat) {
        case CryptovoxelsIslandFilter.OriginCity:
            return "Origin City";
        default:
            throw new Error(`${cat} does not exist!`);
    }
}

// Area 51
// Doom
// Axies
// Le Marais
// Little Tokyo
// Moon
// Rome
// Babylon
// Kitties
// West End
// Oasis
// Junkyard
// North Pole
// Scripting
// Midtown
// Te Aro
// Music District
// Shenzhen
// Hiro
// North Terrace
// Memes
// Deep South
// Makers
// The Center
// Fantasy Fields
// Punks
// Frankfurt
// Gangnam
const getCryptovoxelsKeySuburbFilter = (cat: CryptovoxelsSuburbFilter) => {
    switch (cat) {
        case CryptovoxelsSuburbFilter.TheCenter:
            return "The Center"
        case CryptovoxelsSuburbFilter.MusicDistrict:
            return "Music District"
        case CryptovoxelsSuburbFilter.LittleTokyo:
            return "Little Tokyo"
        case CryptovoxelsSuburbFilter.Makers:
            return "Makers"
        case CryptovoxelsSuburbFilter.Scripting:
            return "Scripting"
        case CryptovoxelsSuburbFilter.Hiro:
            return "Hiro"
        case CryptovoxelsSuburbFilter.NorthTerrace:
            return "North Terrace"
        case CryptovoxelsSuburbFilter.LeMarais:
            return "Le Marais"
        case CryptovoxelsSuburbFilter.Doom:
            return "Doom"
        case CryptovoxelsSuburbFilter.Frankfurt:
            return "Frankfurt"
        case CryptovoxelsSuburbFilter.Kitties:
            return "Kitties"
        case CryptovoxelsSuburbFilter.FantasyFields:
            return "Fantasy Fields"
        default:
            throw new Error(`${cat} does not exist!`);
    }
}

const getSolanaTownKeyCategoryFilter = (cat: SolanaTownCategoryFilter) => {
    switch (cat) {
        case SolanaTownCategoryFilter.Residential:
            return "residential"
        default:
            throw new Error(`${cat} does not exist!`);
    }
}