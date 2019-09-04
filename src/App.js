import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Deposit from "./components/Deposit";
import "./App.css";
import useWindowDimensions from "./hooks/useWindowDimensions";
import paymentLogo from "./assets/payment-icon.png";

const tabs = ["Home", "Deposit", "Withdraw"];

/* 
- payment By Sergey Demushkin, RU   
*/

function App() {
  const { height, width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div
      className="App d-flex flex-column justify-content-between"
      style={{
        maxWidth: "450px",
        width: width
      }}
    >
      <div className="d-flex flex-column">
        <div className="header d-flex ml-4 py-2">
          <img src={paymentLogo} className="img-fluid payment-logo my-auto" />
          <div className="mt-3 ml-2">Mitty</div>
        </div>
        <div className="main-body">
          <Deposit />
        </div>
      </div>
      <Nav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
