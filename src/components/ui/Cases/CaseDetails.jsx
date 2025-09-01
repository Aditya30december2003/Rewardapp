import React from "react";
import { FiPaperclip } from "react-icons/fi";
import CaseStatus from "./CaseStatus";
import { formatDateToLocal } from "@/lib/utils";
import UserDetails from "./UserDetails";
import PerpetratorDetails from "./PerpetratorDetails";





const CaseDetails = ({ caseContent }) => {
  // Destructure the relevant fields from caseContent
  const { victim, perpetrator, $createdAt, status, lawyer,postings } = caseContent;
  const victimPosting=postings.find((post)=>post.createdBy===victim)
  const badPosting=postings.find((post)=>post.createdBy===perpetrator)

  return (
    <div className="border p-4 rounded-xl border-gray-200 dark:border-gray-700 mb-4 bg-white">
      <div className="mb-4">
        <h3 className="subheading text-gray-500">Case Details</h3>
      </div>
      <div className="mb-6 px-4 sm:px-0 flex flex-col md:flex-row md:items-center justify-start gap-10">
        <div className="md:border-r pr-6">
          <h3 className="text-sm font-medium leading-7 text-gray-500 mb-1">
            Reported On
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-900 font-semibold">
            {formatDateToLocal($createdAt)}
          </p>
        </div>
        <div className="font-semibold md:border-r pr-6">
          <h3 className="text-sm font-medium leading-7 text-gray-500 mb-1">
            Assigned Lawyer
          </h3>
          {lawyer ? (
            <UserDetails userId={lawyer} show={"name"} />
          ) : (
            "Not Assigned Yet"
          )}
        </div>
        <div className="">
          <h3 className="text-sm font-medium leading-7 text-gray-500 mb-1">
            Status
          </h3>
          <CaseStatus status={status} />
        </div>
      </div>

      <div className="mb-6  border rounded-xl overflow-hidden">
        <h1 className="  text-start p-3 bg-light text-accent font-bold">
          Victim Details
        </h1>
        <div className="p-6">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
               Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              <UserDetails userId={victim} show={"name"} />
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
               Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              <UserDetails userId={victim} show={"email"} />
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Phone
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              <UserDetails userId={victim} show={"phone"} />
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              User Handle
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
            {victimPosting?.profileHandle?.profileHandle}
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Platform
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              {victimPosting?.platform?.name}
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Posting Text
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              {victimPosting?.text}
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Posting Description
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              {victimPosting?.description}
            </dd>
          </div>
         
        </dl>
      </div>

      </div>

      <div className="border rounded-xl overflow-hidden">
        <h1 className="  text-start p-3 bg-light text-accent font-bold">
          Perpetrator Details
        </h1>
        <div className=" p-6">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
               Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              <PerpetratorDetails userId={perpetrator} show={"name"} />
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
               Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              <PerpetratorDetails userId={perpetrator} show={"email"} />
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Phone
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              <PerpetratorDetails userId={perpetrator} show={"phone"} />
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              User Handle
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
            {badPosting?.profileHandle?.profileHandle}
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Platform
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              {badPosting?.platform?.name}
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Posting Text
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              {badPosting?.text}
            </dd>
          </div>
          <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Posting Description
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-900 font-semibold sm:col-span-2 sm:mt-0">
              {badPosting?.description}
            </dd>
          </div>
        
        </dl>
      </div>

      </div>

     
    </div>
  );
};

export default CaseDetails;
