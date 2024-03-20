import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <iframe 
        src="https://beepzilla.github.io/deckguide/" 
        style={{ width: "100vw", height: "100vh", border: "none" }}
        title="Your Webpage"
      />
    </div>
  );
};

export default Home;
