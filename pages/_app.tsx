import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NFTopiaLayout from '../components/layout/NFTopiaLayout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NFTopiaLayout>
          <Component {...pageProps} />
    </NFTopiaLayout>
  )
}

export default MyApp
