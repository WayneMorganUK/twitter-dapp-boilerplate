import { CustomChainConfig, CHAIN_NAMESPACES } from "@web3auth/base"
import { Web3AuthNoModalOptions } from "@web3auth/no-modal"
import { OpenloginAdapterOptions } from "@web3auth/openlogin-adapter"
import { APP_CONSTANTS } from "../constants";

export const clientId = "BM3HtzpAA6Bx7mJv9-JGSpKOrTkcbbwCklNcmENvwTB8u4pMgoCmMF2fwFp_kGVSug9GoLFzlyEhbjt89huYONA"

export const chainConfig: CustomChainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xAA36A7",
    rpcTarget: APP_CONSTANTS.RPC_TARGET,
    displayName: "Sepolia",
    blockExplorer: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "SepoliaETH"
}

export const web3Config: Web3AuthNoModalOptions = {
    clientId,
    web3AuthNetwork: 'sapphire_devnet',
    chainConfig,
}

export const openloginConfig: OpenloginAdapterOptions = {
    adapterSettings: {
        clientId,
        network: "testnet",
        uxMode: "popup",
        whiteLabel: {
            appName: "Twitter DApp",
            logoLight: "https://i.ibb.co/2gmPw9f/twitter-Dapp-Logo.jpg",
            logoDark: "https://i.ibb.co/2gmPw9f/twitter-Dapp-Logo.jpg",
            defaultLanguage: "en",
            mode: 'dark', // whether to enable dark mode. defaultValue: false
        },
        loginConfig: {
            jwt: {
                name: "Custom Auth Login",
                verifier: "MyTwitterDapp", // Please create a verifier on the developer dashboard and pass the name here
                typeOfLogin: "twitter", // Pass on the login provider of the verifier you've created
                clientId: APP_CONSTANTS.CLIENT_ID, // Pass on the clientId of the login provider here - Please note this differs from the Web3Auth ClientID. This is the JWT Client ID
            },
        },
        // Add other login providers here
    },
}

export const torusConfig = {
    torusWalletOpts: {},
    walletInitOptions: {
        whiteLabel: {
            theme: {
                isDark: true,
                colors: {
                    primary: "#ffffff"
                }
            },
            logoDark: "https://i.ibb.co/kDNCfC9/reshot-icon-wallet-9-H3-QMSDLFR.png",
            logoLight: "https://i.ibb.co/kDNCfC9/reshot-icon-wallet-9-H3-QMSDLFR.png",
        },
        useWalletConnect: true,
        enableLogging: true,
    },
}

export const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;


