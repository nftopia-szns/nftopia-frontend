import { Web3Provider } from "@ethersproject/providers";

export interface EthereumBasedWallet {
    account: string,
    provider: Web3Provider,
    chainId: number,
}