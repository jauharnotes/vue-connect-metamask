import { defineStore } from "pinia";
import detectEthereumProvider from "@metamask/detect-provider";


export const appStore = defineStore("app", () => {
  state: () => ({
    hasProvider: false,
    wallet: null,
  }),

   async function getProvider() {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      this.hasProvider = Boolean(provider);

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        this.refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", this.refreshAccounts);
      }
    };

    function refreshAccounts(accounts) {
      if (accounts.length > 0) {
        this.updateWallet(accounts);
      } else {
        this.wallet = null;
      }
    };

    async function updateWallet(accounts) {
      this.wallet = accounts;
    };

    async function handleConnect() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.updateWallet(accounts);
      console.log("account: ", accounts);
    };

    return { state, getProvider, refreshAccounts, updateWallet, handleConnect }
  },

);
