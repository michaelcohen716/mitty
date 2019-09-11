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
          <input
            value={privateKey}
            onChange={e => setPrivateKey(e.target.value)}
            className="no-background-input mb-3"
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
