import { SearchDto } from "../../pages/api/search/search.types";
import { SearchState } from "./search-slice";
import { DecentralandCategoryFilter, DecentralandSaleFilter, DecentralandSearchState, DecentralandSortByCriterias, MetaversePlatform, SandBoxCategoryFilter, SandBoxLandTypeFilter, SandBoxSearchState } from "./search.types";

export const buildSearchDtoFromState = (state: SearchState): SearchDto => {
    switch (state.platform) {
        case MetaversePlatform.Decentraland:
            return _buildDecentralandSearchDtoFromState(state)
        case MetaversePlatform.SandBox:
            return _buildSandBoxSearchDtoFromState(state);
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

    if (platformSearchState.priceMinFilter || platformSearchState.priceMaxFilter) {
        const range = {
            "active_order.price": {
            }
        }

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
                    "attributes.coordinate",
                    "owner"
                ]
            }
        })
    }

    const platformSearchState = state.platformSearchState as SandBoxSearchState

    must = must.concat(
        {
            terms: {
                category: platformSearchState.categoryFilter.map((item) => getSandBoxKeyCategoryFilter(item))
            }
        },
        {
            terms: {
                land_type: platformSearchState.landTypeFilter.map((item) => getSandBoxKeyLandTypeFilter(item))
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

    // build searchDto
    const searchDto = {
        // TODO: remove this hardcode
        indices: ['sandbox-ethereum-1'],
        query: query,
        sort: sort,
        page: state.page,
        pageSize: state.pageSize
    }

    return searchDto;
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

const getSandBoxKeyCategoryFilter = (cat: SandBoxCategoryFilter) => {
    switch (cat) {
        case SandBoxCategoryFilter.Estate:
            return 'estate';
        case SandBoxCategoryFilter.Land:
            return 'land';
        default:
            throw new Error(`${cat} does not exist!`);
    }
}

const getSandBoxKeyLandTypeFilter = (cat: SandBoxLandTypeFilter) => {
    switch (cat) {
        case SandBoxLandTypeFilter.Regular:
            return 'regular';
        case SandBoxLandTypeFilter.Premium:
            return 'premium';
        default:
            throw new Error(`${cat} does not exist!`);
    }
}