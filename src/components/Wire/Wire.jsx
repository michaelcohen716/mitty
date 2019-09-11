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
  getEthToTokenInputPrice,
  ExchangeContract,
  TokenContract,
  ROPSTEN_TTT_UNISWAP_EXCHANGE
} from "../../services/uniswap";
import "./Wire.css";

function Wire({
  mainnetERC20Balance,
  maticERC20Balance,
  address,
  getMainnetERC20Balance
}) {
  const [mainnetETHBalance, setMainnetETHBalance] = useState("");
  const [exchangeAmount, setExchangeAmount] = useState("");

  const [txHash, setTxHash] = useState("");

  const [txProcessing, toggleTxProcessing] = useState(false);
  const [txSuccess, toggleTxSuccess] = useState(false);

  useEffect(() => {
    const getMainnetEthBalance = async () => {
      const bal = await _getMainnetETHBalance(address);
      console.log("mainnet eth bal", bal);
      setMainnetETHBalance(bal);

      await getEthToTokenInputPrice(0.02);
    };
    getMainnetEthBalance();
    pollBalances();
  }, []);

  const exchangeWithUniswap = async () => {
    toggleTxProcessing(true);
    const amount = exchangeAmount;
    const retVal = await ethForTestToken(amount);
    pollBalances();
  };

  const pollBalances = async () => {
    setInterval(async () => {
      const bal = await _getMainnetETHBalance(address);
      setMainnetETHBalance(bal);

      getMainnetERC20Balance(address);
    }, 2000);
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
        buy ETH with Moonpay and exchange for Dai on Uniswap below. Allow
        several minutes for the Uniswap exchange to register in your balance.
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
        <div className="balance-value">{mainnetETHBalance.slice(0, 5)} ETH</div>
      </div>

      <GeneralInput
        amount={exchangeAmount}
        onChange={e => setExchangeAmount(e.target.value)}
        placeholder="Amount to Exchange"
      />
      {txProcessing ? (
        <div className="d-flex flex-column">
          <MiniLoading />
        </div>
      ) : txSuccess ? (
        <div className="mt-3 success-text">
          Your updated balance should be reflected shortly
        </div>
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
