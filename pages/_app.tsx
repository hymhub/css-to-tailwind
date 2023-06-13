import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import useDomHeightWatcher from '@/hooks/useDomHeightWatcher'
import 'simplebar-react/dist/simplebar.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'tailwindcss/tailwind.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  useDomHeightWatcher()
  return (
    <>
      <Head>
        <title>Css To Tailwind</title>
        <meta name="description" content="Css To Tailwind" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/css-to-tailwind/favicon.ico" />
      </Head>
      <main>
        <Component {...pageProps} />
        <ToastContainer />
      </main>
    </>
  )
}
