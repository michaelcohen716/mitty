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
  ROPSTEN_TTT_UNISWAP_EXCHANGE,
  checkApprovalAllowance,
  approveERC20
} from "../../services/uniswap";
import clipboard from "../../assets/clipboard.png";
import "./Wire.css";

function Wire({
  mainnetERC20Balance,
  maticERC20Balance,
  address,
  privateKey,
  getMainnetERC20Balance
}) {
  const [mainnetETHBalance, setMainnetETHBalance] = useState("");
  const [exchangeAmount, setExchangeAmount] = useState("");

  const [approvalAllowance, setApprovalAllowance] = useState("");
  const [showApproval, toggleShowApproval] = useState(false);
  const [approvalTxProcessing, toggleApprovalTxProcessing] = useState(false)

  const [txProcessing, toggleTxProcessing] = useState(false);
  const [txSuccess, toggleTxSuccess] = useState(false);

  useEffect(() => {
    const getMainnetEthBalance = async () => {
      const bal = await _getMainnetETHBalance(address);
      console.log("mainnet eth bal", bal);
      setMainnetETHBalance(bal);

      const tokenAllowance = await checkApprovalAllowance(address);
      console.log("tokenallow", tokenAllowance);
      setApprovalAllowance(tokenAllowance);
      if (Number(tokenAllowance) === 0) {
        toggleShowApproval(true);
      }
    };
    getMainnetEthBalance();
    pollBalances();
  }, []);

  const exchangeWithUniswap = async () => {
    toggleTxProcessing(true);
    setInterval(() => {
      toggleTxProcessing(false)
    }, 3000)
    const amount = exchangeAmount;
    const retVal = await ethForTestToken(amount, privateKey);
    toggleTxSuccess(true)
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
    } else if (Number(approvalAllowance) === 0) {
      return true;
    } else {
      return false;
    }
  };

  const copyAddress = () => {
    navigator.clipboard.copy(address);
  };

  const uniswapApproveERC20 = async () => {
    toggleApprovalTxProcessing(true);
    await approveERC20(address, privateKey);
  };

  return (
    <ViewHolder headlineText="Wire Funds to Ethereum">
      <div className="moonpay-note mb-3">
        Note: The Moonpay test environment doesn't support Dai, so we'll need to
        buy ETH with Moonpay and exchange for Dai on Uniswap below. Allow
        several minutes for the Uniswap exchange to register in your balance.
      </div>

      <div className="d-flex mb-2 font-weight-bold">
        <div>My address: {address.slice(0, 5) + "..." + address.slice(38)}</div>
        <img
          src={clipboard}
          className="img-fluid clipboard ml-1 mt-1"
          onClick={copyAddress}
        />
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
        <div className="d-flex flex-column">
          <div className="mt-3 success-text">
            Your updated balance should be reflected shortly
          </div>
          <a
            className="tx-link mt-1"
            target="_blank"
            href="https://ropsten.etherscan.io/address/0xc4659c4dd66d1175d8b3c53b195911ad493bb2eb"
          >
            Track transaction here
          </a>
        </div>
      ) : (
        <div className="d-flex">
          <SubmitButton
            onClick={exchangeWithUniswap}
            className="mt-1 mb-4"
            disabled={isExchangeDisabled()}
            text="Submit"
          />
          {showApproval &&
            (approvalTxProcessing ? (
              <div className="success-text mt-2 ml-2">Check back shortly</div>
            ) : (
              <div className="d-flex">
                <div className="approve-text ml-2">
                  You'll need to approve Uniswap <br />
                  before you can exchange
                </div>
                <SubmitButton
                  className="ml-1"
                  text="Approve"
                  onClick={uniswapApproveERC20}
                />
              </div>
            ))}
        </div>
      )}
    </ViewHolder>
  );
}

export default Wire;
