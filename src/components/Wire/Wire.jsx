import React, { useState } from "react";
import Balances from "../common/Balances";
import Iframe from "react-iframe";

function Wire({ mainnetERC20Balance, maticERC20Balance, address }) {
    console.log("address", address)
  return (
    <div className="d-flex flex-column deposit justify-content-start">
      <div className="headline mb-3">Wire Funds to Ethereum</div>
      <Iframe
        url={`https://buy-staging.moonpay.io?apiKey=pk_test_U3wU9qqx87F9EbTVKEnLIIWrhtkeekT&currencyCode=eth&walletAddress=${address}`}
        width="100%"
        height="300px"
      />
    </div>
  );
}

export default Wire;
