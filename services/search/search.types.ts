export enum MetaversePlatform {
    Decentraland = 'decentraland',
    SandBox = 'sandbox',
}

export enum DecentralandCategoryFilter {
    Estate = "Estate",
    Parcel = "Parcel",
}

export enum DecentralandSaleFilter {
    All = "All",
    OnSale = "On Sale",
    NotOnSale = "Not On Sale",
}

export enum DecentralandSortByCriterias {
    Price = 'price',
    RecentlyListed = 'recently-listed',
    RecentlyBought = 'recently-bought',
    TotalSales = 'total-sales'
}

export interface DecentralandSearchState {
    // sorts
    sortBy: DecentralandSortByCriterias
    
    // filters
    categoryFilter: DecentralandCategoryFilter[]; // estate, parcel
    saleFilter: DecentralandSaleFilter; // on sale, not on sale, expired...
    priceMinFilter?: number;
    priceMaxFilter?: number;
    ownerFilter?: string;
}

export enum SandBoxCategoryFilter {
    Estate = "Estate",
    Land = "Land"
}

export enum SandBoxLandTypeFilter {
    Regular = "Regular",
    Premium = "Premium"
}

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