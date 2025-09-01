"use client";
import React, { useState } from "react";
import { FaQrcode } from "react-icons/fa";
import GetQRCode from "./GetQRCode";

const GenerateQR = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openPopup}
        className="flex h-10 items-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 text-sm border font-medium  transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      >
        <FaQrcode className="h-5 " />
      </button>
      <GetQRCode link={link} isOpen={isOpen} onClose={closePopup} />
    </>
  );
};

export default GenerateQR;
