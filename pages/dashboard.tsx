// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import code from "@/images/code.png";
// import home from "@/images/home.png";
// import myissues from "@/images/issues.png";
// import mails from "@/images/mails.png";
// import rewards from "@/images/rewards.png";
// import profile from "@/images/profile.png";
// import bookings from "@/images/bookings.png";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

// // Import the page components
// import Home from "@/components/pages/Home";
// import MyIssues from "@/components/pages/MyIssues";
// import Mails from "@/components/pages/mails/Mails";
// import Rewards from "@/components/pages/Rewards";
// import Profile from "@/components/pages/Profile";
// import Bookings from "@/components/pages/Bookings";

// // Define the type for page names
// type PageName = "Home" | "My Issues" | "Mails" | "Bookings" | "Rewards" | "Profile";

// const pageComponents: { [key in PageName]: React.ComponentType } = {
//   Home: Home,
//   "My Issues": MyIssues,
//   Mails: Mails,
//   Bookings: Bookings,
//   Rewards: Rewards,
//   Profile: Profile,
// };

// const Dashboard = () => {
//   const router = useRouter();
//   const [activePage, setActivePage] = useState<PageName>("Home");
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (router.query.tab) {
//       setActivePage("Mails");
//     }
//   }, [router.query.tab]);

//   const handleHomeClick = () => {
//     setActivePage("Home");
//     router.push("/dashboard");
//   };

//   const ActiveComponent = pageComponents[activePage];

//   return (
//     <div className="flex flex-row bg-white h-screen text-black">
//       <div className="flex flex-col w-[15%] border border-r-purple-200 bg-purple-50 px-4">
//         <div className="flex flex-row space-x-2 mt-6 ">
//           <Image src={code} width={40} height={40} alt={""} />
//           <label className="mt-2 text-2xl font-semibold text-purple-700">
//             CoLab
//           </label>
//         </div>
//         <div
//           className="flex flex-row space-x-4 mt-[20%] mb-5 cursor-pointer"
//           onClick={handleHomeClick}
//         >
//           <Image src={home} width={30} height={30} alt={""} />
//           <label className="font-semibold text-gray-800 mt-1">Home</label>
//         </div>
//         <div
//           className="flex flex-row space-x-4 mb-5 pb-5 cursor-pointer border-b border-b-gray-800"
//           onClick={() => setActivePage("My Issues")}
//         >
//           <Image src={myissues} width={30} height={30} alt={""} />
//           <label className="font-semibold text-gray-800 mt-1">My Issues</label>
//         </div>
//         <div
//           className="flex flex-row space-x-4 mb-5 cursor-pointer"
//           onClick={() => setActivePage("Mails")}
//         >
//           <Image src={mails} width={30} height={30} alt={""} />
//           <label className="font-semibold text-gray-800 mt-1">Mails</label>
//         </div>

//         <div
//           className="flex flex-row space-x-4 mb-5 cursor-pointer"
//           onClick={() => setActivePage("Bookings")}
//         >
//           <Image src={bookings} width={30} height={30} alt={""} />
//           <label className="font-semibold text-gray-800 mt-1">Bookings</label>
//         </div>

//         <div
//           className="flex flex-row space-x-4 mb-5 pb-5 cursor-pointer border-b border-b-gray-800"
//           onClick={() => setActivePage("Rewards")}
//         >
//           <Image src={rewards} width={30} height={30} alt={""} />
//           <label className="font-semibold text-gray-800 mt-1">Rewards</label>
//         </div>
//         <div
//           className="flex flex-row space-x-4 mb-5 cursor-pointer"
//           onClick={() => setActivePage("Profile")}
//         >
//           <Image src={profile} width={30} height={30} alt={""} />
//           <label className="font-semibold text-gray-800 mt-1">Profile</label>
//         </div>
//       </div>

//       <div className="flex-1 py-6">
//         <div className="pb-6 border-b border-purple-200">
//           <div className="flex flex-row justify-end pr-6">
//             <ConnectButton />
//           </div>
//         </div>
//         {isClient ? <ActiveComponent /> : null}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import code from "@/images/code.png";
import home from "@/images/home.png";
import myissues from "@/images/issues.png";
import mails from "@/images/mails.png";
import rewards from "@/images/rewards.png";
import profile from "@/images/profile.png";
import bookings from "@/images/bookings.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Import the page components
import Home from "@/components/pages/Home";
import MyIssues from "@/components/pages/MyIssues";
import Mails from "@/components/pages/mails/Mails";
import Rewards from "@/components/pages/Rewards";
import Profile from "@/components/pages/Profile";
import Bookings from "@/components/pages/Bookings";

// Define the type for page names
type PageName = "Home" | "My Issues" | "Mails" | "Bookings" | "Rewards" | "Profile";

const pageComponents: { [key in PageName]: React.ComponentType<any> } = {
  Home: Home,
  "My Issues": MyIssues,
  Mails: Mails,
  Bookings: Bookings,
  Rewards: Rewards,
  Profile: Profile,
};

const Dashboard = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState<PageName>("Home");
  const [isClient, setIsClient] = useState(false);
  const [selectedIssueDetails, setSelectedIssueDetails] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (router.query.tab) {
      setActivePage("Mails");
    }
  }, [router.query.tab]);

  const handleHomeClick = () => {
    setActivePage("Home");
    router.push("/dashboard");
  };

  const handleScheduleMeet = (issueDetails: any) => {
    setSelectedIssueDetails(issueDetails);
    setActivePage("Bookings");
  };

  const ActiveComponent = pageComponents[activePage];

  return (
    <div className="flex flex-row bg-white h-screen text-black">
      <div className="flex flex-col w-[15%] border border-r-purple-200 bg-purple-50 px-4">
        <div className="flex flex-row space-x-2 mt-6 ">
          <Image src={code} width={40} height={40} alt={""} />
          <label className="mt-2 text-2xl font-semibold text-purple-700">
            CoLab
          </label>
        </div>
        <div
          className="flex flex-row space-x-4 mt-[20%] mb-5 cursor-pointer"
          onClick={handleHomeClick}
        >
          <Image src={home} width={30} height={30} alt={""} />
          <label className="font-semibold text-gray-800 mt-1">Home</label>
        </div>
        <div
          className="flex flex-row space-x-4 mb-5 pb-5 cursor-pointer border-b border-b-gray-800"
          onClick={() => setActivePage("My Issues")}
        >
          <Image src={myissues} width={30} height={30} alt={""} />
          <label className="font-semibold text-gray-800 mt-1">My Issues</label>
        </div>
        <div
          className="flex flex-row space-x-4 mb-5 cursor-pointer"
          onClick={() => setActivePage("Mails")}
        >
          <Image src={mails} width={30} height={30} alt={""} />
          <label className="font-semibold text-gray-800 mt-1">Mails</label>
        </div>

        <div
          className="flex flex-row space-x-4 mb-5 cursor-pointer"
          onClick={() => setActivePage("Bookings")}
        >
          <Image src={bookings} width={30} height={30} alt={""} />
          <label className="font-semibold text-gray-800 mt-1">Bookings</label>
        </div>

        <div
          className="flex flex-row space-x-4 mb-5 pb-5 cursor-pointer border-b border-b-gray-800"
          onClick={() => setActivePage("Rewards")}
        >
          <Image src={rewards} width={30} height={30} alt={""} />
          <label className="font-semibold text-gray-800 mt-1">Rewards</label>
        </div>
        <div
          className="flex flex-row space-x-4 mb-5 cursor-pointer"
          onClick={() => setActivePage("Profile")}
        >
          <Image src={profile} width={30} height={30} alt={""} />
          <label className="font-semibold text-gray-800 mt-1">Profile</label>
        </div>
      </div>

      <div className="flex-1 py-6">
        <div className="pb-6 border-b border-purple-200">
          <div className="flex flex-row justify-end pr-6">
            <ConnectButton />
          </div>
        </div>
        {isClient ? <ActiveComponent onScheduleMeet={handleScheduleMeet} selectedIssueDetails={selectedIssueDetails} /> : null}
      </div>
    </div>
  );
};

export default Dashboard;
