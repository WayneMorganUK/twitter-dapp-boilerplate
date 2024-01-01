import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { web3Config, chainConfig, torusConfig } from "../config/config";

const initializeWeb3auth = async () => {
    try {
        const web3authInstance = new Web3AuthNoModal(web3Config)
        const privateKeyProvider = new EthereumPrivateKeyProvider({
            config: { chainConfig }
        })

        const openloginAdapter = new OpenloginAdapter({
            privateKeyProvider
        })

        // const openloginAdapter = new OpenloginAdapter({
        //     adapterSettings: openloginConfig.adapterSettings,
        //     privateKeyProvider,
        // })
        const torusPlugin = new TorusWalletConnectorPlugin(torusConfig);

        await web3authInstance.addPlugin(torusPlugin);
        console.log('web3auth', web3authInstance)
        web3authInstance.configureAdapter(openloginAdapter);
        // console.log('web3authINSTANCE+++', web3authInstance)
        return web3authInstance



    } catch (error) {
        console.error("error Initializing web3auth")
        return null;
    }
}

export default initializeWeb3auth
