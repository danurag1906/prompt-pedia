import "@styles/globals.css";

import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Prompt-Hunt",
  description: "Discover, create & share AI prompts",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
