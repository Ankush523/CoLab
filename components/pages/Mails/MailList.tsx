import React, { useState } from "react";

interface Mail {
  id: number;
  to: string;
  subject: string;
  body: string;
  attachments: File[];
}

interface MailListProps {
  mails: Mail[];
  title: string;
}

const MailList: React.FC<MailListProps> = ({ mails, title }) => {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const handleMailClick = (mail: Mail) => {
    setSelectedMail(mail);
  };

  const handleCloseDialog = () => {
    setSelectedMail(null);
  };

  return (
    <div className="p-4">
      <ul className="divide-y divide-gray-200 border border-gray-300 rounded-xl">
        {mails.map((mail) => (
          <li
            key={mail.id}
            className="p-4 hover:bg-gray-100 cursor-pointer rounded-xl"
            onClick={() => handleMailClick(mail)}
          >
            <div className="grid grid-cols-3 gap-4">
              <p className="truncate">To: {mail.to}</p>
              <p className="truncate">Sub: {mail.subject}</p>
              <p className="truncate">
                Body:{" "}
                {mail.body.length > 15
                  ? `${mail.body.slice(0, 15)}...`
                  : mail.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {selectedMail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-1/3"
            style={{ boxShadow: "8px 8px 0px 0px black" }}
          >
            <h2 className="text-2xl font- mb-4">Mail Details</h2>
            <p className="text-lg mb-2">To:{selectedMail.to}</p>
            <p className="text-lg mb-2">Subject: {selectedMail.subject}</p>
            <p className="text-lg mb-2">Body: {selectedMail.body}</p>
            Attachments:
            <ul className="list-disc ml-6 mb-2">
              {selectedMail.attachments.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
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

export default MailList;
