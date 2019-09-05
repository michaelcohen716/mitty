import React, { useState } from "react";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Deposit from "./components/Deposit/Deposit";
import "./App.css";
import useWindowDimensions from "./hooks/useWindowDimensions";
import paymentLogo from "./assets/payment-icon.png";
import {
  _getAccountFromPrivateKey,
  _getMainnetERC20Balance
} from "./services/web3";
import { _getMaticERC20Balance } from "./services/matic";

const tabs = ["Home", "Deposit", "Transfer", "Withdraw"];

/* 
Noun Project Credits
- payment By Sergey Demushkin, RU   
*/

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
        return <div>Transfer</div>;
      }
      case tabs[3]: {
        return <div>Withdraw</div>;
      }
    }
  };

  const receivePrivateKey = async() => {
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
        minHeight: height,
        maxHeight: height
      }}
    >
      <div className="d-flex flex-column">
        <div className="header d-flex ml-4 py-2">
          <img src={paymentLogo} className="img-fluid payment-logo my-auto" />
          <div className="mt-3 ml-2">Mitty</div>
        </div>
        <div className="main-body">{getView()}</div>
      </div>
      <Nav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
