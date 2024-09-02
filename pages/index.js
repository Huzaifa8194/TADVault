import Head from "next/head";
import Banner from "@/components/Banner/Banner";
import ContactOne from "@/components/Contact/ContactOne";
import Roadmap from "@/components/Roadmap/Roadmap";
import Sales from "@/components/Sales/Sales";
import TeamOne from "@/components/Team/TeamOne";
import TopPartners from "@/components/TopPartners/TopPartners";
import WhitePaper from "@/components/WhitePaper/WhitePaper";
import WhoWeAre from "@/components/WhoWeAre/WhoWeAre";
import LayoutOne from "@/layouts/LayoutOne";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";


//======================== THIRD CONNECT ======================== //

import { useMetamask, useWalletConnect, useAddress, useNetwork, useSigner } from "@thirdweb-dev/react";





//=============================================================== //


const TADContractAddress = "0xc251790275819b5e0D454611F410A90Dd58bD9eD";
const USDCContractAddress = "0xC6EC4C136E1B703B512aB9e618c16bcE0ADE6e1F";

const TADAbi = [
  "function mint(uint256 usdcAmount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function sell(uint256 usdcAmount) external",
  "function distributeRewards() external"
];

const USDCAbi = [
  "function totalAssets() external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function asset() external view returns (address)",
  "function name() external view returns (string)"
];
export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("");
  const [tadBalance, setTadBalance] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
 

  const [totalAssets, setTotalAssets] = useState("");
  const [vaultOwner, setVaultOwner] = useState("");
  const [assetAddress, setAssetAddress] = useState("");
  const [vaultName, setVaultName] = useState("");


  const [TADContract, setTADContract] = useState(null);
  const [USDCContract, setUSDCContract] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  const network = useNetwork();
const connectMetamask = useMetamask();
const connectWalletConnect = useWalletConnect();
const signer = useSigner();
const address = useAddress();




useEffect(() => {
  if (address) {
    updateBalances();
  }
}, [address]);

const connectWallet = async ({ walletoption }) => {
  try {
    if (walletoption === "Metamask") {
      await connectMetamask();
    } else if (walletoption === "Walletconnect") {
      await connectWalletConnect();
    }

    // Ensure balances are updated after wallet connection
    await updateBalances();
    toast.success("Wallet connected successfully!");
  } catch (error) {
    toast.error("Failed to connect wallet. " + error.message);
  }
};

  const updateBalances = async () => {
    if (address){

      try{
      const provider = signer.provider; // Get the provider from the signer

      const tadContract = new ethers.Contract(TADContractAddress, TADAbi, signer);
      const usdcContract = new ethers.Contract(USDCContractAddress, USDCAbi, signer);
      console.log("TADContract prot", tadContract);
      console.log("USDCContract prot", usdcContract);

      setTADContract(tadContract);
      setUSDCContract(usdcContract);

      console.log("TADContract",TADContract);
      console.log("USDCContract",USDCContract);

      const vaultBal = await usdcContract.totalSupply();
      const vaultDecimals = await usdcContract.decimals();

      const vaultAssetaddress = await usdcContract.asset();
      const vaultName = await usdcContract.name();
      //const vaultOwner = await USDCContract.owner();
      

      const totalassets = await usdcContract.totalAssets();

      setTadBalance(ethers.utils.formatUnits(vaultBal, vaultDecimals));
      setTotalAssets(ethers.utils.formatUnits(totalassets, vaultDecimals));
      setVaultName(vaultName);
      setAssetAddress(vaultAssetaddress);
     // setVaultOwner(vaultOwner);
      }

      catch(error){
        toast.error("FAILED TO UPDATE BALANCE" + error);
      }


    }
  };

  const distributerewards = async () => {
    if (USDCContract && TADContract) {
      try {
        await TADContract.distributeRewards();
        toast.success("Rewards distributed successfully.");
      } catch (error) {
        toast.error("Failed to distribute rewards." + error);
      }
      
    }
  };
  
  
  

  return (
    <>
      <Head>
        <title>TAD Minting & Selling</title>
        <meta name="description" content="" />
      </Head>

      <LayoutOne>
        <main className="fix">
          <Banner />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              marginBottom: "20vh",
              marginTop: "8vh",
            }}
          >
            <div className="App">
              <h1></h1>
              {!address ? (
                 <div>
                 <button onClick={() => connectWallet({ walletoption: "Metamask" })}>
                   Connect With Metamask
                 </button>
                 <button  onClick={() => connectWallet({ walletoption: "Walletconnect" })}>
                   Connect With WalletConnect
                 </button>
               </div>
              ) : (
                <div>
                  <p>Connected Address: {address}</p>
                  <p>USDC Assets: {totalAssets}</p>
                  <p>All Holdings (6 Demicals): {tadBalance}</p>
                  <p>Asset Address: {assetAddress}</p>
                  <p>Vault Name: {vaultName}</p>
                  <p>TAD Address: {TADContractAddress}</p>
                  {/* <p>Vault Owner: {vaultOwner}</p> */}
                  <button onClick={distributerewards}>Distribute Rewards</button>
                </div>
              )}
            </div>
          </div>

         

          <div className="area-bg">
           
          </div>
        </main>
      </LayoutOne>

      <ToastContainer />

     
    </>
  );
}
