const Web3 = require("web3");

const abi = require("./abi.json");
const abi2 = require("./abi2.json");
const poolAbi = require("./poolAbi.json");
const readline = require("readline-sync");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

const instance = new web3.eth.Contract(
  abi,
  "0x64c2EfCF94129656F1C859E92120252844162513"
);
const instance2 = new web3.eth.Contract(
  abi2,
  "0xB8681aC978A7D440aaa256e6231CbA99467ccfC4"
);

async function getBalance() {
  let address = readline.question("enter address:");
  console.log("RAIN staking:");

  const decimalsRain = await instance2.methods.decimals().call();

  const walletBalance = await instance.methods.balanceOf(address).call();
  console.log("wallet balance:", (walletBalance/(10**decimalsRain)).toFixed(2));

  const stakedBalance = await instance.methods.getTotalDeposit(address).call();
  console.log("staked balance:", (stakedBalance/(10**decimalsRain)).toFixed(2));

  const cummalativeRewards = await instance.methods
    .cumulativeRewardsOf(address)
    .call();
  console.log("cummalative rewards:", (cummalativeRewards/(10**decimalsRain)).toFixed(2));

  const withdrawnRewards = await instance.methods
    .withdrawnRewards(address)
    .call();
  console.log("withdrawn rewards:", (withdrawnRewards/(10**decimalsRain)).toFixed(2));

  const rewards = await instance.methods.withdrawableRewardsOf(address).call();
  console.log("staked rewards:", (rewards/(10**decimalsRain)).toFixed(2));

  console.log("RAIN/WETH Pool:");
  const RAINWETHContract = new web3.eth.Contract(
    poolAbi,
    "0xC4A8C243D8cf7891d6282Bb293E7a0aa4ef1aE51"
  );
  var totalsupplyoflp = await RAINWETHContract.methods.totalSupply().call();
  var tokenReserve = await RAINWETHContract.methods.getReserves().call();
  var LptokensReceived = await instance2.methods
    .getTotalDeposit(address)
    .call();
  var LpDecimal = await instance2.methods.decimals().call();
  var token0 = await RAINWETHContract.methods.token0().call();
  var token1 = await RAINWETHContract.methods.token1().call();
  //////////////for first token/////////////////////
  const token0contract = new web3.eth.Contract(poolAbi, token0);
  var Symbol0 = await token0contract.methods.symbol().call();
  var Decimal0 = await token0contract.methods.decimals().call();
  totalsupplyoflp = totalsupplyoflp / 10 ** Decimal0;
  var token0Reserve = tokenReserve[0];
  token0Reserve = token0Reserve / 10 ** Decimal0;
  LptokensReceived = LptokensReceived / 10 ** LpDecimal;
  var token0amount = (LptokensReceived / totalsupplyoflp) * token0Reserve;
  token0amount = token0amount.toFixed(2);
  /////////////// for second token//////////////////////////////////////////////
  const token1contract = new web3.eth.Contract(poolAbi, token1);
  var Symbol1 = await token1contract.methods.symbol().call();
  var Decimal1 = await token1contract.methods.decimals().call();
  var totalSupplytoken1 = totalsupplyoflp / 10 ** Decimal1;
  var token1Reserve = tokenReserve[1] / 10 ** Decimal1;
  var LptokensReceivedtoken1 = LptokensReceived / 10 ** Decimal1;
  var token1amount =
    (LptokensReceivedtoken1 / totalSupplytoken1) * token1Reserve;
  token1amount = token1amount.toFixed(2);
  
  if ((token0amount != 0, token1amount != 0))
    console.log(Symbol0, "+", Symbol1, token0amount, "+", token1amount);

  const rewardsWeth = await instance2.methods
    .withdrawableRewardsOf(address)
    .call();
 
  console.log(
    "staked rewards in Weth pool:",
    (rewardsWeth / 10 ** decimalsRain).toFixed(2)
  );
}

getBalance();

