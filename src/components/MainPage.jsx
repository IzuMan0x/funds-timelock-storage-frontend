/* Hooks from WAGMI helps build a better state feedback */
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
/* Contract abi location  **Note the ABI needs to be an array to be used with viem or wagmi*/
import { abi } from "../assets/fundsStorageContract.json";
import { parseEther, formatUnits } from "viem";

/* Main Component */
export default function MainPage() {
  //Contract Address
  const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;
  //Wagmi hook for checking if the wallet is connected
  const { address, isConnected } = useAccount();

  //hook for getting the userBalance in the contract
  const {
    data: userBalanceData,
    isError: getUserBalanceError,
    isLoading: getUserBalanceLoading,
  } = useContractRead({
    address: contractAddress,
    abi: abi,
    args: [address],
    functionName: "getUserBalance",
  });

  //hook for getting the time until deposit window
  const {
    data: getTimeUntilDepositWindowData,
    isError: getTimeUntilDepositWindowError,
    isLoading: getTimeUntilDepositWindowLoading,
  } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "getTimeUntilDepositWindow",
  });

  const {
    data: getTimeUntilWithdrawWindowData,
    isError: getTimeUntilWithdrawWindowError,
    isLoading: getTimeUntilWithdrawWindowLoading,
  } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "getTimeUntilWithdrawWindow",
  });

  console.log(
    "current time until deposit window: ",
    getTimeUntilDepositWindowData
  );

  //config for depositing preparing contract write
  const { config, error } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "depositFunds",
    args: [],
    value: parseEther("0.01"),
    onSuccess(data) {
      console.log("Success", data.result);
    },
  });

  //config for withdrawing preparing contract write
  const { config: configWithdraw, error: withdrawFundsError } =
    usePrepareContractWrite({
      address: contractAddress,
      abi: abi,
      functionName: "withdrawFunds",
      args: [],
      onSuccess(data) {
        console.log("Success", data.result);
      },
    });

  //withdrawing funds
  const {
    data: withdrawFundData,
    isSuccess: withdrawFundsSuccess,
    isLoading: withdrawFundsLoading,
    write: withdrawFunds,
  } = useContractWrite(configWithdraw);
  console.log(`transaction receipt ${withdrawFundsSuccess}`);

  //depositing funds
  const {
    data,
    isSuccess,
    isLoading,
    write: depositFunds,
  } = useContractWrite(config);
  console.log(`transaction receipt ${isSuccess}`);

  /* Conditional displays for the mint button states */
  const depositButton = () => {
    if (isLoading) {
      return "depositing";
    }
    if (!isConnected) {
      return "Please connect your Wallet";
    }
    if (isConnected && !isLoading) {
      return "deposit";
    }
  };

  const descriptionEtherDeposited =
    "Amount of Ethereum you have deposited is: ";

  const descriptionTimeUntilDepositWindow =
    "Time until the next deposit window is: ";
  const descriptionTimeUntilWithdrawWindow =
    "Time until the next withdraw window is: ";
  //Keeping these here just in case we need to add them back
  /* 
    
    <button
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-3 disabled:opacity-70 disabled:cursor-not-allowed hover:animate-pulse m-1"
          disabled={!isConnected}
          onClick={() => withdrawFunds?.()}
        >
          withdraw
        </button>

        <button
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-3 disabled:opacity-70 disabled:cursor-not-allowed hover:animate-pulse m-1"
          disabled={!isConnected}
          onClick={() => depositFunds?.()}
        >
          {depositButton()}
        </button>
    */

  return (
    <>
      <h1 className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-2 flex justify-center m-2">
        {descriptionEtherDeposited}
        {isConnected && userBalanceData
          ? formatUnits(userBalanceData, 18)
          : "(Wallet not connected, network error, or 0)"}
      </h1>
      <h1 className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-2 justify-center flex m-2">
        {descriptionTimeUntilDepositWindow}
        {isConnected
          ? `${Number(getTimeUntilDepositWindowData?.toString()) + 300} seconds`
          : "Wallet not connected"}
      </h1>
      <h1 className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-2 justify-center flex m-2">
        {descriptionTimeUntilWithdrawWindow}
        {isConnected
          ? `${
              Number(getTimeUntilWithdrawWindowData?.toString()) + 300
            } seconds`
          : "Wallet not connected"}
      </h1>
      <div className="flex justify-center">
        <a
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-3 disabled:opacity-70 disabled:cursor-not-allowed hover:animate-pulse m-1"
          href="https://sepolia.etherscan.io/address/0x3E62ED213B21dd47C4A8Fdf1f3B193fe2D4EeC6e"
          target="_blank"
        >
          Contract on Etherscan
        </a>
      </div>
    </>
  );
}
