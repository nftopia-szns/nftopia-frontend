export const retrieveFromExternalUrl = (externalUrl: string) => {
    if (!externalUrl) {
        return {
            
        }
    }

    let match = externalUrl.matchAll(/(https:\/\/market.decentraland.org\/contracts\/)(?<contractAddress>\w+)(\/tokens\/)(?<tokenId>\w+)/g)
    let groups = match.next()?.value?.groups

    if (groups) {
        return groups
    } else return undefined
}