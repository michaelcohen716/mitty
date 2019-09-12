import React, { useState, useEffect } from "react";
import SubmitButton from "../common/SubmitButton";
import Balances from "../common/Balances";
import MiniLoading from "../common/MiniLoading";
import ViewHolder from "../common/ViewHolder";
import GeneralInput from "../common/GeneralInput";
import Countdown from "./Countdown";
import {
  _depositERC20,
  _startWithdrawERC20,
  _continueWithdrawERC0,
  _processERC20Exit,
  _transferERC20
} from "../../services/matic";
import "./Deposit.css";

function Deposit({
  privateKey,
  pollMaticBalance,
  mainnetERC20Balance,
  maticERC20Balance,
  getMainnetERC20Balance,
  address
}) {
  const [amount, setAmount] = useState("");
  const [txProcessing, toggleTxProcessing] = useState(false);
  const [txSuccess, toggleTxSuccess] = useState(false);

  const [startWithdrawTxHash, setStartWithdrawTxHash] = useState("");

  const WITHDRAW_STAGES = ["Start", "Waiting", "Continue", "Exit", "Confirmed"];
  const [withdrawStage, setWithdrawStage] = useState(WITHDRAW_STAGES[0]);
  const [withdrawTimeRemaining, setWithdrawTimeRemaining] = useState(5 * 60);

  const depositERC20 = async () => {
    toggleTxProcessing(true);

    const depositAmount = amount * 10 ** 18;
    const retVal = await _depositERC20(privateKey, String(depositAmount));
    console.log("deposit return value", retVal);

    await getMainnetERC20Balance(address);
    pollMaticBalance();
    runTxCompletion();
  };

  const startWithdrawERC20 = async () => {
    // toggleTxProcessing(true);

    const withdrawAmount = amount * 10 ** 18;
    const retVal = await _startWithdrawERC20(
      privateKey,
      String(withdrawAmount)
    );
    setStartWithdrawTxHash(retVal.transactionHash);

    pollMaticBalance();
    setWithdrawStage(WITHDRAW_STAGES[1]);
    setTimeout(() => {
      setWithdrawStage(WITHDRAW_STAGES[2]);
    }, 1200 * 60 * 5); // adding a bit of extra time > 5 min to ensure existence of block header
  };

  const continueWithdrawERC20 = async () => {
    const retVal = await _continueWithdrawERC0(privateKey, startWithdrawTxHash);
    console.log("continue withdraw retval", retVal);
    setWithdrawStage(WITHDRAW_STAGES[3]);
  };

  const processExit = async () => {
    const exit = await _processERC20Exit(privateKey);
    console.log("exit", exit);
    setWithdrawStage(WITHDRAW_STAGES[4]);
  };

  const runTxCompletion = () => {
    toggleTxSuccess(true);
    setInterval(() => {
      toggleTxSuccess(false);
    }, 3000);
    toggleTxProcessing(false);
  };

  const isDepositDisabled = () => {
    if (Number(amount) > mainnetERC20Balance / 10 ** 18) {
      return true;
    } else if (isNaN(amount)) {
      return true;
    } else if (!amount) {
      return true;
    } else {
      return false;
    }
  };

  const isWithdrawDisabled = () => {
    if (Number(amount) > maticERC20Balance / 10 ** 18) {
      return true;
    } else if (isNaN(amount)) {
      return true;
    } else if (!amount) {
      return true;
    } else {
      return false;
    }
  };

  const states = ["Deposit Funds from Ethereum", "Withdraw Funds to Ethereum"];
  const [activeState, setActiveState] = useState(states[0]);

  const isDepositState = () => activeState === states[0];

  const getWithdrawView = () => {
    switch (withdrawStage) {
      case WITHDRAW_STAGES[0]: {
        return (
          <SubmitButton
            onClick={startWithdrawERC20}
            disabled={isWithdrawDisabled()}
            className="mt-1 mb-4"
            text="Submit"
          />
        );
      }
      case WITHDRAW_STAGES[1]: {
        return <Countdown />;
      }
      case WITHDRAW_STAGES[2]: {
        return (
          <SubmitButton
            className="mt-1 mb-4"
            text="Withdraw"
            onClick={continueWithdrawERC20}
          />
        );
      }
      case WITHDRAW_STAGES[3]: {
        return (
          <SubmitButton
            className="mt-1 mb-4"
            text="Confirm"
            onClick={processExit}
          />
        );
      }
      case WITHDRAW_STAGES[4]: {
        return (
          <div className="mt-4 success-text">
            Your balance should be reflected soon
          </div>
        );
      }
    }
  };

  return (
    <ViewHolder headlineText={isDepositState() ? states[0] : states[1]}>
      <div className="position-relative">
        <div
          className="option-text position-absolute"
          onClick={
            isDepositState()
              ? () => setActiveState(states[1])
              : () => setActiveState(states[0])
          }
        >
          {isDepositState() ? "Withdraw" : "Deposit"}
        </div>
      </div>
      <div className="d-flex flex-column mt-3">
        <Balances
          maticERC20Balance={maticERC20Balance}
          mainnetERC20Balance={mainnetERC20Balance}
        />
        <div className="mt-4 headline">
          How much Dai would you like to{" "}
          {isDepositState() ? "deposit to Matic?" : "withdraw to Ethereum"}
        </div>
        <GeneralInput
          amount={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={isDepositState() ? "Deposit Amount" : "Withdraw Amount"}
        />
        {txProcessing ? (
          <MiniLoading />
        ) : txSuccess ? (
          <div className="mt-3 success-text">Transaction Successful!</div>
        ) : (
          <div className="pb-5 mb-5">
            {isDepositState() ? (
              <SubmitButton
                onClick={depositERC20}
                // onClick={isDepositState() ? depositERC20 : startWithdrawERC20}
                disabled={isDepositDisabled()}
                className="mt-1 mb-4"
                text="Submit"
              />
            ) : (
              getWithdrawView()
            )}
          </div>
        )}
      </div>
    </ViewHolder>
  );
}

export default Deposit;
