
// "use client"
// import React, { useState } from 'react';
import { IoIosArrowDropdown } from "react-icons/io";
import Empty from '../Empty';
import { formatDateToLocal } from '@/lib/utils';
import UserDetails from './UserDetails';


const CaseRemarks = ({ comments }) => {
  // const [open, setOpen] = useState(false);
  const open=true;

  // If there are no comments, show an empty state
  if (!comments?.length) {
    return (
      <section className={`mb-4 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out ${open ? "bg-light" : "bg-white"}`}>
        <div
        //  onClick={() => setOpen(!open)}
          className="flex cursor-pointer items-center justify-between">
          <h3 className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}>Remarks</h3>
          {/* <IoIosArrowDropdown className={`cursor-pointer text-2xl hover:text-primary ${open && "rotate-180"}`} /> */}
        </div>
        {open && <div className='flex items-center justify-center'><Empty /></div>}
      </section>
    );
  }

  // Memoized rendering of each comment
  const renderComment = (comment) => (
    <article key={comment.$id} className="px-6 py-3 text-base bg-white m-1 dark:bg-blue-600 border border-line rounded-lg">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            <UserDetails userId={comment.createdBy} show={"name"} /> 
          </p>
          <p className="text-sm p-1 font-medium text-center border border-gray-200 text-gray-500 bg-white rounded-lg">
          <UserDetails userId={comment.createdBy} show={"role"} /> 
          </p>
        </div>
        <div className="inline-flex items-center text-sm font-normal text-center border-gray-200 text-gray-500 bg-white rounded-lg">
          {formatDateToLocal(comment.$createdAt)}
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {comment.content}
      </p>
    </article>
  );

  return (
    <section className={`mb-4 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out ${open ? "bg-light" : "bg-white"}`}>
      <div 
      // onClick={() => setOpen(!open)} 
      className="flex cursor-pointer items-center justify-between">
        <h3 className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}>Remarks</h3>
        {/* <IoIosArrowDropdown className={`cursor-pointer text-2xl hover:text-primary ${open && "rotate-180"}`} /> */}
      </div>

      {open && comments.map(renderComment)}
    </section>
  );
};

export default CaseRemarks;
