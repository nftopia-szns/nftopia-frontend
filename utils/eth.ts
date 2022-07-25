import truncateEthAddress from "truncate-eth-address";

export const shortenAddress = truncateEthAddress

export const switchEthereumChainId = (desiredChainId) => {
    let chainParam: object

    switch (desiredChainId) {
        case 1:
            chainParam = {
                chainId: '0x38',
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                chainName: 'Smart Chain',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18,
                },
                blockExplorerUrls: ['https://bscscan.com'],
            }
            break
        case BINANCE_TESTNET_CHAIN_ID:
            chainParam = {
                chainId: '0x61',
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                chainName: 'Smart Chain - Testnet',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18,
                },
                blockExplorerUrls: ['https://testnet.bscscan.com'],
            }
            break
        default:
            chainParam = {
                chainId: '0x61',
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                chainName: 'Smart Chain - Testnet',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18,
                },
                blockExplorerUrls: ['https://testnet.bscscan.com'],
            }
            break
    }

    ;(window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainParam],
    })
}