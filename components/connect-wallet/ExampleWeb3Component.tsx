import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { Connector } from "@web3-react/types"
import { WalletConnect } from "@web3-react/walletconnect"
import { Network } from '@web3-react/network'

function getName(connector: Connector) {
    if (connector instanceof MetaMask) return 'MetaMask'
    if (connector instanceof WalletConnect) return 'WalletConnect'
    if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
    if (connector instanceof Network) return 'Network'
    return 'Unknown'
}

export default function Child() {
    const { connector } = useWeb3React()
    console.log(`Priority Connector is: ${getName(connector)}`)
    return null
}