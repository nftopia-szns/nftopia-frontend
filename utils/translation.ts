import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import { DecentralandCategoryFilter, DecentralandSaleFilter, DecentralandSortByCriterias } from "../services/search/search.types"

export const t = (key: any) => {
    // if english
    // return ...
    return t_en(key)
}

export const t_en = (key: any) => {
    switch (key) {
        case MetaversePlatform.Decentraland:
            return "Decentraland"
        case MetaversePlatform.SandBox:
            return "The Sandbox"
        case MetaversePlatform.Cryptovoxels:
            return "Cryptovoxels"
        case MetaversePlatform.SolanaTown:
            return "SolanaTown"
        case DecentralandCategoryFilter.Estate:
            return "Estate"
        case DecentralandCategoryFilter.Parcel:
            return "Parcel"
        case DecentralandSaleFilter.All:
            return "All"
        case DecentralandSaleFilter.OnSale:
            return "On Sale"
        case DecentralandSaleFilter.NotOnSale:
            return "Not On Sale"
        case DecentralandSortByCriterias.Price:
            return "Price"
        case DecentralandSortByCriterias.RecentlyListed:
            return "Recently listed"
        case DecentralandSortByCriterias.RecentlyBought:
            return "Recently bought"
        case DecentralandSortByCriterias.TotalSales:
            return "Total sales"
        // case : 
        // return 
        default:
            return `${key}`
    }
}