import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import { DecentralandAssetCategory, SolanaTownAssetType, TheSandBoxAssetCategory, TheSandBoxAssetType } from "nftopia-shared/dist/shared/asset"
import { CryptovoxelsAttributeIsland, CryptovoxelsAttributeSuburb } from "nftopia-shared/dist/shared/asset/cryptovoxels"

export const MetaversePlatformOptions = Object.values(MetaversePlatform)

export const DecentralandCategoryFilterOptions = Object.values(DecentralandAssetCategory)

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
    categoryFilter: DecentralandAssetCategory[]; // estate, parcel
    saleFilter: DecentralandSaleFilter; // on sale, not on sale, expired...
    priceMinFilter?: number;
    priceMaxFilter?: number;
    ownerFilter?: string;
}

export const InitialDecentralandSearchState: DecentralandSearchState = {
    sortBy: DecentralandSortByCriterias.Price,
    categoryFilter: DecentralandCategoryFilterOptions,
    saleFilter: DecentralandSaleFilter.All,
}

export const SandBoxCategoryFilterOptions = Object.values(TheSandBoxAssetCategory)
export const SandBoxLandTypeFilterOptions = Object.values(TheSandBoxAssetType)

export interface SandBoxSearchState {
    // sorts
    // TODO:
    // sortBy: DecentralandSortByCriterias

    // filters
    categoryFilter: TheSandBoxAssetCategory[];
    landTypeFilter: TheSandBoxAssetType[];
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

export const CryptovoxelsIslandFilterOptions = Object.values(CryptovoxelsAttributeIsland)
export const CryptovoxelsSuburbFilterOptions = Object.values(CryptovoxelsAttributeSuburb)

export interface CryptovoxelsSearchState {
    islandFilter: CryptovoxelsAttributeIsland[]
    suburbFilter: CryptovoxelsAttributeSuburb[]

    areaMinFilter?: number;
    areaMaxFilter?: number;
    heightMinFilter?: number;
    heightMaxFilter?: number;
}

export const InitialCryptovoxelsSearchState: CryptovoxelsSearchState = {
    islandFilter: CryptovoxelsIslandFilterOptions,
    suburbFilter: CryptovoxelsSuburbFilterOptions,
}

export const SolanaTownCategoryFilterOptions = Object.values(SolanaTownAssetType)

export interface SolanaTownSearchState {
    categoryFilter: SolanaTownAssetType[]
}

export const InitialSolanaTownSearchState: SolanaTownSearchState = {
    categoryFilter: SolanaTownCategoryFilterOptions,
}