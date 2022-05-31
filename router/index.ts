export const parameterizedRouter = {
    asset: {
        decentraland: (contractAddress, tokenId) => {
            return `/asset/decentraland/${contractAddress}/${tokenId}`
        }
    }
}