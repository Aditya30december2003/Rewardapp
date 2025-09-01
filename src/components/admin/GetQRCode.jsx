import React, { useState } from "react";
import QRCode from "react-qr-code";
import { RxCross2 } from "react-icons/rx";
import { Oval } from "react-loader-spinner";
import Button from "@/components/common/Button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const GetQRCode = ({ link, isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  const downloadQRCode = async () => {
    setDownloading(true);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      hotfixes: [],
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // A4 width
    const pageHeight = pdf.internal.pageSize.getHeight(); // A4 height
    const contentWidth = pageWidth * 0.5; // 50% of A4 width
    const contentHeight = pageHeight * 0.7; // Adjust as needed to control height

    // Create a div to hold the QR code
    const qrCodeElement = document.getElementById("shareable-qrcode");
    const canvas = await html2canvas(qrCodeElement, { scale: 4 });
    const imgData = canvas.toDataURL("image/png");

    // Calculate positions
    const qrX = (pageWidth - contentWidth) / 2; // Center horizontally
    const qrY = (pageHeight - contentHeight) / 2; // Center vertically

    // Define padding
    const padding = 20;

    // Draw the border rectangle
    pdf.setLineWidth(1); // Set border thickness
    pdf.rect(
      qrX - padding,
      qrY - padding,
      contentWidth + 2 * padding,
      contentHeight + 2 * padding
    ); // Draw border

    // Add QR code to PDF
    pdf.addImage(imgData, "PNG", qrX, qrY, contentWidth, contentHeight * 0.5); // Adjust size as needed

    // Load the logo
    const logoUrl = "/logo.png"; // Replace with your logo URL
    const logoImg = new Image();
    logoImg.src = logoUrl;

    logoImg.onload = () => {
      const logoWidth = 50; // Adjust logo width
      const logoHeight = (logoWidth * logoImg.height) / logoImg.width; // Maintain aspect ratio

      // Position logo and text below the QR code
      const textY = qrY + contentHeight * 0.5 + 10; // Space below QR code
      const logoMarginTop = 20; // Adjust this value for top margin above the logo
      const logoY = textY + 10 + logoMarginTop; // Space below text + margin above logo

      // Add title text
      pdf.setFontSize(22);
      pdf.text("MARKETING MATERIAL", pageWidth / 2, textY, {
        align: "center",
      });

      // Add logo
      pdf.addImage(
        logoImg,
        "PNG",
        (pageWidth - logoWidth) / 2,
        logoY,
        logoWidth,
        logoHeight
      ); // Center logo

      // Save the PDF
      pdf.save("qrcode.pdf");
      setDownloading(false);
    };
  };

  if (!isOpen) return null;
  return (
    <div className="absolute top-0 left-0  bg-black/[0.34] w-full h-full flex items-center justify-center z-50 ">
      <div className="bg-white rounded-md px-8 py-10  max-w-[400px] ">
        <div
          onClick={onClose}
          className="p-1 border rounded-md text-xl text-gray-500 ml-auto mb-4 cursor-pointer w-fit"
        >
          <RxCross2 />
        </div>
        <div id="shareable-qrcode">
          <QRCode value={link} />
        </div>
        <div>
          <Button
            className="mt-8 bg-kkrtext flex items-center justify-center bg-gray-50 border hover:bg-gray-100 !text-gray-500"
            onClick={downloadQRCode}
          >
            {!downloading && <span> Download</span>}
            {downloading && (
              <Oval
                visible={true}
                height="25"
                width="25"
                strokeWidth="4"
                color="#fff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetQRCode;
