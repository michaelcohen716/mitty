import React, { useState, useEffect } from "react";
import Balances from "../common/Balances";
import SubmitButton from "../common/SubmitButton";
import MiniLoading from "../common/MiniLoading";
import { _transferERC20 } from "../../services/matic";
import "./Transfer.css";

function Transfer({ maticERC20Balance, pollMaticBalance, privateKey }) {
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [txProcessing, toggleTxProcessing] = useState(false);
  const [txSuccess, toggleTxSuccess] = useState(false);

  const transfer = async () => {
    toggleTxProcessing(true);

    const amount = transferAmount * 10 ** 18;
    const retVal = await _transferERC20(privateKey, String(amount), recipient);
    console.log("deposit return value", retVal);

    pollMaticBalance();

    toggleTxSuccess(true);
    setInterval(() => {
      toggleTxSuccess(false);
    }, 3000);
    toggleTxProcessing(false);
  };

  const isTransferDisabled = () => {
    if (Number(transferAmount) > maticERC20Balance / 10 ** 18) {
      return true;
    } else if (isNaN(transferAmount)) {
      return true;
    } else if (!transferAmount) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="d-flex flex-column transfer justify-content-start">
      <div className="headline mb-3">Transfer Funds on Matic</div>
      <div className="d-flex flex-column">
        <Balances maticERC20Balance={maticERC20Balance} hideMainnet={true} />
        <input
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          className="no-background-input mt-3"
          placeholder="Recipient address"
        />
        <input
          value={transferAmount}
          onChange={e => setTransferAmount(e.target.value)}
          className="no-background-input mt-3"
          placeholder="Transfer amount"
        />
        {txProcessing ? (
          <div className="py-4">
            <MiniLoading />
          </div>
        ) : txSuccess ? (
          <div className="mt-3 success-text">Transaction Successful!</div>
        ) : (
          <SubmitButton
            onClick={transfer}
            disabled={isTransferDisabled()}
            className="mt-3"
          />
        )}
      </div>
    </div>
  );
}

export default Transfer;
