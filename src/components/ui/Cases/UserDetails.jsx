import { fetchUserDetails } from '@/lib/data';
import { cookies } from 'next/headers';
import React from 'react';

const UserDetails = async ({ userId, show }) => {
    cookies()
    const userdetails = await fetchUserDetails(userId);

    if (!userdetails) return <>N/A</>;

    return (
        <>
            {show === "name" ? userdetails.name : 
             show === "email" ? userdetails.email : 
             show === "phone" ? userdetails.phone : 
             show === "role" ? userdetails.labels?.[0] : 
             "N/A"}
        </>
    );
};

export default UserDetails;
