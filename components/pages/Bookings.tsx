import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import Image from "next/image";
import link from "@/images/link.png";
import Button from "@/components/Buttons";

interface ScheduledDetails {
  meetAgenda: string;
  meetHost: string;
  meetDescription: string;
  dateOfBooking: string;
  bookingDate: string;
  bookingTime: string;
}

interface ReceivedScheduledDetails {
  cid: string;
  fileName: string;
}

const Bookings = ({ selectedIssueDetails }: { selectedIssueDetails: any }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [scheduled, setScheduled] = useState<ReceivedScheduledDetails[]>([]);
  const [scheduledDetails, setScheduledDetails] = useState<{
    [key: string]: ScheduledDetails;
  }>({});
  const [roomIds, setRoomIds] = useState<{ [key: string]: string }>({});

  const handleBooking = async () => {
    if (!startDate || !selectedTime) return;

    const bookingDetails = `
      Issue Title: ${selectedIssueDetails.title}
      Issuer: ${selectedIssueDetails.issuer}
      Description: ${selectedIssueDetails.description}
      Date: ${selectedIssueDetails.date}
      Booking Date: ${startDate.toLocaleDateString()}
      Booking Time: ${selectedTime}
    `;

    try {
      const response = await lighthouse.uploadText(
        bookingDetails,
        "1ba598c2.68a73ccae51d4af9a08b39a00b02fa69",
        "booking_details"
      );
      console.log("Uploaded booking details CID:", response.data.Hash);
    } catch (error) {
      console.error("Failed to upload booking details:", error);
    }
  };

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads(
        "1ba598c2.68a73ccae51d4af9a08b39a00b02fa69"
      );
      return response.data.fileList;
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return [];
    }
  };

  const fetchScheduledDetails = async (cid: string) => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );
      const data = response.data;

      const issueTitleMatch = data.match(/Issue Title:\s*(.*)/);
      const issuerMatch = data.match(/Issuer:\s*(.*)/);
      const descriptionMatch = data.match(/Description:\s*(.*)/);
      const dateMatch = data.match(/Date:\s*(.*)/);
      const bookingDateMatch = data.match(/Booking Date:\s*(.*)/);
      const bookingTimeMatch = data.match(/Booking Time:\s*(.*)/);

      if (
        issueTitleMatch &&
        issuerMatch &&
        descriptionMatch &&
        dateMatch &&
        bookingDateMatch &&
        bookingTimeMatch
      ) {
        const scheduledDetails: ScheduledDetails = {
          meetAgenda: issueTitleMatch[1],
          meetHost: issuerMatch[1],
          meetDescription: descriptionMatch[1],
          dateOfBooking: dateMatch[1],
          bookingDate: bookingDateMatch[1],
          bookingTime: bookingTimeMatch[1],
        };

        setScheduledDetails((prevDetails) => ({
          ...prevDetails,
          [cid]: scheduledDetails,
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch details for CID ${cid}:`, error);
      setScheduledDetails((prevDetails) => ({
        ...prevDetails,
        [cid]: {
          meetAgenda: "Unknown",
          meetHost: "Unknown",
          meetDescription: "Unknown",
          dateOfBooking: "Unknown",
          bookingDate: "Unknown",
          bookingTime: "Unknown",
        },
      }));
    }
  };

  const fetchScheduled = async () => {
    const scheduledList: any = await getUploads();
    setScheduled(scheduledList);
    scheduledList.forEach((scheduled: any) => {
      fetchScheduledDetails(scheduled.cid);
    });
  };

  useEffect(() => {
    fetchScheduled();
  }, []);

  const createRoom = async (cid: string) => {
    const response: any = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        title: "Huddle01-Test",
        hostWallets: ["0xCF1E6Ab1949D0573362f5278FAbCa4Ec74BE913C"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "dqwg1L7ombeVA_WdaBrLD5zuGTGgLwkk",
        },
      }
    );
    console.log(response);
    console.log("Room id:", response?.data);
    setRoomIds((prevRoomIds) => ({
      ...prevRoomIds,
      [cid]: response?.data?.data?.roomId,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl text-purple-700 font-semibold mb-4">SCHEDULE CALL</h2>
      <div className="flex flex-col w-[40%] bg-white shadow-xl border p-4 rounded-xl">
        <div className="flex flex-row justify-around mb-4">
          <div className="flex flex-row space-x-4">
            <label className="my-2">Select Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              className="my-2 border border-gray-400 rounded w-[50%]"
            />
          </div>
          <div className="flex flex-row space-x-4">
            <label className="my-2">Select Time:</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="p-2 border rounded border-gray-400"
            />
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="bg-gradient-to-r from-violet-900 to-purple-500 border border-violet-900 mx-[30%] text-white px-4 py-2 rounded-full"
        >
          Confirm Booking
        </button>
      </div>

      <h2 className="text-2xl text-purple-700 font-semibold mt-8 mb-2">SCHEDULED CALLS</h2>
      <div className="bg-gray-50 py-4 rounded-xl">
        <div className="h-[50vh] grid grid-cols-2 gap-4 overflow-y-auto rounded-xl mr-[5%]">
          {scheduled.map(
            (scheduledItem) =>
              scheduledDetails[scheduledItem.cid]?.meetHost &&
              scheduledDetails[scheduledItem.cid]?.bookingDate &&
              scheduledDetails[scheduledItem.cid]?.bookingTime && (
                <div
                  key={scheduledItem.cid}
                  className="bg-white cursor-pointer border rounded-xl shadow-md h-[fit-content] py-1"
                >
                  <div className="p-4 rounded-lg">
                    <div className="flex flex-row justify-between mb-4">
                      <p className="text-xl ">
                        With{" "}
                        <strong className="font-semibold">
                          {(scheduledDetails[scheduledItem.cid]?.meetHost).slice(0, 6)}...
                          {(scheduledDetails[scheduledItem.cid]?.meetHost).slice(-6)}
                        </strong>
                      </p>
                      <Button/>
                    </div>

                    <div className="flex flex-row justify-between">
                      <p>Agenda : {scheduledDetails[scheduledItem.cid]?.meetAgenda}</p>
                      {roomIds[scheduledItem.cid] && (
                        <p>Room ID: {roomIds[scheduledItem.cid]}</p>
                      )}
                    </div>
                    <p>Issue : {scheduledDetails[scheduledItem.cid]?.meetDescription}</p>
                    <p className="mt-4">
                      Scheduled on : {scheduledDetails[scheduledItem.cid]?.bookingDate} at{" "}
                      {scheduledDetails[scheduledItem.cid]?.bookingTime} hrs
                    </p>
                    <p className="text-sm mt-2">
                      Booked on {scheduledDetails[scheduledItem.cid]?.dateOfBooking}
                    </p>
                    
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
