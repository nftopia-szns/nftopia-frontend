import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NFTopiaLayout from '../components/layout/NFTopiaLayout'
import { Web3ReactProvider } from '@web3-react/core'
import { Provider as ReduxProvider } from 'react-redux'
import connectors from '../connectors'
import { store } from '../services/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <Web3ReactProvider connectors={connectors}>
        <NFTopiaLayout>
          <Component {...pageProps} />
        </NFTopiaLayout>
      </Web3ReactProvider>
    </ReduxProvider>
  )
}

export default MyApp
