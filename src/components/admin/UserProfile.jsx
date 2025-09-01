import Link from "next/link";

export default function UserProfile({
  firstName,
  lastName,
  email,
  company,
  country,
  phone,
}) {
  return (
    <>
      <div className="mb-2 w-full rounded-md bg-white p-4 border divide-y-4 divide-gray-500">
        <div>
          <h2 className={`  text-base md:text-xl text-gray-600`}>
            User Profile
          </h2>
          <p className="text-gray-500 mb-4">Here are the basic user details</p>
        </div>

  <div className="grid grid-cols-2 gap-y-4 divide-y divide-gray-200 text-gray-700 text-base">
  {/* Name */}
  <div className="py-2">Full Name:</div>
  <div className="py-2 font-medium">{firstName} {lastName}</div>

  {/* Email */}
  <div className="py-2">Email:</div>
  <div className="py-2 font-medium">{email}</div>

  {/* Company */}
  <div className="py-2">Company:</div>
  <div className="py-2 font-medium">{company}</div>

  {/* Country */}
  <div className="py-2">Country:</div>
  <div className="py-2 font-medium">{country}</div>

  {/* Phone */}
  <div className="py-2">Phone:</div>
  <div className="py-2 font-medium">{phone}</div>
</div>
       
      </div>
    </>
  );
}
