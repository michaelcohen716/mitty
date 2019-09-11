import React, { useState, useEffect } from "react";
import Balances from "../common/Balances";
import ViewHolder from "../common/ViewHolder";
import GeneralInput from "../common/GeneralInput";
import SubmitButton from "../common/SubmitButton";
import MiniLoading from "../common/MiniLoading";
import Iframe from "react-iframe";
import {
  _getMainnetETHBalance,
  web3RopstenProvider
} from "../../services/web3";
import {
  createTokenExchange,
  getTokenCount,
  getToken,
  addLiquidity,
  ethForTestToken,
  getEthToTokenInputPrice
} from "../../services/uniswap";
import {
  tradeExactEthForTokens,
  getExecutionDetails,
  getTokenReserves
} from "@uniswap/sdk";
import "./Wire.css";

function Wire({ mainnetERC20Balance, maticERC20Balance, address }) {
  const [mainnetETHBalance, setMainnetETHBalance] = useState("");
  const [exchangeAmount, setExchangeAmount] = useState("");

  const [txProcessing, toggleTxProcessing] = useState(false);
  const [txSuccess, toggleTxSuccess] = useState(false);

  useEffect(() => {
    const getMainnetEthBalance = async () => {
      const bal = await _getMainnetETHBalance(address);
      console.log("mainnet eth bal", bal);
      setMainnetETHBalance(bal);

      await getEthToTokenInputPrice(0.02)

      // await getTokenCount();
      // await getToken();
      // const reserves = await getTokenReserves(
      //   "0x70459e550254b9d3520a56ee95b78ee4f2dbd846"
      // );
      // console.log("Reserves", reserves);
    };
    getMainnetEthBalance();
  }, []);

  const exchangeWithUniswap = async () => {
    const amount = exchangeAmount;
    const retVal = await ethForTestToken(amount);
    console.log("Retval", retVal);
  };

  const isExchangeDisabled = () => {
    if (Number(exchangeAmount) > mainnetETHBalance) {
      return true;
    } else if (isNaN(exchangeAmount)) {
      return true;
    } else if (!exchangeAmount) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ViewHolder headlineText="Wire Funds to Ethereum">
      <div className="moonpay-note mb-3">
        Note: The Moonpay test environment doesn't support Dai, so we'll need to
        buy ETH with Moonpay and exchange for Dai on Uniswap below
      </div>

      <Balances
        maticERC20Balance={maticERC20Balance}
        mainnetERC20Balance={mainnetERC20Balance}
      />

      <div className="wire-subheader my-3">Buy with Moonpay</div>

      <Iframe
        url={`https://buy-staging.moonpay.io?apiKey=pk_test_U3wU9qqx87F9EbTVKEnLIIWrhtkeekT&currencyCode=eth&walletAddress=${address}`}
        width="100%"
        height="300px"
      />

      <div className="wire-subheader mt-4 mb-2">Exchange with Uniswap</div>
      <div className="mt-2">
        <div className="balance-headline">Mainnet ETH Bal</div>
        <div className="balance-value">{mainnetETHBalance.slice(0, 4)} ETH</div>
      </div>

      <GeneralInput
        amount={exchangeAmount}
        onChange={e => setExchangeAmount(e.target.value)}
        placeholder="Amount to Exchange"
      />
      {txProcessing ? (
        <MiniLoading />
      ) : (
        <SubmitButton
          onClick={exchangeWithUniswap}
          className="mt-1 mb-4"
          disabled={isExchangeDisabled()}
        />
      )}
    </ViewHolder>
  );
}

export default Wire;
