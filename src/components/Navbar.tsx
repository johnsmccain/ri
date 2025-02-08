import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAccount } from "wagmi";

const Navbar = () => {
  // const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false)



  return (
    <div className="fixed h-16 top-0 left-0 right-0 w-full flex justify-between py-3 px-3 md:py-4 md:px-28 backdrop-blur-md z-40 ">
      <div className="my-auto">
        <div className="text-2xl md:text-4xl my-auto font-bold">
        <span className="text-2xl font-bold text-white"><span className="text-yellow-400">G</span>Rich</span>
        </div>
      </div>

      <div className="gap-2 flex max-sm:hidden">
        <ConnectButton />
      </div>

      {/* Mobile */}
      <div className="sm:hidden  flex items-center justify-center" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <MenuIcon size={25} className="text-white"/>
      </div>
      {
        isMenuOpen &&
        <div className="sm:hidden absolute top-16 bg-black w-full flex justify-center right-0">
          <div className="flex flex-col gap-10 p-9">
            {/* <button onClick={() => {navigate('/dashboard'); setIsMenuOpen(false)}} className="my-auto hover:bg-primary transition-colors hover:text-black text-white cursor-pointer  w-full">Dashboard</button>
            <button onClick={() => {navigate('/activities'); setIsMenuOpen(false)}} className="my-auto hover:bg-primary transition-colors hover:text-black text-white cursor-pointer w-full ">Activities</button>
            <button onClick={() => {navigate('/referals'); setIsMenuOpen(false)}} className="my-auto hover:bg-primary transition-colors hover:text-black text-white cursor-pointer  w-full">Referals</button> */}
            <div className="gap-2 flex " onClick={() => setIsMenuOpen(false)}>
              <ConnectButton />
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Navbar;