import js from './data.json' assert { type: "json"}; //json file input
import Web3 from 'web3';

let API_URL = "<--alchemy websocket api-->"; //alchemy websocket api
let web3 = new Web3(API_URL);

const MY_ADDRESS = js.userAddress.substring(2);

const PRIVATE_KEY = '<--Private Key-->'; //프라이빗 키 입력
const BURN_ADDRESS = '000000000000000000000000000000000000dead'; //소각 주소

async function main(){
    const nonce = await web3.eth.getTransactionCount(MY_ADDRESS, 'latest');

    for(let i = 0;i<js.nfts.length;i++){
        const CONTRACT_ADDRESS = js.nfts[i].contractAddress; //컨트랙트 주소
        const TOKEN_ID = js.nfts[i].tokenId.substring(2); //토큰 ID
        const DATA_INPUT = '0x42842e0e000000000000000000000000'+MY_ADDRESS+'000000000000000000000000'+BURN_ADDRESS+TOKEN_ID; //SafeTranferFrom data format
        
        const signTx = await web3.eth.accounts.signTransaction({
            to: CONTRACT_ADDRESS,
            value: '0x00',
            data: DATA_INPUT,
            gas: 2000000,
        
        }, PRIVATE_KEY);
        
        web3.eth.sendSignedTransaction(signTx.rawTransaction, function(error,hash){
            if(!error){
                console.log("The hash of your transaction is: ",hash, "\n");
            }
            else{
                console.log("error",error);
            }
        });
    }
    
}

main();

