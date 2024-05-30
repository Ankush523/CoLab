import React, { useEffect, useState } from "react";
import lighthouse from '@lighthouse-web3/sdk';
import axios from "axios";

interface ReceivedFile {
  cid: string;
  fileName: string;
}

interface FileDetails {
  from: string;
  subject: string;
  body: string;
  cid?: string;  // CID is optional
}

const ReceivedMails: React.FC = () => {
  const [files, setFiles] = useState<ReceivedFile[]>([]);
  const [fileDetails, setFileDetails] = useState<{ [key: string]: FileDetails }>({});
  const [selectedFile, setSelectedFile] = useState<FileDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads(
        "d57a600d.6d80c1a46f5f4ead82a7062d26cebca0"
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
  
      const fromMatch = data.match(/From:\s*(.*)/);
      const subjectMatch = data.match(/Subject:\s*(.*)/);
      const bodyMatch = data.match(/Body:\s*([\s\S]*?)(?:\nFile CID is (.*))?$/);
  
      if (fromMatch && subjectMatch && bodyMatch) {
        const fileDetails: FileDetails = {
          from: fromMatch[1],
          subject: subjectMatch[1],
          body: bodyMatch[1],
          cid: bodyMatch[2]?.trim(),
        };
  
        setFileDetails((prevDetails) => ({
          ...prevDetails,
          [cid]: fileDetails,
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch details for CID ${cid}:`, error);
      setFileDetails((prevDetails) => ({
        ...prevDetails,
        [cid]: { from: 'Unknown', subject: 'Failed to fetch data', body: 'Failed to fetch data' },
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

  const handleFileClick = (file: FileDetails) => {
    setSelectedFile(file);
  };

  const handleCloseDialog = () => {
    setSelectedFile(null);
  };

  const downloadFile = async (cid: string, fileName: string) => {
    try {
      const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download the file:', error);
    }
  };

  return (
    <div>
      {/* <h2 className="text-2xl font-semibold mb-4">Received</h2> */}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="divide-y divide-gray-200 border border-gray-300 rounded-xl">
        {files.map((file) => (
          fileDetails[file.cid]?.from && fileDetails[file.cid]?.subject && fileDetails[file.cid]?.body && (
            <li
              key={file.cid}
              className="p-4 hover:bg-gray-100 cursor-pointer rounded-xl"
              onClick={() => handleFileClick(fileDetails[file.cid])}
            >
              <div className="grid grid-cols-3 gap-4">
                <p className="truncate">From: {fileDetails[file.cid]?.from}</p>
                <p className="truncate">Subject: {fileDetails[file.cid]?.subject}</p>
                <p className="truncate">Body: {fileDetails[file.cid]?.body}</p>
              </div>
              {/* <a
                href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View File
              </a> */}
            </li>
          )
        ))}
      </ul>

      {selectedFile && (
        <div className="fixed right-[-15%] inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-1/3"
            style={{ boxShadow: "8px 8px 0px 0px black" }}
          >
            <h2 className="text-2xl font-semibold mb-4">Mail Details</h2>
            <p className="text-lg mb-2"><strong>From:</strong> {selectedFile.from}</p>
            <p className="text-lg mb-2"><strong>Subject:</strong> {selectedFile.subject}</p>
            <p className="text-lg mb-2"><strong>Body:</strong> {selectedFile.body}</p>
            {selectedFile.cid && (
              <>
                <p className="text-lg mb-2"><strong>Attachment:</strong></p>
                <ul className="list-disc ml-6 mb-2">
                  <li>
                    <button
                      onClick={() => downloadFile(selectedFile.cid!, selectedFile.cid!)}
                      className="text-blue-500 underline"
                    >
                      Download Attachment
                    </button>
                  </li>
                </ul>
              </>
            )}
            <button
              onClick={handleCloseDialog}
              className="mt-4 bg-purple-700 text-white font-semibold py-2 px-8 rounded-full hover:bg-purple-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedMails;

//e76d4258.30b9dad0c8b44f7a9555e177270348c3