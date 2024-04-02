import "@styles/globals.css";

import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MainContextProvider } from "@context/MainContext";

export const metadata = {
  title: "FindPrompts",
  description: "Discover, create & share AI prompts",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <MainContextProvider>
          <Provider>
            <Toaster position="top-center" />
            <div className="main">
              <div className="gardient" />
            </div>
            <main className="app">
              <Nav />
              {children}
            </main>
          </Provider>
        </MainContextProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
