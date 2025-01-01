"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { getAllEvents } from "@/services/event";
import { showToast } from "@/utils";

function Banner() {
  const [events, setEvents] = React.useState([])

  React.useEffect(() => {
    fetchEvents()
  }, [])

    const banners = [
    {
      id: 1,
      image:
        "https://i0.wp.com/picjumbo.com/wp-content/uploads/autumn-wallpaper-free-image.jpg?w=600&quality=80",
      alt: "Banner 1",
    },
    {
      id: 2,
      image:
        "https://media.istockphoto.com/id/1322104312/photo/freedom-chains-that-transform-into-birds-charge-concept.jpg?s=612x612&w=0&k=20&c=e2XUx498GotTLJn_62tPmsqj6vU48ZEkf0auXi6Ywh0=",
      alt: "Banner 2",
    },
    {
      id: 3,
      image:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      alt: "Banner 3",
    },
  ];

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents()
      if(response.success) {
        setEvents(response.data)
      } else {
        showToast("error", response.message)
      }
    } catch(err) {
      showToast("error", "Có lỗi khi lấy hình ảnh banner.")
    }
  }

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <div className="flex w-[70%] max-h-52 justify-center ">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem key={event.id}>
              <img src={event.banner} alt={event.title} className="h-52 w-full object-cover" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default Banner;
