import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import style from "../styles/layout.module.css";
import { useMediaQuery } from "@/lib/custom-hooks";

export default function Layout({ children }) {
  let isPageWide = useMediaQuery("(min-width: 600px)");
  return (
    <>
      <Head>
        <title>Interactive Marriage Advice Card</title>
        <meta
          name="description"
          content="An interactive website for the wedding guests sending their wishes and memories to the newlyweds"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <main>
        {isPageWide && (
          <>
            <div className={style.leftTitle}>YU-JENG & SHAOHUI</div>
            <div className={style.rightTitle}>
              CELEBRATING LOVE, LIFE, KIN/FRIENDSHIPS
            </div>
          </>
        )}
        <div className={style.pageLayout}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
