"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

const trainerData = [
    {
        name: "Trương Đình Hoàng",
        image: "https://firebasestorage.googleapis.com/v0/b/next-js-ecommerce-4d2a9.appspot.com/o/strongym%2Ftruongdinhhoang.webp-1733841970956-03rygbd3df?alt=media&token=6e34af80-7899-484b-b03a-9244e57d6f0f",
        position: "HLV Boxing",
        link_fb: "#",
        link_ig: "#"
    },
    {
        name: "Nguyễn Trần Duy Nhất",
        image: "https://firebasestorage.googleapis.com/v0/b/next-js-ecommerce-4d2a9.appspot.com/o/strongym%2FDuy_Nh%E1%BA%A5t.jpg-1734282861513-y86xnm2yr9?alt=media&token=ee737dad-b4bb-4e72-84f7-7aa76f8afd12",
        position: "HLV Muay Thái",
        link_fb: "#",
        link_ig: "#"
    },
    {
        name: "Phan Bảo Long",
        image: "https://firebasestorage.googleapis.com/v0/b/next-js-ecommerce-4d2a9.appspot.com/o/strongym%2Fphanbaolong.jpeg-1733943641467-3lqo3bsa2h?alt=media&token=c78155bf-1d20-4492-ae34-934b9fa71f0b",
        position: "HLV Thể hình",
        link_fb: "#",
        link_ig: "#"
    },
]

export default function TrainerItem() {
  return (
    <div className="w-full py-10 flex flex-col items-center"
      style={{ backgroundImage:
          "url('https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/04/shape-17.png')",
      }}
    >
      <Label className="text-3xl font-bold mb-6">Huấn luyện viên</Label>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-14 p-6">
        {trainerData.map((item, index) => (
          <Card key={index} className="w-[300px] overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
    
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
              <p className="text-gray-500 mb-4">{item.position}</p>
    
              <div className="flex justify-center gap-4">
                <Link
                  href={item.link_fb}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href={item.link_ig}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
    </div>
  );
}
