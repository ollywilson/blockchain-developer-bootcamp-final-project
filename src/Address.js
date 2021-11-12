import React, { useState, useEffect } from "react";

import PasterContract from "./contracts/Paster.json";
import getWeb3 from "./getWeb3";
import { PasteContainer } from "./PasteContainer";

export const Address = ({ pasteAddress }) => {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
    utilizedPasteAddress: pasteAddress,
  });

  useEffect(() => {
    window.ethereum.on("accountsChanged", (accounts) => {
      // Handle the new accounts, or lack thereof.
      // "accounts" will always be an array, but it can be empty.

      if (!pasteAddress.length && accounts.length) {
        setState((state) => ({
          ...state,
          accounts: accounts,
          utilizedPasteAddress: accounts[0],
        }));
      } else if (accounts.length) {
        setState((state) => ({
          ...state,
          accounts: accounts,
        }));
      }
    });
  }, [pasteAddress.length]);

  useEffect(() => {
    try {
      // // Get network provider and web3 instance.
      getWeb3().then((web3) => {
        // // Use web3 to get the user's accounts.
        web3.eth.getAccounts().then((accounts) => {
          // // Get the contract instance.
          web3.eth.net.getId().then((networkId) => {
            const deployedNetwork = PasterContract.networks[networkId];
            const instance = new web3.eth.Contract(
              PasterContract.abi,
              deployedNetwork && deployedNetwork.address
            );

            if (!pasteAddress.length && accounts && accounts.length) {
              setState({
                ...state,
                web3: web3,
                accounts: accounts,
                contract: instance,
                utilizedPasteAddress: accounts[0],
              });
            } else {
              setState({
                ...state,
                web3: web3,
                accounts: accounts,
                contract: instance,
              });
            }
          });
        });
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, [state, pasteAddress.length]);

  return !state.web3 ? (
    <div>{'Pending load of Web3, accounts, and the Paste contract...'}</div>
  ) : (
    <div className="App">
      {state.utilizedPasteAddress.length ? (
        <PasteContainer state={state} />
      ) : (
        <div />
      )}
    </div>
  );
};
