import React, { useState, useEffect } from 'react';
import ComposeMail from './ComposeMail';
import MailList from './MailList';
import ReceivedFiles from './ReceivedMails';
import { useRouter } from 'next/router';
import Image from 'next/image';
import compose from '@/images/compose.png';
import sent from '@/images/sent.png';
import inbox from '@/images/inbox.png';

interface Mail {
  id: number;
  to: string;
  subject: string;
  body: string;
  attachments: File[];
}

const Mails: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'compose' | 'sent' | 'received'>('compose');
  const [sentMails, setSentMails] = useState<Mail[]>([]);
  const [receivedMails, setReceivedMails] = useState<Mail[]>([]);
  const [defaultTo, setDefaultTo] = useState<string>("");

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab as 'compose' | 'sent' | 'received');
    }
    if (router.query.to) {
      setDefaultTo(router.query.to as any);
    }
  }, [router.query.tab, router.query.to]);

  const handleSendMail = (mail: Mail) => {
    setSentMails([...sentMails, mail]);
  };

  const handleReceiveMail = (mail: Mail) => {
    setReceivedMails([...receivedMails, mail]);
  };

  return (
    <div className='px-6 py-4'>
      <h1 className="text-2xl font-semibold mb-6 text-purple-700">MAILS</h1>
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
        {activeTab === 'compose' && <ComposeMail onSend={handleSendMail} defaultTo={defaultTo} />}
        {activeTab === 'sent' && <MailList />}
        {activeTab === 'received' && <ReceivedFiles />}
      </div>
    </div>
  );
};

export default Mails;
