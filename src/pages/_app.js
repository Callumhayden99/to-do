import { SessionProvider } from "next-auth/react";
import "../app/globals.css"
export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
   <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
   </SessionProvider>
  );
}