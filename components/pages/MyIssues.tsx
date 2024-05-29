import React, { useState } from 'react';

const MyIssues: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [issues, setIssues] = useState<{ id: number; title: string; description: string }[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleSubmit = () => {
    const newIssue = {
      id: issues.length + 1,
      title,
      description,
    };
    setIssues([...issues, newIssue]);
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  return (
    <div className="p-4">
      <div className='flex flex-col items-center justify-center'>
        <h1 className=" text-3xl font-semibold mb-4 text-violet-700">My Issues</h1>
        <button
            className="relative mt-4 w-[30%] border border-violet-900 bg-gradient-to-r from-violet-900 to-purple-400 text-white font-semibold py-2 px-4 rounded-lg shadow transition-shadow duration-300 hover:shadow-none"
            style={{ boxShadow: "5px 5px 0px 0px black" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "none")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "5px 5px 0px 0px black")
            }
            onClick={handleOpenDialog}
          >
        Add an Issue
      </button>
      </div>
      

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] ml-[15%]">
            <h2 className="text-xl font-semibold mb-4">Create New Issue</h2>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full mt-1 border border-gray-300 rounded-lg p-2"
              />
            </label>
            <label className="block mb-4">
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full mt-1 border border-gray-300 rounded-lg p-2"
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDialog}
                className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-violet-900 text-white font-semibold py-2 px-6 rounded-full ">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="mt-[5%] space-y-4">
        {issues.map((issue) => (
          <li key={issue.id} className="border blood-black p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{issue.title}</h3>
              <p>{issue.description}</p>
            </div>
            <button
              onClick={() => handleDelete(issue.id)}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyIssues;
