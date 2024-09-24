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
import styles from "./App.module.css";


//======================== THIRD CONNECT ======================== //

import { useMetamask, useWalletConnect, useAddress, useNetwork, useSigner } from "@thirdweb-dev/react";





//=============================================================== //


const TADContractAddress = "0xe5f744F7CD4f21BE0Ce625CCE55479361C5a2380";
const USDCContractAddress = "0x03Ab8bEA53Cc1244CC33d7de0235F31F40dbb331";

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

  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try {
        const tx = await TADContract.distributeRewards();
        await tx.wait();
        toast.success("Rewards distributed successfully.");
      } catch (error) {
        const errorMessage = error.message.split('[')[0].trim();
        
        if (errorMessage === "cannot estimate gas; transaction may fail or may require manual gas limit") {
          toast.error("Connected wallet is not owner.");
        } else {
          toast.error("Failed to distribute rewards. " + errorMessage);
        }
      } finally {
        setIsLoading(false);
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

          <div className={styles.container} id="minting">
            {!address ? (
              <></>
            ) : (
              <div className={styles.sidebar}>
                <div className={styles.sidebarItem}>
                  <p>USDC Balance</p>
                  <h4>{totalAssets} USDC</h4>
                 
                </div>
                <div className={styles.sidebarItem}>
                  <p>All Holding (6 decimal):</p>
                  <h4 >{tadBalance} </h4>
                </div>
              </div>
            )}

            <div className={styles.appContent}>
              {!address ? (
                <div className = {styles.buttonholder}>
                  <img
                    src="\img\icon\polygon.png"
                    alt="Polygon Logo"
                    style={{ width: "60px", height: "auto", margin: "0px" }}
                  />
                  <p
                    style={{
                      color: "red",
                      textDecoration: "underline",
                      fontSize: "16px",
                    }}
                  >
                    Make sure Polygon is selected as your network.
                  </p>
                  <button
                    className="btn"
                    style={{
                      marginBottom: "5px",
                      position: "relative",
                      width: "80%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                    onClick={() => connectWallet({ walletoption: "Metamask" })}
                  >
                    <span
                      style={{
                        flexGrow: 1,
                       
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Connect With MetaMask
                    </span>
                    <img
                      src="/img/icon/metamask.png"
                      alt="MetaMask Logo"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginLeft: "0px",
                      }}
                    />
                  </button>

                  <button
                    className="btn"
                    style={{
                      position: "relative",
                      width: "90%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                    onClick={() =>
                      connectWallet({ walletoption: "Walletconnect" })
                    }
                  >
                    <span
                      style={{
                        flexGrow: 1,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Connect With WalletConnect
                    </span>
                    <img
                      src="/img/icon/walletconnect.png"
                      alt="WalletConnect Logo"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginLeft: "0px",
                      }}
                    />
                  </button>
                </div>
              ) : (
                <div>
                  <p className={styles.paragraph}>
                    Connected Address: {address}
                  </p>
                  {/* <p className={styles.paragraph}>USDC Balance: {usdcBalance}</p>
            <p className={styles.paragraph}>TAD Balance: {tadBalance}</p> */}

                  <p className= {styles.paragraph}>Asset Address: {assetAddress}</p>
                  <p className= {styles.paragraph}>Vault Name:<br/> {vaultName}</p>
                  <p className= {styles.paragraph}>TAD Address: {TADContractAddress}</p>
                  {/* <p>Vault Owner: {vaultOwner}</p> */}
                  <button className = "btn" onClick={distributerewards}>Distribute Rewards</button>
                </div>
              )}
              {isLoading && (
                <p className={styles.loading}>TRANSACTION IN PROCESS...</p>
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
