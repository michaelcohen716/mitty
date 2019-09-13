import React, { useState, useEffect } from "react";
import firebase from "firebase";
import SubmitButton from "../common/SubmitButton";
import Balances from "../common/Balances";
import MiniLoading from "../common/MiniLoading";
import ViewHolder from "../common/ViewHolder";
import GeneralInput from "../common/GeneralInput";
import WithdrawalItem from "./WithdrawalItem";
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
  const [withdrawalObjects, setWithdrawalObjects] = useState([]);
  const [exitTx, toggleExitTx] = useState(false);

  useEffect(() => {
    const getDB = async () => {
      await firebase
        .database()
        .ref(`/address/${address}/withdrawals`)
        .on("value", snapshot => {
          const val = snapshot.val();
          const props = val ? Object.getOwnPropertyNames(val) : [];
          const withdrawals = [];
          for (var i = 0; i < props.length; i++) {
            withdrawals.push(val[props[i]]);
          }

          setWithdrawalObjects(withdrawals);
        });
    };
    getDB();
  }, []);

  // Withdraw firebase functions
  const addWithdrawal = async txId => {
    const withdrawalObject = {
      state: "started",
      txId,
      amount,
      timestamp: Date.now() / 1000
    };
    firebase
      .database()
      .ref(`/address/${address}/withdrawals`)
      .push(withdrawalObject);

    firebase
      .database()
      .ref(`/address/${address}/withdrawalIds/${txId}`)
      .set({
        status: "started",
        timestamp: Date.now() / 1000
      });
  };

  const [amount, setAmount] = useState("");
  const [txProcessing, toggleTxProcessing] = useState(false);
  const [txSuccess, toggleTxSuccess] = useState(false);

  const [startWithdrawTxHash, setStartWithdrawTxHash] = useState("");

  const WITHDRAW_STAGES = ["Start", "Waiting", "Continue", "Exit", "Confirmed"];
  const [withdrawStage, setWithdrawStage] = useState(WITHDRAW_STAGES[0]);

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
    toggleTxProcessing(true);

    const withdrawAmount = amount * 10 ** 18;
    const retVal = await _startWithdrawERC20(
      privateKey,
      String(withdrawAmount)
    );
    setStartWithdrawTxHash(retVal.transactionHash);
    await addWithdrawal(retVal.transactionHash);

    setTimeout(() => {
      toggleTxProcessing(false);
    }, 5000);
  };

  const processExit = async () => {
    const exit = await _processERC20Exit(privateKey);
    console.log("exit", exit);
    toggleExitTx(true);
    setTimeout(() => {
      toggleExitTx(false);
    }, 4000);
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
          isDepositState() ? (
            <MiniLoading />
          ) : (
            <div className="my-2 success-text">
              You've started the withdrawal process <br />
              Check back in 90 minutes
            </div>
          )
        ) : txSuccess ? (
          <div className="mt-3 success-text">Transaction Successful!</div>
        ) : (
          <div className="pb-2">
            {isDepositState() ? (
              <SubmitButton
                onClick={depositERC20}
                disabled={isDepositDisabled()}
                className="mt-1 mb-4"
                text="Submit"
              />
            ) : txProcessing ? (
              <div className="mt-3 success-text">
                You've started the withdrawal process <br />
                Check back in 90 minutes
              </div>
            ) : (
              <SubmitButton
                onClick={startWithdrawERC20}
                disabled={isWithdrawDisabled()}
                className="mt-1 mb-4"
                text="Submit"
              />
            )}
          </div>
        )}
        {!isDepositState() && (
          <div className="d-flex flex-column">
            <div className="headline">Open Withdrawals</div>
            {withdrawalObjects.map((w, i) => {
              return (
                <WithdrawalItem
                  privateKey={privateKey}
                  address={address}
                  withdrawal={w}
                  key={i}
                />
              );
            })}
            <div className="headline mt-3">Exits</div>
            <div className="success-text mt-2">
              You may have some withdrawals ready for exit <br />
              Try exiting
            </div>
            {exitTx ? (
              <div className="success-text mt-3">Exit is processing...</div>
            ) : (
              <SubmitButton
                className="mt-3"
                onClick={processExit}
                text="Exit"
              />
            )}
          </div>
        )}
      </div>
    </ViewHolder>
  );
}

export default Deposit;
