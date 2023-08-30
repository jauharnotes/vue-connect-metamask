<template>
  <div class="App">
    <div>Injected Provider {{ hasProvider ? "DOES" : "DOES NOT" }} Exist</div>
    <button v-if="wallet == null || isConnected == 'no'" @click="handleConnect">
      Connect MetaMask
    </button>
    <button v-else @click="disConnected">Disconnect</button>
    <div v-if="wallet != null && isConnected == 'yes'">
      {{ `Wallet Accounts: ${wallet[0]}` }}
    </div>
    <p v-show="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import MobileDetect from "mobile-detect";
import { formatBalance, formatChainAsNum } from "./utils/index";
import Cookies from "js-cookie";

export default {
  name: "App",
  data() {
    return {
      hasProvider: false,
      wallet: null,
      isConnecting: false,
      error: false,
      errorMessage: "",
      isConnected: Cookies.get("connected"),
    };
  },
  computed: {
    shouldShowConnectButton() {
      return window.ethereum && !this.wallet;
    },
  },
  mounted() {
    this.getProvider();

    const isMobile = new MobileDetect(window.navigator.userAgent);

    if (window.ethereum) {
      alert("Metamask Terinstall");
    } else if (isMobile.mobile() && !window.ethereum) {
      alert("Pada perangkat Mobile & Metamask tidak Terinstall");
    } else {
      alert("Browser dekstop tidak terinstall Metamask");
    }
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
      Cookies.set("connected", "yes");

      const isMetaMaskInstalled = typeof window.ethereum !== "undefined";
      const isMetaMaskActive =
        isMetaMaskInstalled && window.ethereum.isConnected();

      if (!isMetaMaskActive) {
        window.location.href =
          "https://metamask.app.link/dapp/https://vue-connect-metamask.vercel.app/";
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        this.error = false;
        this.updateWallet(accounts);
        console.log("account:", accounts);

        window.location.reload();
      } catch (err) {
        this.error = true;
        this.errorMessage = err.message;
      }
    },

    disConnected() {
      var self = this;

      // alert('Disconected success!');
      Cookies.set("connected", "no");
      window.location.reload();
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
