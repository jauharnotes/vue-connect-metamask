import { defineStore } from "pinia";
import detectEthereumProvider from "@metamask/detect-provider";
import { ref } from "vue";

export const appStore = defineStore("app", () => {
  const state = ref({
    hasProvider: false,
    wallet: null,
  });

  async function getProvider() {
    const provider = await detectEthereumProvider({ silent: true });
    console.log(provider);
    state.hasProvider = Boolean(provider);

    if (provider) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      this.refreshAccounts(accounts);
      window.ethereum.on("accountsChanged", this.refreshAccounts);
    }
  }

  function refreshAccounts(accounts) {
    if (accounts.length > 0) {
      updateWallet(accounts);
    } else {
      this.wallet = null;
    }
  }

  async function updateWallet(accounts) {
    state.wallet = accounts;
  }

  async function handleConnect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
    console.log("account: ", accounts);
  }

  return { state, getProvider, refreshAccounts, updateWallet, handleConnect };
});
