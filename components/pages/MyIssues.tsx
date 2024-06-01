import React, { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";

interface ReceivedIssue {
  cid: string;
  fileName: string;
}

interface IssueDetails {
  issuer: string;
  title: string;
  description: string;
  date: string;
}

const MyIssues: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [issues, setIssues] = useState<
    {
      id: number;
      title: string;
      description: string;
      date: string;
      issuerAddr: string;
    }[]
  >([]);
  const [listedIssues, setListedIssues] = useState<ReceivedIssue[]>([]);
  const [listedIssueDetails, setListedIssueDetails] = useState<{
    [key: string]: IssueDetails;
  }>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issuerAddr, setIssuerAddr] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 4;

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads(
        "e76d4258.30b9dad0c8b44f7a9555e177270348c3"
      );
      return response.data.fileList;
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return [];
    }
  };

  const fetchListedIssueDetails = async (cid: string) => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );
      const data = response.data;

      const issuerMatch = data.match(/Issuer:\s*(.*)/);
      const titleMatch = data.match(/Title:\s*(.*)/);
      const descriptionMatch = data.match(/Description:\s*(.*)/);
      const dateMatch = data.match(/Date:\s*(.*)/);

      if (issuerMatch && titleMatch && descriptionMatch && dateMatch) {
        const issueDetails: IssueDetails = {
          issuer: issuerMatch[1],
          title: titleMatch[1],
          description: descriptionMatch[1],
          date: dateMatch[1],
        };

        setListedIssueDetails((prevDetails) => ({
          ...prevDetails,
          [cid]: issueDetails,
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch details for CID ${cid}:`, error);
      setListedIssueDetails((prevDetails) => ({
        ...prevDetails,
        [cid]: {
          issuer: "Unknown",
          title: "Failed to fetch data",
          description: "Failed to fetch data",
          date: "Failed to fetch data",
        },
      }));
    }
  };

  const fetchListedIssues = async () => {
    const issueList = await getUploads();
    setListedIssues(issueList);
    issueList.forEach((issue: ReceivedIssue) => {
      fetchListedIssueDetails(issue.cid);
    });
  };

  useEffect(() => {
    fetchListedIssues();
  }, []);

  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length === 0) {
          throw new Error("No accounts returned from Wallet.");
        }
        const signerAddress = accounts[0];
        setIssuerAddr(signerAddress);
        const { message } = (await lighthouse.getAuthMessage(signerAddress))
          .data;
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, signerAddress],
        });
        return { signature, signerAddress };
      } catch (error) {
        console.error("Error signing message with Wallet", error);
        return null;
      }
    } else {
      console.log("Please install Wallet!");
      return null;
    }
  };

  const uploadIssue = async (text: string, name: string) => {
    try {
      const response = await lighthouse.uploadText(
        text,
        "e76d4258.30b9dad0c8b44f7a9555e177270348c3",
        name
      );
      return response.data.Hash;
    } catch (error) {
      console.error("Error uploading issue:", error);
      setUploadError("Failed to upload issue. Please try again.");
      throw error;
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTitle("");
    setDescription("");
    setUploadError(null);
  };

  const handleSubmit = async () => {
    const authResponse = await signAuthMessage();
    if (!authResponse) return;

    const date = new Date().toDateString();
    const text = `Issuer: ${authResponse.signerAddress}\nTitle: ${title}\nDescription: ${description}\nDate: ${date}`;
    try {
      const cid = await uploadIssue(text, "issue_details");
      const newIssue = {
        id: cid,
        title,
        description,
        date,
        issuerAddr: authResponse.signerAddress,
      };
      setIssues([...issues, newIssue]);
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting issue:", error);
    }
  };

  const handleDelete = (id: number) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  // Pagination logic
  const filteredIssues = listedIssues.filter(listedIssue => listedIssueDetails[listedIssue.cid]?.issuer && listedIssueDetails[listedIssue.cid]?.title && listedIssueDetails[listedIssue.cid]?.description);
  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-semibold m-4 text-purple-700">
          MY ISSUES
        </h1>
        <button
          className="relative m-4  w-[15%] border border-violet-900 bg-gradient-to-r from-violet-900 to-purple-400 text-white font-semibold  rounded-lg shadow transition-shadow duration-300 hover:shadow-none"
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

      <ul className="">
        {currentIssues.map(
          (displayIssue) =>
            listedIssueDetails[displayIssue.cid]?.title &&
            listedIssueDetails[displayIssue.cid]?.description &&
            listedIssueDetails[displayIssue.cid]?.issuer && (
              <li
                key={displayIssue.cid}
                className="border p-3 m-2 bg-white hover:shadow-lg cursor-pointer rounded-xl"
                // onClick={() => handleFileClick(listedIssueDetails[displayIssue.cid])}
              >
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between">
                    <p className="text-xl font-semibold">
                      {listedIssueDetails[displayIssue.cid]?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Issuer: {listedIssueDetails[displayIssue.cid]?.issuer}
                    </p>
                  </div>
                  <p className="text-lg">
                    {listedIssueDetails[displayIssue.cid]?.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {listedIssueDetails[displayIssue.cid]?.date}
                  </p>
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
        )}
      </ul>

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
                className="bg-violet-900 text-white font-semibold py-2 px-6 rounded-full "
              >
                Submit
              </button>
            </div>
            {uploadError && <p className="text-red-500 mt-4">{uploadError}</p>}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-purple-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyIssues;
