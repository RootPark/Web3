let Web3 = require("web3");

let net = require('net');


//프로바이더로 알케미를 선택한다면 간단하게 변경하여 사용 가능.
//let API_URL = "<--alchemy wss URL-->";
//const web3 = new Web3(API_URL);

//프로바이더가 geth인 경우 ipc주소를 입력하면 됨. 아래는 window기준 default 위치
const web3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc',net));

let Address = '0x568d6e410b347245093eef3606f4a8f7f1d9f33c';
//테스트 address
let Contract = '0x5899a199a50e957430a597d8e7b2136dc1121e7e';
let TokenId = 1;
//테스트 Contract

let options721 = {
    topics: [
        web3.utils.sha3('Transfer(address,address,uint256)')
    ]
};

let subscription721 = web3.eth.subscribe('logs',options721);


subscription721.on('data',event => {
    if(event.topics.length == 4) {
        let transaction = web3.eth.abi.decodeLog([{
            type: 'address',
            name: 'from',
            indexed: true
        }, {
            type: 'address',
            name: 'to',
            indexed: true
        }, {
            type: 'uint256',
            name: 'tokenId',
            indexed: true
        }],
            event.data,
            [event.topics[1], event.topics[2], event.topics[3]]);

            if (transaction.from == Address) { console.log('Specified address sent an NFT!') };
            //특정 account에서 보낸 transaction
            if (transaction.to == Address) { console.log('Specified address received an NFT!') };
            //특정 account에서 받은 transaction
            if (event.address == Contract && transaction.tokenId == TokenId) { console.log('Specified NFT was transferred!') };
            //특정 contract의 특정 tocken의 transaction


            //블록당 발생하는 전체 ERC-721 출력
            //만약 from 부분이 0이라면 새로 mint된 것으로 판단.
            console.log(`\n` +
            `New ERC-721 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
            `From: ${(transaction.from === '0x0000000000000000000000000000000000000000') ? 'New mint!' : transaction.from}\n` +
            `To: ${transaction.to}\n` +
            `Token contract: ${event.address}\n` +
            `Token ID: ${transaction.tokenId}`
        );
    }
});

subscription721.on('error', err => {throw err});
subscription721.on('connected', nr => console.log('Subscription on  ERC-721 started with ID %s',nr));
