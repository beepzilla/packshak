import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heroPage}>
        <div className={styles.heroSection}>
          <h1>Howdy!</h1>
          <p>Buy and open packs to collect OddPepes. Collect Common, Odd, Rare, Ultra Rare, and God cards. The more Rare the more Rewards.</p>
          <button 
            className={styles.heroButton}
            onClick={() => window.location.href = "/deckGuide"}
          >
            Deck Guide
          </button>
        </div>
        <div>
        </div>
      </div>
    </div> 
  );
};

export default Home;
