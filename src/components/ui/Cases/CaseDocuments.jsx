// "use client"
// import React, { useState } from 'react';
import { IoIosArrowDropdown } from "react-icons/io";
import Empty from "../Empty";
import { formatDateToLocal } from "@/lib/utils";
import UserDetails from "./UserDetails";
import { FiPaperclip } from "react-icons/fi";

const CaseDocuments = ({ documents }) => {
  // const [open, setOpen] = useState(false);
  const open = true;

  // If there are no comments, show an empty state
  if (!documents?.length) {
    return (
      <section
        className={`mb-4 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out ${
          open ? "bg-light" : "bg-white"
        }`}
      >
        <div
          //  onClick={() => setOpen(!open)}
          className="flex cursor-pointer items-center justify-between"
        >
          <h3
            className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}
          >
            Documents 
          </h3>
          {/* <IoIosArrowDropdown
            className={`cursor-pointer text-2xl hover:text-primary ${
              open && "rotate-180"
            }`}
          /> */}
        </div>
        {open && (
          <div className="flex items-center justify-center">
            <Empty />
          </div>
        )}
      </section>
    );
  }

  // Memoized rendering of each comment
  const renderDocument = (document) => (
    <article
      key={document.$id}
      className="px-6 py-3 text-base bg-white m-1 dark:bg-blue-600 border border-line rounded-lg"
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <UserDetails userId={document.createdBy} show={"name"} />
          </p>
          <p className="text-sm p-1 font-medium text-center border border-gray-200 text-gray-500 bg-white rounded-lg">
            <UserDetails userId={document.createdBy} show={"role"} />
          </p>
        </div>
        <div className="inline-flex items-center text-sm font-normal text-center border-gray-200 text-gray-500 bg-white rounded-lg">
          {formatDateToLocal(document.$createdAt)}
        </div>
      </div>
      <div className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 border rounded-xl">
            <div className="flex w-0 flex-1 items-center">
              <FiPaperclip aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                <span className="truncate font-medium">{document.name}</span>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <a href={document.path}  className="font-medium text-indigo-600 hover:text-indigo-500">
                Download
              </a>
            </div>
          </div>
    </article>
  );

  return (
    <section
      className={`mb-4 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out ${
        open ? "bg-light" : "bg-white"
      }`}
    >
      <div
        // onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center justify-between"
      >
        <h3
          className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}
        >
             Documents 
        </h3>
        {/* <IoIosArrowDropdown
          className={`cursor-pointer text-2xl hover:text-primary ${
            open && "rotate-180"
          }`}
        /> */}
      </div>

      {open && documents.map(renderDocument)}
    </section>
  );
};

export default CaseDocuments;
