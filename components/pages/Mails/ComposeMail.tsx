// import React, { useState } from "react";
// import lighthouse from '@lighthouse-web3/sdk';

// interface ComposeMailProps {
//   onSend: (mail: {
//     id: number;
//     to: string;
//     subject: string;
//     body: string;
//     attachments: File[];
//   }) => void;
// }

// const ComposeMail: React.FC<ComposeMailProps> = ({ onSend }) => {
//   const [to, setTo] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");
//   const [attachments, setAttachments] = useState<File[]>([]);

//   const progressCallback = (progressData: { total: number; uploaded: number }) => {
//     const percentageDone = 100 - Math.round((progressData.uploaded / progressData.total) * 100);
//     console.log(percentageDone);
//   };

//   const uploadFile = async(file: File) => {
//     const output = await lighthouse.upload(file, "7946a66c.09067d51fce34114a34bc9bfe2456bb5", true, undefined, progressCallback);
//     console.log('File Status:', output.data?.Hash);
//     console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data?.Hash);
//     return output.data?.Hash;
//   }
  
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files);
//       setAttachments([...attachments, ...filesArray]);
      
//       for (const file of filesArray) {
//         const cid = await uploadFile(file);
//         setBody((prevBody) => `File Id is ${cid}`);
//       }
//     }
//   };
  
//   const handleSubmit = () => {
//     const newMail = {
//       id: Date.now(),
//       to,
//       subject,
//       body,
//       attachments,
//     };
//     onSend(newMail);
//     setTo("");
//     setSubject("");
//     setBody("");
//     setAttachments([]);
//   };
  
//   return (
//     <div className="flex flex-col items-center">
//       <div
//         className="border border-black mt-[5%] w-[30%] p-4 rounded-xl"
//         style={{ boxShadow: "8px 8px 0px 0px black" }}
//         >
//         <h2 className="text-xl mb-4">Compose Mail</h2>
//         <form
//           className="flex flex-col"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSubmit();
//           }}
//           >
//           <label className="text-sm">To:</label>
//           <input
//             type="text"
//             value={to}
//             className="p-2 border border-gray-300 rounded-lg mb-3"
//             onChange={(e) => setTo(e.target.value)}
//             required
//             />

//           <label className="text-sm">Subject:</label>
//           <input
//             className="p-2 border border-gray-300 rounded-lg mb-3"
//             type="text"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             required
//             />

//           <label className="text-sm">Body:</label>
//           <textarea
//             className="p-2 border border-gray-300 rounded-lg mb-3 h-[100px]"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             required
//             />

//           <label className="text-sm">Attachments:</label>
//           <input className="" type="file" multiple onChange={handleFileChange} />

//           <button
//             className="relative mt-4 w-full border border-violet-900 bg-gradient-to-r from-violet-900 to-purple-400 text-white font-semibold py-2 px-4 rounded-lg shadow transition-shadow duration-300 hover:shadow-none"
//             style={{ boxShadow: "5px 5px 0px 0px black" }}
//             onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "none")}
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.boxShadow = "5px 5px 0px 0px black")
//             }
//             type="submit"
//             >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ComposeMail;

//7946a66c.09067d51fce34114a34bc9bfe2456bb5

import React, { useState } from "react";
import lighthouse from '@lighthouse-web3/sdk';

interface ComposeMailProps {
  onSend: (mail: {
    id: number;
    to: string;
    subject: string;
    body: string;
    attachments: File[];
  }) => void;
}

const ComposeMail: React.FC<ComposeMailProps> = ({ onSend }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const progressCallback = (progressData: { total: number; uploaded: number }) => {
    const percentageDone = 100 - Math.round((progressData.uploaded / progressData.total) * 100);
    console.log(`Upload Progress: ${percentageDone}%`);
  };

  const uploadFile = async (file: File) => {
    try {
      const output = await lighthouse.upload(file, "7946a66c.09067d51fce34114a34bc9bfe2456bb5", true, undefined, progressCallback);
      console.log('File Status:', output.data?.Hash);
      console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data?.Hash);
      return output.data?.Hash;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray]);

      try {
        for (const file of filesArray) {
          const cid = await uploadFile(file);
          setBody((prevBody) => `File CID is ${cid}`);
        }
      } catch (error) {
        console.error('Error handling file change:', error);
      }
    }
  };

  const uploadText = async (text: string, name: string) => {
    try {
      const response = await lighthouse.uploadText(text, "7946a66c.09067d51fce34114a34bc9bfe2456bb5", name);
      console.log('Text Status:', response.data?.Hash);
      console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + response.data?.Hash);
      return response.data?.Hash;
    } catch (error) {
      console.error('Error uploading text:', error);
      setUploadError('Failed to upload text. Please try again.');
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      const text = `To: ${to}\nSubject: ${subject}\nBody: ${body}`;
      const textCid = await uploadText(text, "mail_content");
      const newBody = `Mail content uploaded: https://gateway.lighthouse.storage/ipfs/${textCid}`;

      const newMail = {
        id: Date.now(),
        to,
        subject,
        body: newBody,
        attachments,
      };
      onSend(newMail);
      setTo("");
      setSubject("");
      setBody("");
      setAttachments([]);
    } catch (error) {
      console.error('Error submitting mail:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="border border-black mt-[5%] w-[30%] p-4 rounded-xl"
        style={{ boxShadow: "8px 8px 0px 0px black" }}
      >
        <h2 className="text-xl mb-4">Compose Mail</h2>
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="text-sm">To:</label>
          <input
            type="text"
            value={to}
            className="p-2 border border-gray-300 rounded-lg mb-3"
            onChange={(e) => setTo(e.target.value)}
            required
          />

          <label className="text-sm">Subject:</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-3"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <label className="text-sm">Body:</label>
          <textarea
            className="p-2 border border-gray-300 rounded-lg mb-3 h-[100px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />

          <label className="text-sm">Attachments:</label>
          <input className="" type="file" multiple onChange={handleFileChange} />

          <button
            className="relative mt-4 w-full border border-violet-900 bg-gradient-to-r from-violet-900 to-purple-400 text-white font-semibold py-2 px-4 rounded-lg shadow transition-shadow duration-300 hover:shadow-none"
            style={{ boxShadow: "5px 5px 0px 0px black" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "none")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "5px 5px 0px 0px black")
            }
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComposeMail;
