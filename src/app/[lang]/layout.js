import { Inter } from "next/font/google";
import { cookies } from 'next/headers'
import COMMON from "@/components/common";
import { fetchAPI } from "./utils/api-handler";
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS

// import '../styles/globals.css';
import '@/styles/global.scss'
import Navbar from "@/components/commonSection/navbar";
import Footer from "@/components/commonSection/footer";
const inter = Inter({ subsets: ["latin"] });

async function getGlobal(lang) {
  const path = `/global`;
  const options = {};

  const urlParamsObject = {
    populate: [
      "favicon",
      "seo"
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function generateMetadata({ params: { lang } }) {
  const meta = await getGlobal(lang);
  if (!meta.data) return COMMON.FALLBACK_SEO;

  const { seo, favicon } = meta?.data?.attributes;
  const { url } = favicon?.data?.attributes;

  return {
    title: seo?.metaTitle,
    description: seo?.metaDesc,
    icons: {
      icon: url,
    },
  };
}
export async function getNavList(lang = "en") {
  const path = `/navbardata`;
  const urlParamsObject = {
    populate: "deep",
    locale: lang,
    pagination: {
      start: 0,
      limit: 10,
    },
  };
  const options = {};

  const response = await fetchAPI(path, urlParamsObject, options);

  console.log("respo", response);
  if (response?.data) {
    return response?.data;
  } else {
    return null;
  }

}
export default async function RootLayout({ children }) {
  const cookieStore = cookies()
  const localeLang = cookieStore.get('locale')?.value || "en";
  let navData = {};
  navData = await getNavList()
  return (
    <html lang={localeLang} dir={localeLang === `ar` ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <Navbar navData={navData} />

        {children}
        <Footer />

      </body>
    </html>
  );
}
