import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import './App.css';
import PKToken from './contracts/PKToken.json';
import LoadingSpinner from './components/LoadingSpinner';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Pages/Home';

type ContractNetworks = {
  [key: string]: {
    address: string;
  }
}

const initContract = async (web3: Web3, setPK: React.Dispatch<React.SetStateAction<Contract | undefined>>) => {
  const networkID = (await web3.eth.net.getId()).toString();
  const contractAddress = (PKToken.networks as ContractNetworks)[networkID].address;
  const contractABI = PKToken.abi as AbiItem[];
  setPK(new web3.eth.Contract(contractABI, contractAddress));
}

const initAccounts = async (web3: Web3, setAccounts: React.Dispatch<React.SetStateAction<string[]>>) => {
  setAccounts(await web3.eth.getAccounts());
}

const App = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [web3] = useState(new Web3(Web3.givenProvider || 'http://localhost:8545'));
  const [PK, setPK] = useState<Contract>();

  useEffect(() => {
    initAccounts(web3, setAccounts);
    initContract(web3, setPK);
  }, [web3]);

  if (PK === undefined) {
    return <LoadingSpinner />
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home {...{ accounts, PK }} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
