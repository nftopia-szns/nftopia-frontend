import { RootState } from "../store"

export const walletSelectorEthIsWalletConnected = (state: RootState) => {
    return true &&
        state.wallet.ethWallet &&
        state.wallet.ethWallet.account &&
        state.wallet.ethWallet.provider &&
        state.wallet.ethWallet.chainId
}

export const walletSelectorEthIsChainIdMatched = (state: RootState) => {
    return walletSelectorEthIsWalletConnected(state) && state.wallet.ethRequiredChainId ?
        state.wallet.ethWallet.chainId === state.wallet.ethRequiredChainId  : true
}