export const parameterizedRouter = {
    asset: {
        decentraland: {
            detail: (id) => {
                return `/asset/decentraland/${id}`
            },
            buy: (id) => {
                return `/asset/decentraland/${id}/buy`
            }
        }
    }
}