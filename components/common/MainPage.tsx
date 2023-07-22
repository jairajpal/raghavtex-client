import React from "react";
import backgroundImage from "../../public/images/bg-image.jpg";
import Image from "next/image";

const MainPage = () => {
  return (
    <div className="relative w-screen h-screen">
      <Image
        src="/images/bg-image.jpg"
        alt="Image Description"
        layout="fill"
        objectFit="cover"
      />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <p className="text-64 font-bold">Raghav Tex</p>
        {/* Add more paragraphs or customize the text */}
      </div>
    </div>
  );
};

export default MainPage;
