import WalletConnectModal from "./components/WalletConnectModal";
import { Web3Button } from "@web3modal/react";

function App() {
  return (
    <div className="bg-gradient-radial from-purple-600 via-pink-600 to-blue-600 h-full w-full ">
      <div className="bg-gradient-to-r from-cyan-300 to-blue-300 drop-shadow-1xl">
        <Web3Button />
        <h1 className="flex justify-center font-extrabold place-content-center m-3 py-2 ">
          Hacia un Futuro Descentralizado
        </h1>
      </div>

      <WalletConnectModal />
    </div>
  );
}

export default App;
