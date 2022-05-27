import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NFTopiaLayout from '../components/layout/NFTopiaLayout'
import { Web3ReactProvider } from '@web3-react/core'
import connectors from '../connectors'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <NFTopiaLayout>
        <Component {...pageProps} />
      </NFTopiaLayout>
    </Web3ReactProvider>
  )
}

export default MyApp
