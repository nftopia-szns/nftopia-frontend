import { DecentralandSearchHitDto, SearchDto, SearchHitDto } from "../../pages/api/search/search.types";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"
import { ChainId, EthereumNetwork } from "nftopia-shared/dist/shared/network";

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

    // build index
    const index = `${MetaversePlatform.Decentraland}-${ChainId.Ethereum}-${EthereumNetwork.Mainnet}`

    return {
        indices: [index],
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

    // build index
    const index = `${MetaversePlatform.SandBox}-${ChainId.Ethereum}-${EthereumNetwork.Mainnet}`

    return {
        indices: [index],
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


    // build index
    const index = `${MetaversePlatform.SolanaTown}-${ChainId.Solana}-${EthereumNetwork.Mainnet}`

    return {
        indices: [index],
        query: query,
        pageSize: 100,
    }
}

const getCoordinateOfAsset = (asset: SearchHitDto<object>) => {

}