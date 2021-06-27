import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import './App.css';
import PKToken from './contracts/PKToken.json';

type ContractNetworks = {
  [key: string]: {
    address: string;
  }
}

function App() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [web3] = useState(new Web3(Web3.givenProvider || 'http://localhost:8545'));
  const [PK, setPK] = useState<Contract>();
  const [toAccount, setToAccount] = useState("");

  useEffect(() => {
    (async () => {
      setAccounts(await web3.eth.getAccounts());
      const networkID = (await web3.eth.net.getId()).toString();
      setPK(new web3.eth.Contract(PKToken.abi as AbiItem[], (PKToken.networks as ContractNetworks)[networkID].address));
    })()
  }, [web3]);

  const gee = () => {
    if (PK !== undefined) {
      PK.methods.gee(toAccount).send({ from: accounts[0] });
    }
  }

  const tokens = async () => {
    if (PK !== undefined) {
      const last100 = await PK.methods.last100().call();
      console.log(last100);
    }
  }

  const ownersTokens = async () => {
    if (PK !== undefined) {
      const tokens = await PK.methods.ownersTokens(toAccount).call();
      console.log(tokens);
    }
  }

  return (
    <div className="App">
      <div>
      <input onChange={e => setToAccount(e.target.value)} value={toAccount} placeholder="PK na" />
      <button onClick={gee}>Gee Poes Klap</button>
      <button onClick={tokens}>Last 100</button>
      <button onClick={ownersTokens}>Owners Tokens</button>
      </div>
    </div>
  );
}

export default App;
