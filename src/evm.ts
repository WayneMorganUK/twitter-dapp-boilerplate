import type { IProvider } from "@web3auth/base";
import Web3 from "web3";
import { APP_CONSTANTS } from "./constants";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

export default class EthereumRpc {
    private provider: IProvider;
    constructor(provider: IProvider) {
        this.provider = provider;
    }

    async getAccounts(): Promise<string[]> {
        try {
            const web3 = new Web3(this.provider as any);
            const accounts = await web3.eth.getAccounts();
            return accounts;
        } catch (error: unknown) {
            return error as string[];
        }
    }

    async sendUpVoteTransaction(tweetIndex: any): Promise<string> {
        try {
            const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
            const web3 = createAlchemyWeb3(alchemyKey, { writeProvider: this.provider, });
            const contractABI = require("./contract-abi.json");
            const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;
            const twitterContract = new web3.eth.Contract(contractABI, contractAddress);
            let accounts = await this.getAccounts();
            await twitterContract.methods
                .upvote(tweetIndex)
                .send({ from: accounts[0] });
            return "success";
        } catch (error) {
            return error as string;
        }
    }

    async sendAddCommentTransaction(tweetIndex: any, comment: any): Promise<string> {
        try {
            const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
            const web3 = createAlchemyWeb3(alchemyKey, { writeProvider: this.provider, });
            const contractABI = require("./contract-abi.json");
            const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;
            const twitterContract = new web3.eth.Contract(contractABI, contractAddress);
            let accounts = await this.getAccounts();
            await twitterContract.methods
                .addComment(tweetIndex, comment)
                .send({ from: accounts[0] });
            return "success";
        } catch (error) {
            return error as string;
        }
    }

    async sendWriteTweetTransaction(tweetName: any, tweetDescription: any): Promise<string> {
        try {
            const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
            const web3 = createAlchemyWeb3(alchemyKey, { writeProvider: this.provider, });
            const contractABI = require("./contract-abi.json");
            const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;
            const twitterContract = new web3.eth.Contract(contractABI, contractAddress);
            let accounts = await this.getAccounts();
            await twitterContract.methods
                .writeTweet(tweetName, tweetDescription)
                .send({ from: accounts[0] });
            return "success";
        } catch (error) {
            return error as string;
        }
    }
    async getAllTweets(): Promise<any[]> {
        try {
            const alchemyKey = APP_CONSTANTS.ALCHEMY_KEY;
            const web3 = createAlchemyWeb3(alchemyKey, { writeProvider: this.provider, });
            const contractABI = require("./contract-abi.json");
            const contractAddress = APP_CONSTANTS.CONTRACT_ADDRESS;
            const twitterContract = new web3.eth.Contract(contractABI, contractAddress
            );
            return await twitterContract.methods.getAllTweets().call();
        } catch (error) {
            return [];
        }
    }
}
