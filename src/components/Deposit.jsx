import React, { useState, useEffect } from "react";
import SubmitButton from "./common/SubmitButton";
import MiniLoading from "./common/MiniLoading";

import {
  _getAccountFromPrivateKey,
  _getMainnetBalance,
  _getMainnetERC20Balance
} from "../services/web3";
import { _depositERC20, _getMaticERC20Balance } from "../services/matic";
import "./Deposit.css";

function Deposit() {
  const [privateKey, setPrivateKey] = useState(
    process.env.REACT_APP_TEST_PK1
  );
  const [address, setAddress] = useState("");
  //   const [privateKey, setPrivateKey] = useState("");
  const [accountLoaded, toggleAccountLoaded] = useState(false);

  const [mainnetERC20Balance, setMainnetERC20Balance] = useState(null);
  const [maticERC20Balance, setMaticERC20Balance] = useState(null);

  const [depositAmount, setDepositAmount] = useState("");
  const [txProcessing, toggleTxProcessing] = useState(false);

  const getAccountFromPrivateKey = async () => {
    const pk = privateKey;
    const account = await _getAccountFromPrivateKey(pk);
    setAddress(account.address);
    await getMainnetERC20Balance(account.address);
    await getMaticERC20Balance(pk);

    toggleAccountLoaded(true);
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

  const depositERC20 = async () => {
    toggleTxProcessing(true);

    const amount = depositAmount * 10 ** 18;
    const retVal = await _depositERC20(privateKey, String(amount));
    console.log("deposit return value", retVal);

    await getMainnetERC20Balance(address);
    pollMaticBalance();

    toggleTxProcessing(false);
  };

  const pollMaticBalance = async () => {
    setInterval(async () => {
      await getMaticERC20Balance(privateKey);
    }, 1000);
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

  console.log("isdepositdisable", isDepositDisabled());

  return (
    <div className="d-flex flex-column deposit justify-content-start">
      <div className="headline mb-3">Deposit Funds from Ethereum</div>
      {!accountLoaded ? (
        <div className="d-flex flex-column">
          <input
            value={privateKey}
            onChange={e => setPrivateKey(e.target.value)}
            className="no-background-input mb-3"
            placeholder="Enter private key"
          />
          <SubmitButton onClick={getAccountFromPrivateKey} />
        </div>
      ) : (
        <div className="d-flex flex-column mt-2">
          <div className="d-flex flex-column">
            <div className="balance-headline">Mainnet Bal</div>
            <div className="balance-value">
              {mainnetERC20Balance / 10 ** 18} Dai
            </div>
          </div>
          <div className="d-flex flex-column mt-2">
            <div className="balance-headline">Matic Bal</div>
            <div className="balance-value">
              {maticERC20Balance / 10 ** 18} Dai
            </div>
          </div>

          <div className="mt-4 headline">
            How much Dai would you like to deposit to Matic?
          </div>
          <input
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
            className="no-background-input my-3"
            placeholder="Deposit amount"
          />
          {txProcessing ? (
            <MiniLoading />
          ) : (
            <SubmitButton
              onClick={depositERC20}
              disabled={isDepositDisabled()}
              className="mt-1 mb-4"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Deposit;
