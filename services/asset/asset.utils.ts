import { SearchDto, SearchHitDto } from "../../pages/api/search/search.types";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import { EthereumChainId, Network } from "nftopia-shared/dist/shared/network";
import { DecentralandAssetDto, SolanaTownAssetDto, TheSandBoxAssetDto } from "nftopia-shared/dist/shared/asset";

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

const _buildDecentralandSearchNearbyAssets = (assetDetail: DecentralandAssetDto): SearchDto => {
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

    // build index
    const index = `${MetaversePlatform.Decentraland}-${Network.Ethereum}-${EthereumChainId.Mainnet}`

    return {
        indices: [index],
        query: query,
        pageSize: 100,
    }
}

const _buildTheSandboxSearchNearbyAssets = (assetDetail: TheSandBoxAssetDto): SearchDto => {
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

    // build index
    const index = `${MetaversePlatform.SandBox}-${Network.Ethereum}-${EthereumChainId.Mainnet}`

    return {
        indices: [index],
        query: query,
        pageSize: 100,
    }
}

const _buildSolanaTownSearchNearbyAssets = (assetDetail: SolanaTownAssetDto): SearchDto => {
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


    // build index
    const index = `${MetaversePlatform.SolanaTown}-${Network.Solana}-${EthereumChainId.Mainnet}`

    return {
        indices: [index],
        query: query,
        pageSize: 100,
    }
}

const getCoordinateOfAsset = (asset: SearchHitDto<object>) => {

}