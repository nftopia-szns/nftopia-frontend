import { DecentralandAssetCategory, DecentralandAssetDto } from "nftopia-shared/dist/shared/asset";
import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform";

export const getHighlights = (asset: GenericAssetDto): string[] => {
    if (!asset) {
        return []
    }

    switch (asset.platform) {
        case MetaversePlatform.Decentraland:
            return _getDecentralandAssetHighlights(asset as DecentralandAssetDto)




        default:
            return [];
    }
}

const _getDecentralandAssetHighlights = (asset: DecentralandAssetDto): string[] => {
    const attributes = asset.attributes
    let highlights = []

    // category
    highlights.push(`category: ${attributes.category}`)

    if (attributes.category === DecentralandAssetCategory.Parcel) {
        // coordinate
        highlights.push(`coordinate: ${attributes.x},${attributes.y}`)
    } else {
        // estate size
        highlights.push(`estate size: ${attributes.estate_size}`)
    }

    // promixity

    // sales
    if (attributes.sales > 0) {
        highlights.push(`total sales: ${attributes.sales}`)
    }

    return highlights
}