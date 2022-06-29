export const parameterizedRouter = {
    asset: {
        decentraland: {
            detail: (index, id) => {
                return `/asset/decentraland/${index}/${id}`
            },
            buy: (index, id) => {
                return `/asset/decentraland/${index}/${id}/buy`
            },
            bid: (index, id) => {
                return `/asset/decentraland/${index}/${id}/bid`
            },
            sell: (index, id) => {
                return `/asset/decentraland/${index}/${id}/sell`
            },
            // bid: (id) => {
            //     return `/asset/decentraland/${id}/bid`
            // },
        },
        detail: (platform, index, assetId) => {
            return `/asset?platform=${platform}&index=${index}&assetId=${assetId}`
        }
    }
}