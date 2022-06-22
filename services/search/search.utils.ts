import { DecentralandCategoryFilter, DecentralandSaleFilter, DecentralandSortByCriterias, MetaversePlatform } from "../../components/search/search.types";
import { SearchDto } from "../../pages/api/search/search.types";
import { SearchState } from "./search-slice";

export const buildSearchDtoFromState = (state: SearchState): SearchDto => {
    switch (state.platform) {
        case MetaversePlatform.Decentraland:
            return _buildDecentralandSearchDtoFromState(state)
        case MetaversePlatform.SandBox:
            // TODO:
            return null;
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

    const platformSearchState = state.platformSearchState

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

    if (platformSearchState.categoryFilter) {
        should = should.concat(platformSearchState.categoryFilter.map((item) => ({
            match: {
                category: getKeyCategoryFilter(item)
            }
        })))
    } else {
        should = should.concat(Object.values(DecentralandCategoryFilter).map((item) => ({
            match: {
                category: getKeyCategoryFilter(item)
            }
        })))
    }

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

const getKeyCategoryFilter = (cat: DecentralandCategoryFilter) => {
    switch (cat) {
        case DecentralandCategoryFilter.Estate:
            return 'estate';
        case DecentralandCategoryFilter.Parcel:
            return 'parcel';
        default:
            throw new Error(`${cat} does not exist!`);
    }
}