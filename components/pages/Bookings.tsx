import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import lighthouse from '@lighthouse-web3/sdk';

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
  const [scheduledDetails, setScheduledDetails] = useState<{ [key: string]: ScheduledDetails }>({});

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
      const response = await lighthouse.uploadText(bookingDetails, "3e9b96bc.15d532c44f924e808c128674a3938b7a", "booking_details");
      console.log("Uploaded booking details CID:", response.data.Hash);
    } catch (error) {
      console.error("Failed to upload booking details:", error);
    }
  };

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads("3e9b96bc.15d532c44f924e808c128674a3938b7a");
      return response.data.fileList;
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return [];
    }
  };

  const fetchScheduledDetails = async (cid: string) => {
    try {
      const response = await axios.get(`https://gateway.lighthouse.storage/ipfs/${cid}`);
      const data = response.data;

      const issueTitleMatch = data.match(/Issue Title:\s*(.*)/);
      const issuerMatch = data.match(/Issuer:\s*(.*)/);
      const descriptionMatch = data.match(/Description:\s*(.*)/);
      const dateMatch = data.match(/Date:\s*(.*)/);
      const bookingDateMatch = data.match(/Booking Date:\s*(.*)/);
      const bookingTimeMatch = data.match(/Booking Time:\s*(.*)/);

      if (issueTitleMatch && issuerMatch && descriptionMatch && dateMatch && bookingDateMatch && bookingTimeMatch) {
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
          meetAgenda: 'Unknown',
          meetHost: 'Unknown',
          meetDescription: 'Unknown',
          dateOfBooking: 'Unknown',
          bookingDate: 'Unknown',
          bookingTime: 'Unknown',
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Schedule a Meet</h2>
      <div className="flex flex-col mb-4">
        <label className="mb-2">Select Date:</label>
        <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-2">Select Time:</label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button
        onClick={handleBooking}
        className="bg-purple-900 text-white px-4 py-2 rounded"
      >
        Confirm Booking
      </button>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Scheduled Meets</h2>
      <div className="h-[45vh] overflow-y-auto">
        {scheduled.map((scheduledItem) => (
            scheduledDetails[scheduledItem.cid]?.meetHost && scheduledDetails[scheduledItem.cid]?.bookingDate && scheduledDetails[scheduledItem.cid]?.bookingTime && (
                <li
                  key={scheduledItem.cid}
                  className="p-4 hover:bg-gray-100 cursor-pointer rounded-xl"
                >
                    <div key={scheduledItem.cid} className="border p-3 m-2 rounded-lg">
                        <p><strong>Issue Title:</strong> {scheduledDetails[scheduledItem.cid]?.meetAgenda}</p>
                        <p><strong>Issuer:</strong> {scheduledDetails[scheduledItem.cid]?.meetHost}</p>
                        <p><strong>Description:</strong> {scheduledDetails[scheduledItem.cid]?.meetDescription}</p>
                        <p><strong>Date of Booking:</strong> {scheduledDetails[scheduledItem.cid]?.dateOfBooking}</p>
                        <p><strong>Booking Date:</strong> {scheduledDetails[scheduledItem.cid]?.bookingDate}</p>
                        <p><strong>Booking Time:</strong> {scheduledDetails[scheduledItem.cid]?.bookingTime}</p>
                    </div>
                </li>
            )
        ))}
      </div>
    </div>
  );
};

export default Bookings;
