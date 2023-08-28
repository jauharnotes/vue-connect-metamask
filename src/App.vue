<template>
  <div class="App">
    <div>Injected Provider {{ hasProvider ? "DOES" : "DOES NOT" }} Exist</div>
    <button v-if="shouldShowConnectButton" @click="handleConnect">Connect MetaMask</button>
    <div v-if="wallet">{{ `Wallet Accounts: ${wallet[0]}` }}</div>
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";

export default {
  name: "App",
  data() {
    return {
      hasProvider: false,
      wallet: null,
    };
  },
  computed: {
    shouldShowConnectButton() {
      return window.ethereum && !this.wallet;
    },
  },
  mounted() {
    this.getProvider();
  },
  beforeUnmount() {
    window.ethereum?.removeListener("accountsChanged", this.refreshAccounts);
  },
  methods: {
    async getProvider() {
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
    },
    refreshAccounts(accounts) {
      if (accounts.length > 0) {
        this.updateWallet(accounts);
      } else {
        this.wallet = null;
      }
    },
    async updateWallet(accounts) {
      this.wallet = accounts;
    },
    async handleConnect() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.updateWallet(accounts);
      console.log("account: ", accounts);
    },
  },
};
</script>

<style>
.App {
  display: flex;
  flex-direction: column;
  place-items: center;
  min-width: 100vw;
  min-height: 100vh;
}
button {
  margin-top: 0.5em;
}

</style>
