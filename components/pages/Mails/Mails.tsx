import React, { useState } from 'react';
import ComposeMail from './ComposeMail';
import MailList from './MailList';
import ReceivedFiles from './ReceivedMails';

interface Mail {
  id: number;
  to: string;
  subject: string;
  body: string;
  attachments: File[];
}

const Mails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'sent' | 'received'>('compose');
  const [sentMails, setSentMails] = useState<Mail[]>([]);
  const [receivedMails, setReceivedMails] = useState<Mail[]>([]);

  const handleSendMail = (mail: Mail) => {
    setSentMails([...sentMails, mail]);
  };

  const handleReceiveMail = (mail: Mail) => {
    setReceivedMails([...receivedMails, mail]);
  }

  return (
    <div className='px-6 py-4'>
      <h1 className="text-3xl font-semibold mb-6 text-violet-700">Mails</h1>
      <div className="top-bar flex flex-row justify-around mb-6">
        <button
          onClick={() => setActiveTab('compose')}
          className={`text-xl font-semibold w-[30%] ${activeTab === 'compose' ? 'text-black bg-gray-200 py-2 rounded-xl' : 'text-gray-400'}`}
        >
          Compose
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`text-xl font-semibold w-[30%] ${activeTab === 'sent' ? 'text-black bg-gray-200 py-2 rounded-xl' : 'text-gray-400'}`}
        >
          Sent
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`text-xl font-semibold w-[30%] ${activeTab === 'received' ? 'text-black bg-gray-200 py-2 rounded-xl' : 'text-gray-400'}`}
        >
          Inbox
        </button>
      </div>

      <div className="content">
        {activeTab === 'compose' && <ComposeMail onSend={handleSendMail} />}
        {activeTab === 'sent' && <MailList/>}
        {activeTab === 'received' && <ReceivedFiles />}
      </div>
    </div>
  );
};

export default Mails;
