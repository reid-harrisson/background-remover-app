"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import DataChart from "@/components/data-chart";

const colorTypes = ["rgb", "hex", "hsl", "cmyk"] as const;

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [color, setColor] = useState<
    Record<(typeof colorTypes)[number], string | null>
  >({
    rgb: null,
    hex: null,
    hsl: null,
    cmyk: null,
  });
  const [position, setPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [size, setSize] = useState<{
    width: number;
    height: number;
  }>({ width: 200, height: 200 });

  const { setTheme } = useTheme();

  let width =
    (200 * size.width) / size.height > 200
      ? 200
      : (200 * size.width) / size.height;
  let height = (width * size.height) / size.width;
  if (!width) width = 100;
  if (!height) height = 100;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null; // Corrected here
    if (file) {
      setSelectedImage(file); // Move this line outside the if block
    } else {
      setSelectedImage(null);
    }
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const imgElement = event.currentTarget.querySelector("img");
    if (!imgElement) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    context.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

    const rect = imgElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPosition({ x, y });
    const imgData = context.getImageData(x, y, 1, 1).data;

    const rgb = `rgb(${imgData[0]}, ${imgData[1]}, ${imgData[2]})`;
    const hex = `#${imgData[0].toString(16).padStart(2, "0")}${imgData[1]
      .toString(16)
      .padStart(2, "0")}${imgData[2].toString(16).padStart(2, "0")}`;
    const hsl = `hsl(${Math.round((imgData[0] / 255) * 360)}, ${Math.round(
      (imgData[1] / 255) * 100
    )}%, ${Math.round((imgData[2] / 255) * 100)}%)`;
    const cmyk = `cmyk(${Math.round((imgData[0] / 255) * 100)}%, ${Math.round(
      (imgData[1] / 255) * 100
    )}%, ${Math.round((imgData[2] / 255) * 100)}%, 0%)`;

    setColor({
      rgb,
      hex,
      hsl,
      cmyk,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <select onChange={(e) => setTheme(e.target.value)}>
        <option value="dark">dark</option>
        <option value="light">light</option>
      </select>
      <input
        type="file"
        id="file"
        accept="image/*"
        onChange={handleImageChange}
        className="sr-only"
      />
      <p>{selectedImage && selectedImage.name}</p>
      <label
        htmlFor="file"
        className="bg-foreground text-background px-4 py-2 rounded-xl cursor-pointer"
      >
        Upload
      </label>
      {selectedImage && (
        <>
          <p>{`${size.width}x${size.height}`}</p>
          <div className="flex w-[200px] h-[200px] items-center justify-center border-2 border-solid border-foreground rounded-lg">
            <div className="relative" onClick={handleImageClick}>
              <Image
                onLoadingComplete={(img) => {
                  if (
                    size.width != img.naturalWidth ||
                    size.height != img.naturalHeight
                  )
                    setSize({
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                    });
                }}
                src={URL.createObjectURL(selectedImage)}
                alt={selectedImage.name}
                className="object-fill pointer-events-none"
                width={width}
                height={height}
              />
              {color.rgb && (
                <div
                  className="w-[10px] h-[10px] absolute rounded-full z-10 bg-transparent backdrop-invert"
                  style={{
                    left: position.x - 5,
                    top: position.y - 5,
                  }}
                ></div>
              )}
            </div>
          </div>
        </>
      )}
      {color.hex && (
        <div className="w-20 h-20" style={{ backgroundColor: color.hex }}></div>
      )}
      {color.rgb && (
        <div className="mt-2 text-center">
          {colorTypes.map((type) => (
            <p key={type}>
              Selected color in {type.toUpperCase()}: {color[type]}
            </p>
          ))}
        </div>
      )}
      <div className="w-[600px] h-[300px]">
        <DataChart />
      </div>
    </div>
  );
}
