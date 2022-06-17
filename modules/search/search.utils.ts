import { CategoryFilter, SaleFilter } from "../../components/search/search.types";
import { SearchDto } from "../../pages/api/search/search.types";
import { SearchState } from "./search-slice";

export const buildSearchDtoFromState = (state: SearchState): SearchDto => {
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

    switch (state.saleFilter) {
        case SaleFilter.OnSale:
            must.push({
                "exists": {
                    "field": "active_order"
                }
            })
            break;
        case SaleFilter.NotOnSale:
            must_not.push({
                "exists": {
                    "field": "active_order"
                }
            })
            break;
        case SaleFilter.All:
        default:
            break;
    }

    if (state.categoryFilter) {
        should = should.concat(state.categoryFilter.map((item) => ({
            match: {
                category: getKeyCategoryFilter(item)
            }
        })))
    } else {
        should = should.concat(Object.values(CategoryFilter).map((item) => ({
            match: {
                category: getKeyCategoryFilter(item)
            }
        })))
    }

    if (state.priceMinFilter || state.priceMaxFilter) {
        const range = {
            "active_order.price": {
            }
        }

        if (state.priceMinFilter) {
            range["active_order.price"] = {
                gte: state.priceMinFilter
            }
        }

        if (state.priceMaxFilter) {
            range["active_order.price"] = {
                ...range["active_order.price"],
                lte: state.priceMaxFilter
            }
        }

        must.push({ range: range })
    }

    // if (state.priceMinFilter || state.priceMaxFilter) {
    //     const minCond = state.priceMinFilter ? "doc['active_order.price'].value >= params.min" : ""
    //     const maxCond = state.priceMaxFilter ? "doc['active_order.price'].value <= params.max" : ""
    //     const cond = minCond + (state.priceMinFilter && state.priceMaxFilter ? " && " : "") + maxCond
    //     filter = {
    //         script: {
    //             script: {
    //                 source: cond,
    //                 params: {
    //                     min: state.priceMinFilter,
    //                     max: state.priceMaxFilter
    //                 }
    //             }
    //         }
    //     }
    // }

    // build query
    const query = {
        bool: {
            should: should,
            must: must,
            must_not: must_not,
        }
    }

    // build searchDto
    const searchDto = {
        indices: state.indices,
        query: query,
        page: state.page,
        pageSize: state.pageSize
    }

    return searchDto;
}

const getKeyCategoryFilter = (cat: CategoryFilter) => {
    switch (cat) {
        case CategoryFilter.Estate:
            return 'estate';
        case CategoryFilter.Parcel:
            return 'parcel';
        default:
            throw new Error(`${cat} does not exist!`);
    }
}