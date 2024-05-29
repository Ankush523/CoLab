import React, { useEffect, useState } from "react";
import lighthouse from '@lighthouse-web3/sdk';

interface ReceivedFile {
  publicKey: string;
  fileName: string;
  mimeType: string;
  txHash: string;
  status: string;
  createdAt: number;
  fileSizeInBytes: string;
  cid: string;
  id: string;
  lastUpdate: number;
  encryption: boolean;
}

const ReceivedMails: React.FC = () => {
  const [files, setFiles] = useState<ReceivedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await lighthouse.getUploads("7946a66c.09067d51fce34114a34bc9bfe2456bb5");
        setFiles(response.data.fileList);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Failed to fetch files. Please try again.');
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Received Files</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="divide-y divide-gray-200 border border-gray-300 rounded-xl">
        {files.map((file) => (
          <li key={file.id} className="p-4 hover:bg-gray-100 rounded-xl">
            <div className="grid grid-cols-3 gap-4">
              <p className="truncate">File: {file.fileName}</p>
              <p className="truncate">CID: {file.cid}</p>
              <p className="truncate">Size: {file.fileSizeInBytes} bytes</p>
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
