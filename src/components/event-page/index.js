"use client";

import { createEvent, getAllEvents, updateEvent } from "@/services/event";
import { showToast } from "@/utils";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import EventCard from "../card/event-card";
import Notification from "../Notification";
import EventDialog from "../dialog/event-details-dialog";

export default function Event({ userInfo }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllEvents();        
        if (response.success) {
          setEvents(response.data);
        } else {
          showToast("error", response.message);
        }
      } catch (err) {
        showToast("error", "Có lỗi xảy ra khi lấy dữ liệu sự kiện.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const handleSaveEvent = async (event) => {
    try {
      let response;
      if (event._id){
        response = await updateEvent(event._id, event)        
        if (response.success) {
          setEvents((prevEvents) =>
            prevEvents.map((e) => (e._id === event._id ? response.data : e))
          );
          showToast("success", response.message)
        } else showToast("error", response.message)
      } else {
        response = await createEvent({ ...event, creatorId: userInfo._id });
        if (response.success) {
          setEvents((prevEvents) => [...prevEvents, response.data]);
          showToast("success", response.message);
        } else showToast("error", response.message);
      }
    } catch(err) {
      showToast("error", "Có lỗi khi lưu thông tin sự kiện.");
    }
    setIsDialogOpen(false)
  }

  const handleDeleteEvent = (eventId) => {
    setIsDialogOpen(false)
  }

  return isLoading ? (
    <div className="flex mt-16 justify-center items-center">
      <HashLoader loading={isLoading} color="#1e293b" size={50} />
    </div>
  ) : (
    <div className="container flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Danh sách sự kiện</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          Thêm sự kiện
          <CirclePlus/>
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onClick={() => handleEventClick(event)}
          />
        ))}
      </div>

      {/* dialog */}
      <EventDialog
        key={selectedEvent ? selectedEvent._id : "new"}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      <Notification/>
    </div>
  );
}
