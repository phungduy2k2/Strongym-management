"use client";

import { Bike, Dumbbell } from "lucide-react";
import { Label } from "../../ui/label";
import { PiBoxingGloveBold } from "react-icons/pi";
import { GrYoga } from "react-icons/gr";
import { GiWeightLiftingUp, GiMuscleUp } from "react-icons/gi";

const serviceData = [
  {
    icon: Bike,
    title: "Cycling",
    description: "Boost endurance with cycling sessions",
    bgImage:
      "https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/03/c1-570x456.jpg",
  },
  {
    icon: Dumbbell,
    title: "Fitness",
    description: "Achieve your fitness goals with expert guidance",
    bgImage:
      "https://1upnutrition.com/cdn/shop/articles/Healthy_Habits_For_Life_9_Tips_For_Better_Fitness_600x400_crop_center.progressive.jpg?v=1633117323",
  },
  {
    icon: GrYoga,
    title: "Yoga",
    description: "Relax and stretch with calming yoga sessions",
    bgImage:
      "https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/03/c3-570x456.jpg",
  },
  {
    icon: PiBoxingGloveBold,
    title: "Boxing",
    description: "Build strength and confidence through boxing",
    bgImage:
      "https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/03/c4-570x456.jpg",
  },
  {
    icon: GiWeightLiftingUp,
    title: "Power Lifting",
    description: "Maximize strength with powerlifting training",
    bgImage:
      "https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/03/blog-6-570x456.jpg",
  },
  {
    icon: GiMuscleUp,
    title: "Workout",
    description: "Get fit with personalized workout plans",
    bgImage:
      "https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/03/blog-4-570x456.jpg",
  },
];

export default function ServiceItem() {
  return (
    <div className="w-full py-10 flex flex-col items-center"
      style={{ backgroundImage: "url('https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/04/shape-17.png')" }}
    >
    <Label className="text-3xl font-bold mb-6">Dịch vụ</Label>
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-14 p-6">
      {serviceData.map((item) => (
        // Hexagon Container with proper hexagon shape
        <div className="relative w-[250px] group">
          <div className="aspect-[1.15/1] flex items-center">
            <div
              className="w-full h-full bg-gray-300 relative flex items-center justify-center overflow-hidden transition-all duration-500"
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                className="absolute inset-0 bg-cover transition-transform duration-500 transform -translate-x-full group-hover:translate-x-0"
                style={{
                  backgroundImage: `url('${item.bgImage}')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right",
                  filter: "grayscale(100%) brightness(50%)",
                }}
              ></div>

              {/* Content inside hexagon */}
              <div className="inset-0 p-8 z-10 flex flex-col items-center">
                {/* Icon circle */}
                <div className="mb-4 bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-500 group-hover:bg-muted">
                  <item.icon className="h-6 w-6 text-white" />
                </div>

                {/* Text content */}
                <div className="text-center transition-all duration-500 group-hover:text-white">
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  <p className="mt-2">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
