import { DecentralandSearchHitDto, SearchDto, SearchHitDto } from "../../pages/api/search/search.types";
import { MetaversePlatform } from "../search/search.types";

export const buildSearchNearbyAssets = (platform, assetDetail): SearchDto => {
    switch (platform) {
        case MetaversePlatform.Decentraland:
            return _buildDecentralandSearchNearbyAssets(assetDetail)
        case MetaversePlatform.SandBox:
            return _buildTheSandboxSearchNearbyAssets(assetDetail)
        case MetaversePlatform.Cryptovoxels:
            return null // TODO: find a way to support cryptovoxels
        case MetaversePlatform.SolanaTown:
            return _buildSolanaTownSearchNearbyAssets(assetDetail)
        default:
            return null
    }
}

const _buildDecentralandSearchNearbyAssets = (assetDetail: DecentralandSearchHitDto): SearchDto => {
    if (assetDetail["category"] === "estate") {
        // TODO: find a way to support nearby assets for estate
        return null
    }

    const { x, y } = assetDetail.attributes

    const lowerboundX = x - 5
    const upperboundX = x + 5
    const lowerboundY = y - 5
    const upperboundY = y + 5

    const must = [
        {
            range: {
                "attributes.x": {
                    gte: lowerboundX,
                    lte: upperboundX,
                }
            }
        },
        {
            range: {
                "attributes.y": {
                    gte: lowerboundY,
                    lte: upperboundY,
                }
            }
        }
    ]

    const query = {
        bool: {
            must: must
        }
    }

    return {
        indices: ["decentraland-ethereum-1"],
        query: query,
        pageSize: 100,
    }
}

const _buildTheSandboxSearchNearbyAssets = (assetDetail: DecentralandSearchHitDto): SearchDto => {
    const { x, y } = assetDetail.attributes

    const lowerboundX = x - 5
    const upperboundX = x + 5
    const lowerboundY = y - 5
    const upperboundY = y + 5

    const must = [
        {
            range: {
                "attributes.x": {
                    gte: lowerboundX,
                    lte: upperboundX,
                }
            }
        },
        {
            range: {
                "attributes.y": {
                    gte: lowerboundY,
                    lte: upperboundY,
                }
            }
        }
    ]

    const query = {
        bool: {
            must: must
        }
    }

    return {
        indices: ["sandbox-ethereum-1"],
        query: query,
        pageSize: 100,
    }
}

const _buildSolanaTownSearchNearbyAssets = (assetDetail: DecentralandSearchHitDto): SearchDto => {
    const { x, y } = assetDetail.attributes

    const lowerboundX = x - 5
    const upperboundX = x + 5
    const lowerboundY = y - 5
    const upperboundY = y + 5

    const must = [
        {
            range: {
                "attributes.x": {
                    gte: lowerboundX,
                    lte: upperboundX,
                }
            }
        },
        {
            range: {
                "attributes.y": {
                    gte: lowerboundY,
                    lte: upperboundY,
                }
            }
        }
    ]

    const query = {
        bool: {
            must: must
        }
    }

    return {
        indices: ["solanatown-solana-1"],
        query: query,
        pageSize: 100,
    }
}

const getCoordinateOfAsset = (asset: SearchHitDto<object>) => {

}