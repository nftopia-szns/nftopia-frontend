export const parameterizedRouter = {
    asset: {
        decentraland: {
            detail: (id) => {
                return `/asset/decentraland/${id}`
            },
            buy: (id) => {
                return `/asset/decentraland/${id}/buy`
            },
            bid: (id) => {
                return `/asset/decentraland/${id}/bid`
            },
            sell: (id) => {
                return `/asset/decentraland/${id}/sell`
            },
            // bid: (id) => {
            //     return `/asset/decentraland/${id}/bid`
            // },
        }
    }
}