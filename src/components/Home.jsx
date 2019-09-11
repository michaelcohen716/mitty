import React from "react";
import SubmitButton from "./common/SubmitButton";
import Balances from "./common/Balances";
import ViewHolder from "./common/ViewHolder";
import "./Home.css";

function Home({
  accountLoaded,
  privateKey,
  setPrivateKey,
  receivePrivateKey,
  mainnetERC20Balance,
  maticERC20Balance
}) {
  return (
    <ViewHolder headlineText="Home">
      {!accountLoaded ? (
        <div className="d-flex flex-column">
          <div className="home-text pr-5">
            Mitty is the Matic app for remittances: <br />
            <div className="mt-2 ml-4">
              <div className="">
                Deposit Dai
              </div>
              <div className="mt-2">
                Transfer Instantly
              </div>
              <div className="mt-2">
                Buy ETH with Moonpay
              </div>
              <div className="mt-2">Exchange with Uniswap</div>
              <div className="mt-2">Keep the Crypto Flowing</div>
            </div>
            <div className="mt-4 enter-text">Enter your private key to get started!</div>
          </div>
          <input
            value={privateKey}
            onChange={e => setPrivateKey(e.target.value)}
            className="no-background-input mb-3 mt-3"
            placeholder="Enter private key"
          />
          <SubmitButton onClick={receivePrivateKey} />
        </div>
      ) : (
        <Balances
          maticERC20Balance={maticERC20Balance}
          mainnetERC20Balance={mainnetERC20Balance}
        />
      )}
    </ViewHolder>
  );
}

export default Home;
