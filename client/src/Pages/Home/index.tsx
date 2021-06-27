import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import styles from './Home.module.scss';

import type { Contract } from 'web3-eth-contract';

type PropTypes = {
  accounts: string[];
  PK: Contract;
}

const Home = ({accounts, PK}: PropTypes) => {
  const [toAccount, setToAccount] = useState("");
  const [last100, setLast100] = useState<string[]>([]);

  const gee = () => {
    PK.methods.gee(toAccount).send({ from: accounts[0] });
  }

  const tokens = async () => {
    setLast100(await PK.methods.last100().call());
  }

  const ownersTokens = async () => {
    const tokens = await PK.methods.ownersTokens(toAccount).call();
    console.log(tokens);
  }

  useEffect(() => {
      tokens();
  }, []);

    console.log(last100);
  return (
    <div className={styles.Home}>
      <Nav accounts={accounts} />
      <div>
        <input onChange={e => setToAccount(e.target.value)} value={toAccount} placeholder="PK na" />
        <button onClick={gee}>Gee Poes Klap</button>
        <button onClick={tokens}>Last 100</button>
        <button onClick={ownersTokens}>Owners Tokens</button>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {last100.map(t => <span>{t}</span>)}
        </div>
      </div>
    </div>
  );
};

export default Home;
