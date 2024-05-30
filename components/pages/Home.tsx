// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import lighthouse from '@lighthouse-web3/sdk';

// interface ReceivedIssue {
//   cid: string;
//   fileName: string;
// }

// interface IssueDetails {
//   issuer: string;
//   title: string;
//   description: string;
//   date: string;
// }


// const Home = () => {

//   const [listedIssues, setListedIssues] = useState<ReceivedIssue[]>([]);
//   const [listedIssueDetails, setListedIssueDetails] = useState<{
//     [key: string]: IssueDetails;
//   }>({});

//   const getUploads = async () => {
//     try {
//       const response = await lighthouse.getUploads(
//         "e76d4258.30b9dad0c8b44f7a9555e177270348c3"
//       );
//       return response.data.fileList;
//     } catch (error) {
//       console.error("Failed to fetch files:", error);
//       return [];
//     }
//   };

//   const fetchListedIssueDetails = async (cid: string) => {
//     try {
//       const response = await axios.get(
//         `https://gateway.lighthouse.storage/ipfs/${cid}`
//       );
//       const data = response.data;

//       const issuerMatch = data.match(/Issuer:\s*(.*)/);
//       const titleMatch = data.match(/Title:\s*(.*)/);
//       const descriptionMatch = data.match(/Description:\s*(.*)/);
//       const dateMatch = data.match(/Date:\s*(.*)/);

//       if (issuerMatch && titleMatch && descriptionMatch && dateMatch) {
//         const issueDetails: IssueDetails = {
//           issuer: issuerMatch[1],
//           title: titleMatch[1],
//           description: descriptionMatch[1],
//           date: dateMatch[1],
//         };

//         setListedIssueDetails((prevDetails) => ({
//           ...prevDetails,
//           [cid]: issueDetails,
//         }));
//       }
//     } catch (error) {
//       console.error(`Failed to fetch details for CID ${cid}:`, error);
//       setListedIssueDetails((prevDetails) => ({
//         ...prevDetails,
//         [cid]: {
//           issuer: "Unknown",
//           title: "Failed to fetch data",
//           description: "Failed to fetch data",
//           date: "Failed to fetch data",
//         },
//       }));
//     }
//   };

//   const fetchListedIssues = async () => {
//     const issueList = await getUploads();
//     setListedIssues(issueList);
//     issueList.forEach((issue: ReceivedIssue) => {
//       fetchListedIssueDetails(issue.cid);
//     });
//   };

//   useEffect(() => {
//     fetchListedIssues();
//   }, []);

//   return (
//     <div className="p-4">
//       <div className="flex flex-row justify-between">
//         <h1 className="text-3xl font-semibold m-4 text-violet-700">
//           Featured Issues
//         </h1>
//       </div>

//       <div className="h-[75vh] overflow-y-auto">
//         <ul className="">
//           {listedIssues.map(
//             (displayIssue) =>
//               listedIssueDetails[displayIssue.cid]?.title &&
//               listedIssueDetails[displayIssue.cid]?.description &&
//               listedIssueDetails[displayIssue.cid]?.issuer && (
//                 <li
//                   key={displayIssue.cid}
//                   className="border p-3 m-2 hover:bg-gray-100 hover:shadow-lg cursor-pointer rounded-xl"
//                 >
//                   <div className="flex flex-col">
//                     <div className="flex flex-row justify-between">
//                       <p className="text-xl font-semibold">
//                         {listedIssueDetails[displayIssue.cid]?.title}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Issuer: {listedIssueDetails[displayIssue.cid]?.issuer}
//                       </p>
//                     </div>
//                     <div className='flex flex-row justify-between'>
//                       <div className='flex flex-col'>
//                         <p className="text-lg">
//                           {listedIssueDetails[displayIssue.cid]?.description}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Date: {listedIssueDetails[displayIssue.cid]?.date}
//                         </p>
//                       </div>
//                       <div className='flex flex-row space-x-2'>
//                       <button className='border border-white bg-purple-900 hover:bg-purple-500 my-2 px-4 rounded-md text-white shadow-md'>Email</button>
//                       <button className='border border-white bg-purple-900 hover:bg-purple-500 my-2 px-4 rounded-md text-white shadow-md'>Schedule Meet</button>
//                       </div>

//                     </div>
//                   </div>
//                 </li>
//               )
//           )}
//         </ul>
//       </div>
//     </div>
//   )
// }

// export default Home

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { useRouter } from 'next/router';

interface ReceivedIssue {
  cid: string;
  fileName: string;
}

interface IssueDetails {
  issuer: string;
  title: string;
  description: string;
  date: string;
}

const Home = () => {
  const router = useRouter();
  const [listedIssues, setListedIssues] = useState<ReceivedIssue[]>([]);
  const [listedIssueDetails, setListedIssueDetails] = useState<{
    [key: string]: IssueDetails;
  }>({});

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads(
        "e76d4258.30b9dad0c8b44f7a9555e177270348c3"
      );
      return response.data.fileList;
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return [];
    }
  };

  const fetchListedIssueDetails = async (cid: string) => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );
      const data = response.data;

      const issuerMatch = data.match(/Issuer:\s*(.*)/);
      const titleMatch = data.match(/Title:\s*(.*)/);
      const descriptionMatch = data.match(/Description:\s*(.*)/);
      const dateMatch = data.match(/Date:\s*(.*)/);

      if (issuerMatch && titleMatch && descriptionMatch && dateMatch) {
        const issueDetails: IssueDetails = {
          issuer: issuerMatch[1],
          title: titleMatch[1],
          description: descriptionMatch[1],
          date: dateMatch[1],
        };

        setListedIssueDetails((prevDetails) => ({
          ...prevDetails,
          [cid]: issueDetails,
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch details for CID ${cid}:`, error);
      setListedIssueDetails((prevDetails) => ({
        ...prevDetails,
        [cid]: {
          issuer: "Unknown",
          title: "Failed to fetch data",
          description: "Failed to fetch data",
          date: "Failed to fetch data",
        },
      }));
    }
  };

  const fetchListedIssues = async () => {
    const issueList = await getUploads();
    setListedIssues(issueList);
    issueList.forEach((issue: ReceivedIssue) => {
      fetchListedIssueDetails(issue.cid);
    });
  };

  useEffect(() => {
    fetchListedIssues();
  }, []);

  const handleEmailClick = (issuer: string) => {
    router.push({
      pathname: '/dashboard',
      query: { to: issuer, tab: 'compose' },
    });
  };

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold m-4 text-violet-700">
          Featured Issues
        </h1>
      </div>

      <div className="h-[75vh] overflow-y-auto">
        <ul className="">
          {listedIssues.map(
            (displayIssue) =>
              listedIssueDetails[displayIssue.cid]?.title &&
              listedIssueDetails[displayIssue.cid]?.description &&
              listedIssueDetails[displayIssue.cid]?.issuer && (
                <li
                  key={displayIssue.cid}
                  className="border p-3 m-2 hover:bg-gray-100 hover:shadow-lg cursor-pointer rounded-xl"
                >
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                      <p className="text-xl font-semibold">
                        {listedIssueDetails[displayIssue.cid]?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Issuer: {listedIssueDetails[displayIssue.cid]?.issuer}
                      </p>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <div className='flex flex-col'>
                        <p className="text-lg">
                          {listedIssueDetails[displayIssue.cid]?.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {listedIssueDetails[displayIssue.cid]?.date}
                        </p>
                      </div>
                      <div className='flex flex-row space-x-2'>
                      <button
                        className='border border-white bg-purple-900 hover:bg-purple-500 my-2 px-4 rounded-md text-white shadow-md'
                        onClick={() => handleEmailClick(listedIssueDetails[displayIssue.cid]?.issuer)}
                      >
                        Email
                      </button>
                      <button className='border border-white bg-purple-900 hover:bg-purple-500 my-2 px-4 rounded-md text-white shadow-md'>Schedule Meet</button>
                      </div>
                    </div>
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
