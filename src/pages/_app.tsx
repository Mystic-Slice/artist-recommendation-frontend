import { GeistSans } from "geist/font/sans";
import { AppProps, type AppType } from "next/app";
import Layout from "~/components/custom/layout";
import { UserProvider } from "~/contexts/UserProvider";

import "~/styles/globals.css";
type ComponentWithNoSidebar = {
  noSidebar?: boolean;
};

function MyApp({ Component, pageProps }: AppProps & { Component: ComponentWithNoSidebar }) {
  return (
    <div className={GeistSans.className}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </div>
  );
};

export default MyApp;
