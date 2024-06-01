import React, { useState, useEffect } from "react";
import lighthouse from '@lighthouse-web3/sdk';
import { useRouter } from 'next/router';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { addEnsContracts } from '@ensdomains/ensjs';
import { getOwner } from '@ensdomains/ensjs/public';
import { ethers } from "ethers";

interface ComposeMailProps {
  onSend: (mail: {
    id: number;
    to: string;
    subject: string;
    body: string;
    attachments: File[];
  }) => void;
  defaultTo?: string;
}

const ComposeMail: React.FC<ComposeMailProps> = ({ onSend, defaultTo }) => {
  const router = useRouter();
  const [to, setTo] = useState(defaultTo || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [senderAddress, setSenderAddress] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.to) {
      setTo(router.query.to as string);
    }
  }, [router.query.to]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length === 0) {
          throw new Error("No accounts returned from Wallet.");
        }
        const signerAddress = accounts[0];
        setSenderAddress(signerAddress);
        return signerAddress;
      } catch (error) {
        console.error("Error connecting to wallet", error);
        return null;
      }
    } else {
      console.log("Please install Wallet!");
      return null;
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  
  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        if (accounts.length === 0) {
          throw new Error("No accounts returned from Wallet.")
        }
        const signerAddress = accounts[0]
        setSenderAddress(signerAddress)
        const { message } = (await lighthouse.getAuthMessage(signerAddress)).data
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, signerAddress],
        })
        return { signature, signerAddress }
      } catch (error) {
        console.error("Error signing message with Wallet", error)
        return null
      }
    } else {
      console.log("Please install Wallet!")
      return null
    }
  }

  const progressCallback = (progressData: { total: number; uploaded: number }) => {
    const percentageDone = 100 - Math.round((progressData.uploaded / progressData.total) * 100);
    console.log(`Upload Progress: ${percentageDone}%`);
  };

  const uploadFile = async (file: File) => {
    try {
      const { signature, signerAddress }: any = await signAuthMessage();
      if (!signature || !signerAddress) {
        throw new Error("Failed to sign message");
      }
      const output: any = await lighthouse.upload(file, "2db3bf8f.1dd34afe207d45af9e2e1d6f0e1e2459", signerAddress, signature, progressCallback);
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
          setBody((prevBody) => `${prevBody}\nFile CID is ${cid}`);
        }
      } catch (error) {
        console.error('Error handling file change:', error);
      }
    }
  };

  const uploadText = async (text: string, name: string) => {
    try {
      const response = await lighthouse.uploadText(text, "2db3bf8f.1dd34afe207d45af9e2e1d6f0e1e2459", name);
      console.log('Text Status:', response.data?.Hash);
      console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + response.data?.Hash);
      return response.data?.Hash;
    } catch (error) {
      console.error('Error uploading text:', error);
      setUploadError('Failed to upload text. Please try again.');
      throw error;
    }
  };

  const ownerOfEnsName = async (name: string) => {
    const client = createPublicClient({
      chain: addEnsContracts(mainnet),
      transport: http(),
    });
    const result = await getOwner(client, { name });
    return result; // Directly return the owner address
  };

  const handleSubmit = async () => {
    if (!senderAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      let owningAddressObject: any = to;
      let owningAddress: string = to;
      if (to.endsWith('.eth')) {
        owningAddressObject = await ownerOfEnsName(to);
        owningAddress = owningAddressObject.owner;
        console.log('Owning Address:', owningAddressObject);
      }
      else {
        owningAddress = to;
      }
      const text = `From: ${senderAddress}\nTo: ${owningAddress}\nSubject: ${subject}\nBody: ${body}`;
      const textCid = await uploadText(text, "mail_content");
      const newBody = `${body}\nMail content uploaded: https://gateway.lighthouse.storage/ipfs/${textCid}`;

      const newMail = {
        id: Date.now(),
        to: owningAddress,
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
        className="border border-black mt-[5%] w-[30%] p-4 rounded-xl bg-white"
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
