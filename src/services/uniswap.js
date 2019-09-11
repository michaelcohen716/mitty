import { web3 } from "./web3";
import { ethers } from "ethers";
import { token as TTTAddress } from "./matic";
import UniswapFactory from "../contracts/UniswapFactoryABI.json";
import UniswapExchange from "../contracts/UniswapExchangeABI.json";
import ERC20 from "../contracts/ERC20ABI2.json";
const Tx = require("ethereumjs-tx").Transaction;

const ROPSTEN_UNISWAP_FACTORY = "0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351";
export const ROPSTEN_TTT_UNISWAP_EXCHANGE =
  "0xc4659c4DD66d1175D8b3C53b195911AD493Bb2eB";

async function FactoryContract() {
  return await new web3.eth.Contract(UniswapFactory, ROPSTEN_UNISWAP_FACTORY);
}

export async function ExchangeContract() {
  return await new web3.eth.Contract(
    UniswapExchange,
    ROPSTEN_TTT_UNISWAP_EXCHANGE
  );
}

export async function TokenContract() {
  return await new web3.eth.Contract(ERC20, TTTAddress);
}

export async function getEthToTokenInputPrice(valueInEth) {
  const exchContr = await ExchangeContract();
  const output = await exchContr.methods
    .getEthToTokenInputPrice(web3.utils.toWei(String(valueInEth), "ether"))
    .call();
  console.log("output tokns", output);
}

export async function checkApprovalAllowance(userAddr){
  const tokenContr = await TokenContract();
  const allowance = await tokenContr.methods.allowance(userAddr, ROPSTEN_TTT_UNISWAP_EXCHANGE).call()
  console.log("allowance", allowance)
  return allowance;
}

export async function testTokenForEth(valueInTTT) {
  const exchContr = await ExchangeContract();
  const DEADLINE_FROM_NOW = 60 * 15;
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  const tokens_sold = web3.utils.toWei(String(valueInTTT), "ether");
  console.log("tokens sold", tokens_sold)

  const func = exchContr.methods
    .tokenToEthSwapInput(
      tokens_sold,
      1, // min liquidity
      deadline
    )
    .encodeABI();

  return web3.eth.getBlock("latest", false, (error, result) => {
    var _gasLimit = result.gasLimit;

    return web3.eth.getGasPrice(async function (error, result) {
      var _gasPrice = result;

      const _privateKey = process.env.REACT_APP_TEST_PK1;
      const privateKey = Buffer.from(_privateKey, "hex");

      var _hex_value = web3.utils.toHex(
        web3.utils.toWei(String(valueInTTT), "ether")
      );
      var _hex_gasLimit = web3.utils.toHex(_gasLimit.toString());
      var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());

      const keystore = await web3.eth.accounts.privateKeyToAccount(
        "0x" + _privateKey
      );
      const _from = keystore.address;
      var _trx_count = await web3.eth.getTransactionCount(_from);
      var _hex_Gas = web3.utils.toHex("7000000");

      const rawTx = {
        nonce: web3.utils.toHex(_trx_count),
        to: ROPSTEN_TTT_UNISWAP_EXCHANGE,
        from: _from,
        gasLimit: _hex_gasLimit,
        gas: _hex_Gas,
        gasPrice: _hex_gasPrice,
        data: func
      };

      const tx = new Tx(rawTx, { chain: "ropsten" });
      tx.sign(privateKey);

      var serializedTx = "0x" + tx.serialize().toString("hex");
      return await web3.eth.sendSignedTransaction(
        serializedTx.toString("hex"),
        function (err, hash) {
          if (err) {
            console.log("err", err);
            return err;
          } else {
            console.log("Txn Sent and hash is " + hash);
            return hash;
          }
        }
      );
    });
  });
}

export async function ethForTestToken(valueInEth, _privateKey) {
  const exchContr = await ExchangeContract();
  const DEADLINE_FROM_NOW = 60 * 15;
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;
  const func = exchContr.methods.ethToTokenSwapInput(1, deadline).encodeABI();

  return web3.eth.getBlock("latest", false, (error, result) => {
    var _gasLimit = result.gasLimit;

    return web3.eth.getGasPrice(async function(error, result) {
      var _gasPrice = result;

      const privateKey = Buffer.from(_privateKey, "hex");

      var _hex_value = web3.utils.toHex(
        web3.utils.toWei(String(valueInEth), "ether")
      );
      var _hex_gasLimit = web3.utils.toHex(_gasLimit.toString());
      var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());

      const keystore = await web3.eth.accounts.privateKeyToAccount(
        "0x" + _privateKey
      );
      const _from = keystore.address;
      var _trx_count = await web3.eth.getTransactionCount(_from);
      var _hex_Gas = web3.utils.toHex("5000000");

      const rawTx = {
        nonce: web3.utils.toHex(_trx_count),
        to: ROPSTEN_TTT_UNISWAP_EXCHANGE,
        from: _from,
        gasLimit: _hex_gasLimit,
        gas: _hex_Gas,
        gasPrice: _hex_gasPrice,
        value: _hex_value,
        data: func
      };

      const tx = new Tx(rawTx, { chain: "ropsten" });
      tx.sign(privateKey);

      var serializedTx = "0x" + tx.serialize().toString("hex");
      return await web3.eth.sendSignedTransaction(
        serializedTx.toString("hex"),
        function(err, hash) {
          if (err) {
            console.log("err", err);
            return err;
          } else {
            console.log("Txn Sent and hash is " + hash);
            return hash;
          }
        }
      );
    });
  });
}

export async function approveERC20(_from, _privateKey) {
  const tokenContr = await TokenContract();
  const approveFunc = tokenContr.methods
    .approve(ROPSTEN_TTT_UNISWAP_EXCHANGE, ethers.constants.MaxUint256)
    .encodeABI();

  web3.eth.getBlock("latest", false, (error, result) => {
    var _gasLimit = result.gasLimit;
    console.log("gaslimit", _gasLimit);

    web3.eth.getGasPrice(async function(error, result) {
      var _gasPrice = result;

      const privateKey = Buffer.from(_privateKey, "hex");

      var _hex_gasLimit = web3.utils.toHex(_gasLimit.toString());
      var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());

      var _trx_count = await web3.eth.getTransactionCount(_from);
      var _hex_Gas = web3.utils.toHex("5000000");

      const rawTx = {
        nonce: web3.utils.toHex(_trx_count),
        to: TTTAddress,
        from: _from,
        gasLimit: _hex_gasLimit,
        gas: _hex_Gas,
        gasPrice: _hex_gasPrice,
        data: approveFunc
      };

      const tx = new Tx(rawTx, { chain: "ropsten" });
      tx.sign(privateKey);

      var serializedTx = "0x" + tx.serialize().toString("hex");
      web3.eth.sendSignedTransaction(serializedTx.toString("hex"), function(
        err,
        hash
      ) {
        if (err) {
          console.log("err", err);
        } else {
          console.log("Txn Sent and hash is " + hash);
        }
      });
    });
  });
}

export async function addLiquidity() {
  const contr = await ExchangeContract();

  // ADD LIQUIDITY
  const DEADLINE_FROM_NOW = 60 * 15;
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  const func = contr.methods
    .addLiquidity(
      2,
      ethers.constants.MaxUint256, // max tokens
      deadline
    )
    .encodeABI();
  web3.eth.getBlock("latest", false, (error, result) => {
    var _gasLimit = result.gasLimit;

    web3.eth.getGasPrice(async function(error, result) {
      var _gasPrice = result;

      const _privateKey = process.env.REACT_APP_TEST_PK1;
      const privateKey = Buffer.from(_privateKey, "hex");

      var _hex_value = web3.utils.toHex(web3.utils.toWei(String(1), "ether"));
      var _hex_gasLimit = web3.utils.toHex(_gasLimit.toString());
      var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());

      const keystore = await web3.eth.accounts.privateKeyToAccount(
        "0x" + _privateKey
      );
      const _from = keystore.address;
      console.log("_from", _from);
      var _trx_count = await web3.eth.getTransactionCount(_from);
      var _hex_Gas = web3.utils.toHex("1000000");

      const rawTx = {
        nonce: web3.utils.toHex(_trx_count),
        to: ROPSTEN_TTT_UNISWAP_EXCHANGE,
        from: _from,
        gasLimit: _hex_gasLimit,
        gas: _hex_Gas,
        gasPrice: _hex_gasPrice,
        value: _hex_value,
        data: func
      };

      const tx = new Tx(rawTx, { chain: "ropsten" });
      tx.sign(privateKey);

      var serializedTx = "0x" + tx.serialize().toString("hex");
      web3.eth.sendSignedTransaction(serializedTx.toString("hex"), function(
        err,
        hash
      ) {
        if (err) {
          console.log("err", err);
        } else {
          console.log("Txn Sent and hash is " + hash);
        }
      });
    });
  });
}

export async function createTokenExchange() {
  // Test Token
  const contr = await FactoryContract();
  const func = contr.methods.createExchange(TTTAddress).encodeABI();

  web3.eth.getBlock("latest", false, (error, result) => {
    var _gasLimit = result.gasLimit;

    web3.eth.getGasPrice(async function(error, result) {
      var _gasPrice = result;

      const _privateKey = process.env.REACT_APP_TEST_PK1;
      const privateKey = Buffer.from(_privateKey, "hex");

      var _hex_gasLimit = web3.utils.toHex(_gasLimit.toString());
      var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());

      const keystore = await web3.eth.accounts.privateKeyToAccount(
        "0x" + _privateKey
      );
      const _from = keystore.address;
      console.log("_from", _from);
      var _trx_count = await web3.eth.getTransactionCount(_from);
      var _hex_Gas = web3.utils.toHex("5000000");

      const rawTx = {
        nonce: web3.utils.toHex(_trx_count),
        to: ROPSTEN_UNISWAP_FACTORY,
        from: _from,
        gasLimit: _hex_gasLimit,
        gas: _hex_Gas,
        gasPrice: _hex_gasPrice,
        data: func
      };

      const tx = new Tx(rawTx, { chain: "ropsten" });
      tx.sign(privateKey);

      var serializedTx = "0x" + tx.serialize().toString("hex");
      web3.eth.sendSignedTransaction(serializedTx.toString("hex"), function(
        err,
        hash
      ) {
        if (err) {
          console.log("err", err);
        } else {
          console.log("Txn Sent and hash is " + hash);
        }
      });
    });
  });
}

export async function getTokenCount() {
  const contr = await FactoryContract();
  console.log("contr", contr);
  const count = await contr.methods.tokenCount().call();
  console.log("token count", count);
}

export async function getToken() {
  const contr = await FactoryContract();
  const exchAddr = await contr.methods.getExchange(TTTAddress).call();
  console.log("token exch", exchAddr);

  web3.eth.getAccounts((err, res) => {
    console.log("accounts", res);
  });
}
