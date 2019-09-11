import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Deposit from "./components/Deposit/Deposit";
import Transfer from "./components/Transfer/Transfer";
import Wire from "./components/Wire/Wire";
import useWindowDimensions from "./hooks/useWindowDimensions";
import paymentLogo from "./assets/payment-icon.png";
import {
  _getAccountFromPrivateKey,
  _getMainnetERC20Balance
} from "./services/web3";
import { _getMaticERC20Balance } from "./services/matic";
import "./App.css";

const tabs = ["Home", "Deposit", "Transfer", "Wire"];

/* 
Noun Project Credits
- payment By Sergey Demushkin, RU   
*/

let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

// window.addEventListener('resize', () => {
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
// });

function App() {
  const { height, width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // const [privateKey, setPrivateKey] = useState("");
  const [privateKey, setPrivateKey] = useState(process.env.REACT_APP_TEST_PK1);
  const [accountLoaded, toggleAccountLoaded] = useState(false);
  const [address, setAddress] = useState("");

  const [mainnetERC20Balance, setMainnetERC20Balance] = useState(null);
  const [maticERC20Balance, setMaticERC20Balance] = useState(null);

  const getView = () => {
    switch (activeTab) {
      case tabs[0]: {
        return (
          <Home
            mainnetERC20Balance={mainnetERC20Balance}
            maticERC20Balance={maticERC20Balance}
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            receivePrivateKey={receivePrivateKey}
            accountLoaded={accountLoaded}
          />
        );
      }
      case tabs[1]: {
        return (
          <Deposit
            mainnetERC20Balance={mainnetERC20Balance}
            maticERC20Balance={maticERC20Balance}
            privateKey={privateKey}
            pollMaticBalance={pollMaticBalance}
            getMainnetERC20Balance={getMainnetERC20Balance}
            address={address}
          />
        );
      }
      case tabs[2]: {
        return (
          <Transfer
            privateKey={privateKey}
            maticERC20Balance={maticERC20Balance}
            mainnetERC20Balance={mainnetERC20Balance}
            pollMaticBalance={pollMaticBalance}
          />
        );
      }
      case tabs[3]: {
        return (
          <Wire
            maticERC20Balance={maticERC20Balance}
            mainnetERC20Balance={mainnetERC20Balance}
            address={address}
          />
        );
      }
    }
  };

  const receivePrivateKey = async () => {
    const account = await _getAccountFromPrivateKey(privateKey);
    setAddress(account.address);
    await getMainnetERC20Balance(account.address);
    await getMaticERC20Balance(privateKey);
    toggleAccountLoaded(true);
  };

  const pollMaticBalance = async () => {
    setInterval(async () => {
      await getMaticERC20Balance(privateKey);
    }, 1000);
  };

  const getMainnetERC20Balance = async address => {
    const mainnetTokenAddr = "0x70459e550254b9d3520a56ee95b78ee4f2dbd846"; //rops
    const bal = await _getMainnetERC20Balance(mainnetTokenAddr, address);
    setMainnetERC20Balance(bal);
  };

  const getMaticERC20Balance = async pk => {
    const bal = await _getMaticERC20Balance(pk);
    setMaticERC20Balance(bal);
  };

  return (
    <div
      className="App d-flex flex-column justify-content-between"
      style={{
        maxWidth: "414px",
        width,
        height
      }}
    >
      <div className="header d-flex">
        <img
          src={paymentLogo}
          className="img-fluid payment-logo my-auto ml-4"
        />
        <div className="my-auto ml-2">Mitty</div>
      </div>
      {getView()}
      <Nav
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        address={address}
      />
    </div>
  );
}

export default App;
