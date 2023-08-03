import WalletConnectModal from "./components/WalletConnectModal";
import { Web3Button } from "@web3modal/react";

function App() {
  return (
    <div>
      <div className="bg-gradient-to-r from-cyan-300 to-blue-300 drop-shadow-1xl rounded-b-xl">
        <Web3Button />
        <h1 className="flex justify-center font-extrabold place-content-center m-3 py-2">
          Hacia un Futuro Descentralizado
        </h1>
      </div>

      <WalletConnectModal />
    </div>
  );
}

export default App;
