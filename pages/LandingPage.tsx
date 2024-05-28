import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import bgpick from "@/images/bgpick1.png";
import bgpick2 from "@/images/bgpick2.png";
import { useRouter } from "next/router";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen text-black relative">
      <Navbar />
      <div className="flex flex-row justify-around mt-[5%]">
        <div className="relative flex flex-col w-[30%] ml-[10%] mt-[10%]">
          <div className="absolute bg-purple-200 rounded-full w-[150%] h-[200%] top-[-50%] left-[-25%] filter blur-3xl"></div>
          <label className="relative text-7xl font-bold bg-gradient-to-r from-violet-900 via-pink-600 to-purple-400 inline-block text-transparent bg-clip-text">
            CoLab
          </label>
          <label className="relative text-2xl mt-2 mx-1 font-semibold text-purple-700">
            Unite to Debug
          </label>
          <label className="relative text-xl mt-4 text-gray-600">
            The ultimate platform for developers to join forces to solve code
            issues in real-time, using a shared code editor and custom virtual
            meet rooms.
          </label>
          <button
            onClick={() => router.push("/dashboard")}
            className="relative mt-8 w-[30%] border border-violet-900 bg-gradient-to-r from-violet-900 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow transition-shadow duration-300 hover:shadow-none"
            style={{ boxShadow: "5px 5px 0px 0px black" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "none")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "5px 5px 0px 0px black")
            }
          >
            Get Started
          </button>
        </div>

        <div className="flex flex-col w-[28%] mr-[10%] relative">
          <Image
            className="absolute top-[-10%] left-[-25%]"
            src={bgpick}
            width={400}
            height={500}
            alt={""}
          />
          <Image
            className="absolute top-52 left-52"
            src={bgpick2}
            width={400}
            height={500}
            alt={""}
          />
        </div>
      </div>

      <div className="flex flex-col ml-[15%] mt-[15%]">
        <h2 className="text-4xl font-bold text-violet-800 mb-4">
          Key Features
        </h2>
        <label className="text-xl">
          Discover the innovative features that make CoLab a standout solution
          for developer collaboration and code issue resolution.
        </label>
        <div className="mt-10 mb-[10%] w-[90%] flex flex-row justify-around space-x-[5%]">
          <div
            className="border border-black rounded-xl py-2 px-4"
            style={{ boxShadow: "8px 8px 0px 0px black" }}
          >
            <h3 className="text-xl mb-2 font-semibold text-purple-500">
              Instant Sync
            </h3>
            <p className="text-md text-gray-700">
              Synchronize code edits in real-time with our instant sync feature,
              ensuring all collaborators are always on the same page.
            </p>
          </div>
          <div
            className="border border-black rounded-xl py-2 px-4"
            style={{ boxShadow: "8px 8px 0px 0px black" }}
          >
            <h3 className="text-xl mb-2 font-semibold text-purple-500">
              Code Rooms
            </h3>
            <p className="text-md text-gray-700">
              Set up custom virtual rooms for focused problem-solving sessions
              with the right experts and team members.
            </p>
          </div>
          <div
            className="border border-black rounded-xl py-2 px-4"
            style={{ boxShadow: "8px 8px 0px 0px black" }}
          >
            <h3 className="text-xl mb-2 font-semibold text-purple-500">
              Live Chat
            </h3>
            <p className="text-md text-gray-700">
              Communicate effectively within the shared code editor using the
              integrated live chat feature for immediate feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
