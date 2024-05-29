import React, { useState } from "react";
import { ethers } from "ethers";
import lighthouse from '@lighthouse-web3/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  interface Window {
    ethereum?: any;
  }
}


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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const signAuthMessage = async (publicKey: string, privateKey: string | undefined) => {
    if (!privateKey) {
      throw new Error("Private key is not defined in environment variables");
    }

    const provider = new ethers.providers.JsonRpcProvider();
    const signer = new ethers.Wallet(privateKey, provider);
    const messageRequested : any = (await lighthouse.getAuthMessage(publicKey)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    return signedMessage;
  };

  const handleShareFile = async (cid: string) => {
    try {
      const publicKey = "0x5D62F371206306F1ebd4573803F70772f1153186";
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

      const signedMessage = await signAuthMessage(publicKey, privateKey);
      const receiverPublicKey = ["0xea447D81825282D3ec02772f1ab045ec6227F3e4"];
      const shareResponse = await lighthouse.shareFile(
        publicKey,
        receiverPublicKey,
        cid,
        signedMessage
      );

      console.log(shareResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    // Simulate CID for the example
    const cid = "QmS2NzycJoA7De33qMWwqyE2w3BL1i396qfwZiHBb1KuZh";

    // Share the file before sending the mail
    await handleShareFile(cid);

    const newMail = {
      id: Date.now(),
      to,
      subject,
      body,
      attachments,
    };
    onSend(newMail);
    setTo("");
    setSubject("");
    setBody("");
    setAttachments([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="border border-black mt-[5%] w-[30%] p-4 rounded-xl"
        style={{ boxShadow: "8px 8px 0px 0px black" }}
      >
        <h2 className="text-xl mb-4">Compose Mail</h2>
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
