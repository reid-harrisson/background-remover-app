"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        id="file"
        accept="image/*"
        onChange={handleImageChange}
        className="sr-only"
      />
      <label
        htmlFor="file"
        className="bg-foreground text-background px-4 py-2 rounded-xl cursor-pointer"
      >
        Upload
      </label>
      {selectedImage && (
        <Image
          src={URL.createObjectURL(selectedImage)}
          alt={selectedImage.name}
          width={200}
          height={200}
        />
      )}
    </div>
  );
}
