export enum MetaversePlatform {
    Decentraland = 'MetaversePlatform.Decentraland',
    SandBox = 'MetaversePlatform.SandBox',
    Cryptovoxels = 'MetaversePlatform.Cryptovoxels',
}

export const MetaversePlatformOptions = Object.values(MetaversePlatform)

export enum DecentralandCategoryFilter {
    Estate = "DecentralandCategoryFilter.Estate",
    Parcel = "DecentralandCategoryFilter.Parcel",
}

export const DecentralandCategoryFilterOptions = Object.values(DecentralandCategoryFilter)

export enum DecentralandSaleFilter {
    All = "DecentralandSaleFilter.All",
    OnSale = "DecentralandSaleFilter.OnSale",
    NotOnSale = "DecentralandSaleFilter.NotOnSale",
}

export const DecentralandSaleFilterOptions = Object.values(DecentralandSaleFilter)

export enum DecentralandSortByCriterias {
    Price = 'DecentralandSortByCriterias.Price',
    RecentlyListed = 'DecentralandSortByCriterias.RecentlyListed',
    RecentlyBought = 'DecentralandSortByCriterias.RecentlyBought',
    TotalSales = 'DecentralandSortByCriterias.TotalSales'
}

export const DecentralandSortByCriteriasOptions = Object.values(DecentralandSortByCriterias)

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
    Estate = "SandBoxCategoryFilter.Estate",
    Land = "SandBoxCategoryFilter.Land"
}

export enum SandBoxLandTypeFilter {
    Regular = "SandBoxCategoryFilter.Regular",
    Premium = "SandBoxCategoryFilter.Premium"
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

export enum CryptovoxelsIslandFilter {
    OriginCity = "CryptovoxelsIslandFilter.OriginCity"
}

export enum CryptovoxelsSuburbFilter {
    TheCenter = "TheCenter",
    MusicDistrict = "MusicDistrict",
    LittleTokyo = "LittleTokyo",
    Makers = "Makers",
    Scripting = "Scripting",
    Hiro = "Hiro",
    NorthTerrace = "NorthTerrace",
    LeMarais = "LeMarais",
    Doom = "Doom",
    Frankfurt = "Frankfurt",
    Kitties = "Kitties",
    FantasyFields = "FantasyFields",
}

export const CryptovoxelsIslandFilterOptions = Object.values(CryptovoxelsIslandFilter)
export const CryptovoxelsSuburbFilterOptions = Object.values(CryptovoxelsSuburbFilter)

export interface CryptovoxelsSearchState {
    islandFilter: CryptovoxelsIslandFilter[]
    suburbFilter: CryptovoxelsSuburbFilter[]

    areaMinFilter?: number;
    areaMaxFilter?: number;
    heightMinFilter?: number;
    heightMaxFilter?: number;
}

export const InitialCryptovoxelsSearchState: CryptovoxelsSearchState = {
    islandFilter: CryptovoxelsIslandFilterOptions,
    suburbFilter: CryptovoxelsSuburbFilterOptions,
}