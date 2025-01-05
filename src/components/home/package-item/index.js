"use client"

import { Label } from "@/components/ui/label"


export default function PackageItem() {
    return (
        <div className="w-full py-10 flex flex-col items-center"
              style={{ backgroundImage: "url('https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/04/shape-17.png')" }}
            >
              <Label className="text-3xl font-bold mb-6">Gói tập</Label>

        </div>
    )
}
