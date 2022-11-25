import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
