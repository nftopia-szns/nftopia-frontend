export enum MetaversePlatform {
    Decentraland = 'decentraland',
    SandBox = 'sandbox',
}

export enum DecentralandCategoryFilter {
    Estate = "Estate",
    Parcel = "Parcel",
}
export const DecentralandCategoryFilterOptions = Object.values(DecentralandCategoryFilter)

export enum DecentralandSaleFilter {
    All = "All",
    OnSale = "On Sale",
    NotOnSale = "Not On Sale",
}
export const DecentralandSaleFilterOptions: DecentralandSaleFilter[] = Object.values(DecentralandSaleFilter)

export enum DecentralandSortByCriterias {
    Price = 'price',
    RecentlyListed = 'recently-listed',
    RecentlyBought = 'recently-bought',
    TotalSales = 'total-sales'
}

export interface DecentralandSearchState {
    // sorts
    sortBy: DecentralandSortByCriterias;
    
    // filters
    categoryFilter: DecentralandCategoryFilter[]; // estate, parcel
    saleFilter: DecentralandSaleFilter; // on sale, not on sale, expired...
    priceMinFilter?: number;
    priceMaxFilter?: number;
    ownerFilter?: string;
}

export const InitialDecentralandSearchState: DecentralandSearchState = {
    sortBy: DecentralandSortByCriterias.Price,
    categoryFilter: [DecentralandCategoryFilter.Estate, DecentralandCategoryFilter.Parcel],
    saleFilter: DecentralandSaleFilter.All,
}

export enum SandBoxCategoryFilter {
    Estate = "Estate",
    Land = "Land"
}

export enum SandBoxLandTypeFilter {
    Regular = "Regular",
    Premium = "Premium"
}

export const SandBoxCategoryFilterOptions = Object.values(SandBoxCategoryFilter)
export const SandBoxLandTypeFilterOptions = Object.values(SandBoxLandTypeFilter)

export interface SandBoxSearchState {
    // sorts
    // TODO:
    // sortBy: DecentralandSortByCriterias

    // filters
    categoryFilter: SandBoxCategoryFilter[];
    landTypeFilter: SandBoxLandTypeFilter[];
    // TODO:
    // saleFilter: DecentralandSaleFilter; // on sale, not on sale, expired...
    // priceMinFilter?: number;
    // priceMaxFilter?: number;
    ownerFilter?: string;
}

export const InitialSandBoxSearchState: SandBoxSearchState = {
    categoryFilter: SandBoxCategoryFilterOptions,
    landTypeFilter: SandBoxLandTypeFilterOptions,
}