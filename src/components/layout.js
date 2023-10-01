import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import style from "@/styles/layout.module.css";
import { useMediaQuery } from "@/lib/custom-hooks";

export default function Layout({ children }) {
  let isPageWide = useMediaQuery("(min-width: 600px)");
  return (
    <>
      <Head>
        <title>Yu-Jeng & ShaoHui&apos; Day</title>
        <meta
          name="description"
          content="An digital wedding guestbook for Yu-Jeng & ShaoHui's wedding receptions"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className={style.bodyContainer}>
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
      </div>
    </>
  );
}
