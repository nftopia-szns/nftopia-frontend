export enum NFTCategory {
    PARCEL = "parcel",
    ESTATE = "estate",
    WEARABLE = "wearable",
    ENS = "ens",
    EMOTE = "emote"
}

export enum Network {
    ETHEREUM = "ethereum",
    MATIC = "matic"
}

export enum ChainId {
    ETHEREUM_MAINNET = 1,
    ETHEREUM_ROPSTEN = 3,
    ETHEREUM_RINKEBY = 4,
    ETHEREUM_GOERLI = 5,
    ETHEREUM_KOVAN = 42,
    MATIC_MAINNET = 137,
    MATIC_MUMBAI = 80001
}

export type NFT = {
    id: string;
    contractAddress: string;
    tokenId: string;
    activeOrderId: string | null;
    owner: string;
    name: string;
    category: NFTCategory;
    image: string;
    url: string;
    issuedId: string | null;
    itemId: string | null;
    data: {
        parcel?: {
            x: string;
            y: string;
            description: string | null;
            estate: {
                tokenId: string;
                name: string;
            } | null;
        };
        estate?: {
            size: number;
            parcels: {
                x: number;
                y: number;
            }[];
            description: string | null;
        };
        // wearable?: {
        //     description: string;
        //     category: WearableCategory;
        //     rarity: Rarity;
        //     bodyShapes: BodyShape[];
        //     isSmart: boolean;
        // };
        // ens?: {
        //     subdomain: string;
        // };
        // emote?: {
        //     description: string;
        //     category: EmoteCategory;
        //     rarity: Rarity;
        //     bodyShapes: BodyShape[];
        // };
    };
    network: Network;
    chainId: ChainId;
    createdAt: number;
    updatedAt: number;
    soldAt: number;
};