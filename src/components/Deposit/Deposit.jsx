import React, { useState } from "react";
import SubmitButton from "../common/SubmitButton";
import Balances from "../common/Balances";
import MiniLoading from "../common/MiniLoading";
import ViewHolder from "../common/ViewHolder";
import GeneralInput from "../common/GeneralInput";
import { _depositERC20 } from "../../services/matic";
import "./Deposit.css";

function Deposit({
  privateKey,
  pollMaticBalance,
  mainnetERC20Balance,
  maticERC20Balance,
  getMainnetERC20Balance,
  address
}) {
  const [depositAmount, setDepositAmount] = useState("");
  const [txProcessing, toggleTxProcessing] = useState(false);
  const [txSuccess, toggleTxSuccess] = useState(false);

  const depositERC20 = async () => {
    toggleTxProcessing(true);

    const amount = depositAmount * 10 ** 18;
    const retVal = await _depositERC20(privateKey, String(amount));
    console.log("deposit return value", retVal);

    await getMainnetERC20Balance(address);
    pollMaticBalance();

    toggleTxSuccess(true);
    setInterval(() => {
      toggleTxSuccess(false);
    }, 3000);
    toggleTxProcessing(false);
  };

  const isDepositDisabled = () => {
    if (Number(depositAmount) > mainnetERC20Balance / 10 ** 18) {
      return true;
    } else if (isNaN(depositAmount)) {
      return true;
    } else if (!depositAmount) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ViewHolder headlineText="Deposit Funds from Ethereum">
      <div className="d-flex flex-column">
        <Balances
          maticERC20Balance={maticERC20Balance}
          mainnetERC20Balance={mainnetERC20Balance}
        />
        <div className="mt-4 headline">
          How much Dai would you like to deposit to Matic?
        </div>
        <GeneralInput
          amount={depositAmount}
          onChange={e => setDepositAmount(e.target.value)}
          placeholder="Deposit Amount"
        />
        {txProcessing ? (
          <MiniLoading />
        ) : txSuccess ? (
          <div className="mt-3 success-text">Transaction Successful!</div>
        ) : (
          <div className="pb-5 mb-5">
            <SubmitButton
              onClick={depositERC20}
              disabled={isDepositDisabled()}
              className="mt-1 mb-4"
              text="Submit"
            />
          </div>
        )}
      </div>
    </ViewHolder>
  );
}

export default Deposit;