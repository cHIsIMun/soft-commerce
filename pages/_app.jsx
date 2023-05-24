import { SessionProvider } from "next-auth/react";
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/signup.css'


function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp;
