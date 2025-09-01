"use client"
import React, { useState } from "react";
import PopupForm from "./PopupForm";
import { sendmails, updateQueryReply } from "@/lib/actions";
import { type } from "os";

const SendEmail = ({recepients}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <button
      onClick={()=>setIsPopupOpen(true)}
        className="px-4 py-2 bg-gray-50 text-gray-500 border rounded-md  hover:bg-gray-100"
      >
        Send Emails
      </button>

      {isPopupOpen && (
        <PopupForm
          title="Message"
          textareas={[
            {
              fieldname: "msg",
              placeholder: "Write Message Here...",
            },
          ]}
          fields={[
            {
              fieldname: "subject",
              type:"text",
              placeholder: "Write Subject Here...",
            },
          ]}
          secrets={[
            { fieldname: "emails", value:recepients},
          ]}
          onSubmit={sendmails}
          onClose={() => {setIsPopupOpen(false);}}
        />
      )}
    </>
  );
};

export default SendEmail;
