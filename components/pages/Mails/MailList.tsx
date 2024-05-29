// import React, { useState } from "react";

// interface Mail {
//   id: number;
//   to: string;
//   subject: string;
//   body: string;
//   attachments: File[];
// }

// interface MailListProps {
//   mails: Mail[];
//   title: string;
// }

// const MailList: React.FC<MailListProps> = ({ mails, title }) => {
//   const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

//   const handleMailClick = (mail: Mail) => {
//     setSelectedMail(mail);
//   };

//   const handleCloseDialog = () => {
//     setSelectedMail(null);
//   };

//   return (
//     <div className="p-4">
//       <ul className="divide-y divide-gray-200 border border-gray-300 rounded-xl">
//         {mails.map((mail) => (
//           <li
//             key={mail.id}
//             className="p-4 hover:bg-gray-100 cursor-pointer rounded-xl"
//             onClick={() => handleMailClick(mail)}
//           >
//             <div className="grid grid-cols-3 gap-4">
//               <p className="truncate">To: {mail.to}</p>
//               <p className="truncate">Sub: {mail.subject}</p>
//               <p className="truncate">
//                 Body:{" "}
//                 {mail.body.length > 15
//                   ? `${mail.body.slice(0, 40)}...`
//                   : mail.body}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {selectedMail && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//           <div
//             className="bg-white p-6 rounded-lg shadow-lg w-1/3"
//             style={{ boxShadow: "8px 8px 0px 0px black" }}
//           >
//             <h2 className="text-2xl font- mb-4">Mail Details</h2>
//             <p className="text-lg mb-2">To:{selectedMail.to}</p>
//             <p className="text-lg mb-2">Subject: {selectedMail.subject}</p>
//             <p className="text-lg mb-2">Body: {selectedMail.body}</p>
//             Attachments:
//             <ul className="list-disc ml-6 mb-2">
//               {selectedMail.attachments.map((file, index) => (
//                 <li key={index}>{file.name}</li>
//               ))}
//             </ul>
//             <button
//               onClick={handleCloseDialog}
//               className="mt-4 bg-purple-700 text-white font-semibold py-2 px-8 rounded-full hover:bg-purple-500"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MailList;

import React, { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";

interface ReceivedFile {
  cid: string;
  // other properties as required
}

const ReceivedMails: React.FC = () => {
  const [files, setFiles] = useState<ReceivedFile[]>([]);
  const [fileDetails, setFileDetails] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads(
        "7946a66c.09067d51fce34114a34bc9bfe2456bb5"
      );
      return response.data.fileList;
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return [];
    }
  };

  const fetchFileDetails = async (cid: string) => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );
      const data = response.data;
  
      const toMatch = data.match(/To:\s*(.*)/);
      const subjectMatch = data.match(/Subject:\s*(.*)/);
      const bodyMatch = data.match(/Body:\s*(.*)/);
  
      const fileDetails = {
        to: toMatch ? toMatch[1] : 'Unknown',
        subject: subjectMatch ? subjectMatch[1] : 'No Subject',
        body: bodyMatch ? bodyMatch[1] : 'No Body',
        cid: cid,
      };
  
      setFileDetails((prevDetails: any) => ({
        ...prevDetails,
        [cid]: fileDetails,
      }));
    } catch (error) {
      console.error(`Failed to fetch details for CID ${cid}:`, error);
      setFileDetails((prevDetails: any) => ({
        ...prevDetails,
        [cid]: { error: "Failed to fetch data" },
      }));
    }
  };

  const fetchFiles = async () => {
    const fileList: any = await getUploads();
    setFiles(fileList);
    fileList.forEach((file: any) => {
      fetchFileDetails(file.cid);
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Received Files</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="divide-y divide-gray-200 border border-gray-300 rounded-xl">
            {files.map((file: any) => (
            <li key={file.cid} className="p-4 hover:bg-gray-100 rounded-xl">
                <div className="grid grid-cols-3 gap-4">
                <p className="truncate">To: {fileDetails[file.cid]?.to}</p>
                <p className="truncate">Subject: {fileDetails[file.cid]?.subject}</p>
                <p className="truncate">Body: {fileDetails[file.cid]?.body}</p>
                </div>
                <a
                href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
                >
                View File
                </a>
            </li>
            ))}
        </ul>
    </div>
  );
};

export default ReceivedMails;
