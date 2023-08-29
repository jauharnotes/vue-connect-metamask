<template>
  <div class="App">
    <div>Injected Provider {{ hasProvider ? "DOES" : "DOES NOT" }} Exist</div>
    <button v-if="shouldShowConnectButton" @click="handleConnect">Connect MetaMask</button>
    <div v-if="wallet">{{ `Wallet Accounts: ${wallet[0]}` }}</div>
    <p v-show="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import MobileDetect from 'mobile-detect';
import { formatBalance, formatChainAsNum } from './utils/index'

export default {
  name: "App",
  data() {
    return {
      hasProvider: false,
      wallet: null,
      isConnecting: false,
      error: false,
      errorMessage: ''
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
      this.isConnecting = true;
      const isMobile = new MobileDetect(window.navigator.userAgent);
      console.log(isMobile.mobile());

      if (isMobile.mobile()) {
        window.location.href = "https://metamask.app.link/dapp/https://vue-connect-metamask.vercel.app/"
      }
      await window.ethereum.request({
        method: "eth_requestAccounts",
      }).then((accounts) => {
        this.error = false;
        this.updateWallet(accounts);
        console.log("account: ", accounts);

      }).catch((err) => {
        this.error = true;
        this.errorMessage = err.message;
      })
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

p {
  color: brown;
  font-style: italic;
}

</style>
