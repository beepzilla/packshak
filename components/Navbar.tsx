import React, { useState, useEffect } from 'react';
import { ConnectWallet, useAddress, useDisconnect, useSwitchChain, useNetworkMismatch, ChainId } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { FaBars } from 'react-icons/fa';

export default function Navbar() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const isWrongNetwork = useNetworkMismatch();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  useEffect(() => {
    if (isWrongNetwork && switchChain) {
      switchChain(ChainId.Polygon);
    }
  }, [isWrongNetwork, switchChain]);

  function disconnectWallet() {
    disconnect();
    setIsProfileDropdownOpen(false);
    setIsNavExpanded(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <FaBars className={styles.hamburger} onClick={() => setIsNavExpanded(!isNavExpanded)} />
          <Link href="/"><p>Home</p></Link>
        </div>
        <div className={`${styles.navLinks} ${isNavExpanded ? styles.active : ''}`}>
          <Link href="/shop"><p>Buy Packs</p></Link>
          <Link href="/myPacks"><p>Open Packs</p></Link>
          <Link href="/marketplace"><p>Buy Cards</p></Link>
          <Link href="/myCards"><p>My Cards</p></Link>
          <Link href="/staking"><p>Staking Portal</p></Link>
        </div>
        <div className={styles.navbarRight}>
          {!address ? (
            <ConnectWallet btnTitle="Login" theme="light" className={styles.connectWalletBtn} />
          ) : (
            <div onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <img src={`https://superspaces-prod.s3.eu-central-1.amazonaws.com/pfp/1481281/1688861476610.jpg`} alt="avatar" className={styles.avatar}/>
            </div>
          )}
        </div>
      </div>
      {isProfileDropdownOpen && (
        <div className={styles.profileDropdown}>
          <Link href="/shop"><p>Buy Packs</p></Link>
          <Link href="/myPacks"><p>Open Packs</p></Link>
          <Link href="/marketplace"><p>Buy Cards</p></Link>
          <Link href="/myCards"><p>My Cards</p></Link>
          <Link href="/staking"><p>Staking Portal</p></Link>
          <button onClick={disconnectWallet}>Logout</button>
        </div>
      )}
    </div>
  );
}
