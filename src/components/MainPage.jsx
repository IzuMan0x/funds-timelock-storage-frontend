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
      </div>
      <p className="p-2">
        <span className="font-bold">
          1- Elegir la entidad financiera o gestora con la que se quiere
          contratar el plan.
        </span>
        <br />
        Las más conocidas son bancos, aseguradoras y algunas gestoras
        independientes. Implementar contratos inteligentes en la elección
        inicial de la entidad gestora aún no sería viable hoy por varias
        razones: Las gestoras no operan en blockchains compatibles, no existe un
        marco legal y regulatorio que lo permita, el usuario promedio no tiene
        la capacidad técnica para interactuar con contratos inteligentes, y los
        planes de pensiones siguen siendo "off-chain". Se necesitan gestoras en
        blockchains adecuadas, marcos legales actualizados, interfaces amigables
        para usuarios, y planes de pensiones nativos en blockchain, para poder
        llegar a elegir un plan directamente mediante un contrato inteligente.
        Todavía faltan pasos por recorrer antes de llegar a ese punto.
        <br />
        <span className="font-bold">
          2- Analizar las diferentes opciones de planes disponibles en esa
          entidad y seleccionar el que más se ajuste al perfil y objetivos del
          inversor.
        </span>
        <br />
        Cada plan tiene distintas características. En la etapa de análisis y
        selección del plan de pensiones individual sí podemos incorporar un
        contrato inteligente: Colocaremos los planes de pensiones estructurados
        en el contrato inteligente El contrato inteligente sería el código que
        define las reglas y condiciones del plan de pensiones, en lugar de un
        documento legal tradicional. Este código se incorporaría en una
        blockchain de esta manera los inversores pueden interactuar con él
        mediante transacciones. Una vez hecho el código, el contrato inteligente
        se integrará en la blockchain y así obtendremos una dirección única.
        Importante aclarar que la interacción mediante el contrato será por
        transacciones, por ejemplo, para consultar información del plan de
        pensiones, se envía una transacción con esa petición. O para suscribirse
        al plan, se enviaría una transacción ejecutando la función de adhesión
        del contrato.
      </p>
    </>
  );
}
