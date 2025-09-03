"use server";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import auth from "./auth";
import { setSessionCookie, clearSessionCookie, getSessionCookie } from "@/lib/sessionCookie";
import { cookies } from "next/headers";
import { Client, Account, ID, Permission, Query, Role } from "node-appwrite";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import { generateReferralCode, parseDuration } from "./utils";
import { Resend } from "resend";
import { stripe } from "./stripe";
// Login
export async function createLoginSession(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { email, password } = data;
  let user;

  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    // Secure session cookie (HttpOnly + SameSite=Strict + Secure in prod)
    setSessionCookie({ secret: session.secret, expiresAt: session.expire });

    // Clear/reset the MFA challenge cookie with safe flags
    const isProd = process.env.NODE_ENV === "production";
    cookies().set("challengeID", "", {
      secure: isProd,
      sameSite: "strict",
      path: "/",
    });

    user = await auth.getUser();
    if (user?.mfa === "error") {
      return { message: user?.message };
    }
  } catch (error) {
    console.log(error);
    return { message: error?.message };
  }

  if (user.mfa === "verify") {
    redirect(user.message);
  } else if (user.mfa === "error") {
    redirect("/login/error");
  } else {
    redirect(`/${user.labels?.[0] || "unknown"}/overview`);
  }
}


// Registeration
export async function createSellerAccount(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { name, email, password } = data;
  let user;

  try {
    const { users, account, databases } = await createAdminClient();

    // Create auth seller account
    const newSellerAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Create Stripe account for the seller
    const newStripeAccount = await stripe.accounts.create({
      email: email,
      metadata: { sellerId: newSellerAccount.$id },
      controller: {
        losses: { payments: "application" },
        fees: { payer: "application" },
        stripe_dashboard: { type: "express" },
      },
    });

    // Set prefs/labels
    await users.updatePrefs(newSellerAccount.$id, {
      connectedAccountId: `${newStripeAccount.id}`,
      stripeConnectedLinked: "false",
    });
    await users.updateLabels(newSellerAccount.$id, ["seller"]);

    // Create a login session for the new seller
    const session = await account.createEmailPasswordSession(email, password);

    // Secure session cookie (HttpOnly + SameSite=Strict + Secure in prod)
    setSessionCookie({ secret: session.secret, expiresAt: session.expire });

    user = await auth.getUser();
  } catch (error) {
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  const isAdmin = user.labels.includes("admin");
  if (isAdmin) redirect("/admin/overview");
  else redirect("/seller/listings");
}

// Create Strip Account Link
export async function CreateStripeAccountLink(prevState) {
  console.log("creating...");
  console.log("fetching user...");
  const user = await auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let accountLink;
  let userDetails;

  try {
    console.log("fetching user details...");

    accountLink = await stripe.accountLinks.create({
      account: user?.prefs?.connectedAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/account/${user?.$id}`,
      return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/account/${user?.$id}`,
      type: "account_onboarding",
    });

    console.log("returning for redirect ...");
  } catch (error) {
    return { message: error?.message };
  }
  revalidatePath("/", "layout");
  return redirect(accountLink.url);
}

// Give Stripe Dashboard Link
export async function GetStripeDashboardLink(prevState) {
  const user = await auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let loginLink;
  let userDetails;
  try {
    loginLink = await stripe.accounts.createLoginLink(
      user?.prefs?.connectedAccountId
    );
  } catch (error) {
    return { message: error?.message };
  }
  return redirect(loginLink.url);
}

// // Ticket Buying Link
// export async function BuyTicket(prevState, formData) {
//   const data = Object.fromEntries(formData);
//   const { listingId, productId, licenseplateno } = data;
//   const storekwilCommission =
//     parseFloat(process.env.NEXT_PUBLIC_storekwil_RATE || 10) / 100;
//   let session;
//   try {
//     // const productDetails = await fetchProductDetails(productId);
//     const { users, databases } = await createAdminClient();
//     const { prefs } = await users.get(productDetails.property.user);

//     // create ticket
//     const ticketID = ID.unique();

//     session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "eur",
//             unit_amount_decimal: Math.round(productDetails?.price),
//             product_data: {
//               name: productDetails?.title,
//             },
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         ProductID: productId,
//         TicketID: ticketID,
//         License: licenseplateno,
//         ListingID: listingId,
//         ProductName: productDetails?.title,
//         ProductPrice: productDetails?.price,
//         duration: productDetails?.duration,
//       },

//       payment_intent_data: {
//         application_fee_amount: Math.round(
//           productDetails?.price * storekwilCommission
//         ),
//         transfer_data: {
//           destination: prefs.connectedAccountId,
//         },
//       },
//       success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/stripe/payment/${ticketID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/listings/${listingId}/purchase/${productId}`,
//     });
//   } catch (error) {
//     return { message: error?.message };
//   }

//   revalidatePath("/", "layout");
//   return redirect(session.url);
// }

// Create Listing
export async function createListing(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { listingTitle, description } = data;

  const mediaFiles = Array.from(formData.getAll("media"));
  if (mediaFiles.length > 5) {
    return {
      message:
        "You can only upload a maximum of 5 files. Please Reselect the files",
    };
  }

  const secret = getSessionCookie();
  if (!secret) {
    return { message: "Unauthorized" };
  }

  try {
    const user = await auth.getUser();
    const { databases } = await createSessionClient(secret);

    const newListing = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
      ID.unique(),
      {
        name: listingTitle,
        smallDescription: description,
        user: user.$id,
      }
    );

    await Promise.all(
      mediaFiles.map((file) => uploadMedia(file, newListing.$id))
    );
  } catch (error) {
    console.error("ERROR in createListing", error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  redirect(`/seller/listings`);
}

// Verify OTP
export async function verifyOTP(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { otp } = data;

  const challengeId = cookies().get("challengeID")?.value;

  const secret = getSessionCookie();
  if (!secret) {
    return { message: "Unauthorized", type: "error" };
  }

  let user;
  try {
    const { account } = await createSessionClient(secret);

    await account.updateMfaChallenge(challengeId, otp);

    // (Optional) clear the challenge cookie after successful verification
    const isProd = process.env.NODE_ENV === "production";
    cookies().set("challengeID", "", {
      secure: isProd,
      sameSite: "strict",
      path: "/",
    });

    user = await auth.getUser();
  } catch (error) {
    return { message: error?.message, type: "error" };
  }

  redirect(`/${user.labels?.[0] || "unknown"}/overview`);
}

// Resend OTP
export async function resendOTP() {
  let user;
  try {
    // reset the challenge cookie with safe flags
    const isProd = process.env.NODE_ENV === "production";
    cookies().set("challengeID", "", {
      secure: isProd,
      sameSite: "strict",
      path: "/",
    });

    user = await auth.getUser();
    if (user?.mfa === "error") {
      return { message: user?.message };
    }
  } catch (error) {
    return { message: error?.message, type: "error" };
  }

  if (user.mfa === "verify") {
    redirect(user.message);
  } else if (user.mfa === "error") {
    redirect("/login/error");
  } else {
    redirect(`/${user.labels?.[0] || "unknown"}/overview`);
  }
}


export async function sendRecoveryLink(prevState, formData) {
  try {
    const data = Object.fromEntries(formData);
    const { email } = data;

    const { account } = await createSessionClient();
    const response = await account.createRecovery(
      email,
      `https://app.perktify.com/password/reset/user`
    );
    return {
      message: `"Reset Link Sent Successfully to Email" ${email}`,
      type: "success",
    };
    // console.log("recovery response", response);
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}
export async function RecoverPassword(prevState, formData) {
  try {
    const data = Object.fromEntries(formData);
    const { userId, secret, npwd, cnpwd } = data;
    if (npwd !== cnpwd) {
      return { message: "Passwords Don't Match", type: "error" };
    }

    const { account } = await createSessionClient();
    const response = await account.updateRecovery(userId, secret, npwd);

    console.log("response", response);
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
  redirect("/login");
}
export async function resendRecoveryLink() {}

// Udpate Listing
export async function updateListing(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, listingTitle, description } = data;

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized" };

  try {
    const user = await auth.getUser();
    const { databases } = await createSessionClient(secret);

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
      listingId,
      {
        name: listingTitle,
        smallDescription: description,
      }
    );
  } catch (error) {
    console.error("ERROR in updateListing", error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  redirect(`/seller/listings`);
}


// Delete  A Listing
export async function deleteListing(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, mediaId } = data;

  const mediaIds = JSON.parse(mediaId);

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized" };

  try {
    const { databases, storage } = await createSessionClient(secret);

    await Promise.all([
      databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_PROPERTIES,
        listingId
      ),
      ...mediaIds.map((fileID) =>
        storage.deleteFile(process.env.NEXT_PUBLIC_BUCKET_ID, fileID)
      ),
    ]);
  } catch (error) {
    console.error("ERROR in deleteListing", error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
}

// create Product
export async function createProduct(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, productTitle, duration, amount, durationType } = data;

  const parsedAmount = amount.replace(",", ".");
  const centsAmount = Math.round(parseFloat(parsedAmount) * 100);
  const parsedDuration = parseDuration(duration, durationType);

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized" };

  try {
    const { databases } = await createSessionClient(secret);

    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PRODUCTS,
      ID.unique(),
      {
        title: productTitle,
        price: parseInt(centsAmount),
        duration: parseInt(parsedDuration),
        property: listingId,
      }
    );
  } catch (error) {
    console.error("ERROR in createProduct", error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  redirect(`/seller/listings/${listingId}`);
}


// update Product
export async function updateProduct(formData) {
  const data = Object.fromEntries(formData);
  const { listingId, productId, productTitle, duration, amount, durationType } = data;

  const parsedAmount = amount.replace(",", ".");
  const centsAmount = Math.round(parseFloat(parsedAmount) * 100);
  const parsedDuration = parseDuration(duration, durationType);

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized" };

  try {
    const { databases } = await createSessionClient(secret);

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PRODUCTS,
      productId,
      {
        title: productTitle,
        price: parseInt(centsAmount),
        duration: parseInt(parsedDuration),
      }
    );
  } catch (error) {
    console.error("ERROR in updateProduct", error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  redirect(`/seller/listings/${listingId}`);
}


// Delete  A Product
export async function deleteProduct(formData) {
  const data = Object.fromEntries(formData);
  const { productId, listingId } = data;

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized" };

  try {
    const { databases } = await createSessionClient(secret);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PRODUCTS,
      productId
    );
  } catch (error) {
    console.error("ERROR in deleteProduct", error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
}


// Delete Media
export async function deleteMedia(docId, storageId, listingId) {
  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized" };

  try {
    const { databases, storage } = await createSessionClient(secret);

    // Delete file from storage
    await storage.deleteFile(process.env.NEXT_PUBLIC_BUCKET_ID, storageId);

    // Delete media document
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_MEDIA,
      docId
    );

    // Optionally: revalidate the listing edit page here if needed
    // revalidatePath(`/seller/listings/${listingId}/edit`);
  } catch (error) {
    console.error("ERROR in deleteMedia", error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
}


export async function uploadListingImg(formData) {
  const data = Object.fromEntries(formData);
  const { file, listingId } = data;

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized" };

  try {
    const { databases, storage } = await createSessionClient(secret);

    // Upload file
    const uploadedfile = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID,
      ID.unique(),
      file
    );

    // Store a record in media collection pointing to the file
    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_MEDIA,
      ID.unique(),
      {
        link: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${uploadedfile.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
        property: listingId,
        mediaId: uploadedfile.$id,
      }
    );

    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.error("ERROR in uploadListingImg", error);
    return { message: error?.message };
  }
}


// storekwil
export async function createNewUser(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { name, email, password, role } = data;

  try {
    const { users, account } = await createAdminClient();

    // creates new auth user account
    const newUserAcct = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // sets labels of the user as per role
    await users.updateLabels(
      newUserAcct.$id, // userId
      [role]
    );
    // sets Email Verification of the user
    await users.updateEmailVerification(
      newUserAcct.$id, // userId
      true
    );
    // update MFA of the user
    await users.updateMfa(
      newUserAcct.$id, // userId
      true
    );

    return { message: "User Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function uploadDocument(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { file_input, docPermissions, caseId } = data;

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized", type: "error" };

  try {
    const { databases, storage, account } = await createSessionClient(secret);
    const user = await account.get();

    // Upload file
    const uploadedfile = await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID,
      ID.unique(),
      file_input
    );

    // Create document with optional read permissions
    const docData = {
      path: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${uploadedfile.$id}/download?project=${process.env.NEXT_PUBLIC_PROJECT_ID}&mode=admin`,
      case: caseId,
      createdBy: user.$id,
      name: file_input.name,
    };

    if (docPermissions) {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_DOCUMENTS,
        ID.unique(),
        docData,
        [Permission.read(Role.users())]
      );
    } else {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_DOCUMENTS,
        ID.unique(),
        docData
      );
    }

    revalidatePath("/", "layout");
    return { message: "Document Uploaded Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}


export async function addComment(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { commentContent, commentPermission, caseId } = data;

  const secret = getSessionCookie();
  if (!secret) return { message: "Unauthorized", type: "error" };

  try {
    const { databases, account } = await createSessionClient(secret);
    const user = await account.get();

    const docData = {
      content: commentContent,
      case: caseId,
      createdBy: user.$id,
    };

    if (commentPermission) {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENTS,
        ID.unique(),
        docData,
        [Permission.read(Role.users())]
      );
    } else {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENTS,
        ID.unique(),
        docData
      );
    }

    revalidatePath("/", "layout");
    return { message: "Comment Published Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}


// Storekwill Tier Management
// Update Tiers
// update Product
export async function updateTiers(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { tierId, label, threshold } = data;

  const parsedThreshold = parseInt(threshold);
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    await databases.updateDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.NEXT_PUBLIC_COLLECTION_ID_TIERS,
      prefs.dbId,
      prefs.tiers,
      tierId,
      {
        label,
        threshold: parsedThreshold,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Tier Updated Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

// create coupon

export async function createRewardCoupon(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { title, promoCode, pointsRequired, expiry, rewardType } = data;

  const parsedThreshold = parseInt(pointsRequired);
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    await databases.createDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.NEXT_PUBLIC_COLLECTION_ID_REWARDS,
      prefs.dbId,
      prefs.rewards,
      ID.unique(),
      {
        name: title,
        promoCode,
        rewardType,
        pointsRequired: parsedThreshold,
        expiry,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Reward/Coupon Created Successfully", type: "success" };
  } catch (error) {
    return { message: error?.message, type: "error" };
  }
}

export async function updateQueryReply(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { queryId, reply } = data;
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    await databases.updateDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.NEXT_PUBLIC_COLLECTION_ID_QUERIES,
      prefs.dbId,
      prefs.queries,
      queryId,
      {
        reply,
        status: "Read",
      }
    );

    revalidatePath("/", "layout");
    return { message: "Reply Submitted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message} ${queryId}`, type: "error" };
  }
}
export async function createQuery(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { userId, description, subject } = data;
  try {
    const { users, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    await databases.createDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.NEXT_PUBLIC_COLLECTION_ID_QUERIES,
      prefs.dbId,
      prefs.queries,
      ID.unique(),
      {
        user: userId,
        subject,
        description,
        status: "Unread",
      }
    );

    revalidatePath("/", "layout");
    return { message: "Query Submitted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

//Email verification with millionverifier
async function validateEmailWithMillionVerifier(email) {
  const apiKey = process.env.NEXT_PUBLIC_MILLIONVERIFIER_API_KEY;
  const newurl = `https://api.millionverifier.com/api/v3/?api=${apiKey}&email=${email}&timeout=10`;
  const messages = {
    invalid: "Invalid email address.",
    dns_error: "Email domain is not reachable.",
  };
  try {
    const res = await fetch(newurl);
    const data = await res.json(); // Parse response as JSON

    // console.log("data", data);
    // Sample statuses: 'ok', 'invalid', 'disposable', 'catch_all', etc.
    if (data.result === "ok") {
      return { valid: true };
    } else {
      const reason = messages[data.result] || "Email verification failed.";
      return { valid: false, reason: reason };
    }
  } catch (error) {
    console.error("Email validation error:", error);
    return { valid: false, reason: "validation_failed" };
  }
}

// Registeration
export async function createNewUserRegistration(prevState, formData) {
  const data = Object.fromEntries(formData);
  const {
    firstName,
    lastName,
    email,
    company,
    country,
    phone,
    referCode,
    adminId,
  } = data;

  // validate email before processing
  const emailValidation = await validateEmailWithMillionVerifier(email);
  console.log("emailvalidtaion", emailValidation);
  if (!emailValidation.valid) {
    return {
      message: `${emailValidation.reason} `,
      type: "error",
    };
  }

  const password = generateReferralCode(firstName) + company;
  // const configData=extractConfigValues(process.env.NEXT_PUBLIC_CONFIG);

  // console.log(configData)

  let user;
  try {
    const { users, account, databases } = await createAdminClient();

    const configData = await databases.getDocument(
      process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID, // databaseId
      process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID, // collectionId
      adminId
    );
    const {
      db_id,
      campaigns,
      leads,
      queries,
      rewards,
      tiers,
      transactions,
      userPoints,
      Users,
    } = configData;
    console.log("our config data", configData);

    let referredBy = null;

    if (referCode) {
      const { documents } = await databases.listDocuments(
        configData.db_id,
        configData.Users,
        [Query.contains("referralCode", referCode)]
      );

      referredBy = documents.length !== 0 ? documents[0].$id : null;
      console.log("referredBy", referredBy);
    }

    if (referCode && !referredBy) {
      return { message: "Invalid Invitation Code", type: "error" };
    } else if (referCode && referredBy) {
      console.log("Refer Code Found", referredBy);
      // creates new auth user
      console.log("creating auth user...");
      const newUserAccount = await account.create(
        ID.unique(),
        email,
        password,
        firstName
      );
      console.log("User Created");

      console.log("setting user account verified ...");
      // sets Email Verification of the user
      await users.updateEmailVerification(
        newUserAccount.$id, // userId
        true
      );

      // update MFA of the user
      await users.updateMfa(
        newUserAccount.$id, // userId
        true
      );

      console.log("Updating Label...");
      // sets Label of the user
      await users.updateLabels(
        newUserAccount.$id, // userId
        ["user"] // prefs
      );
      console.log("label updated");
      console.log("setting user preferences");
      // Set user preferences using updatePrefs
      const userPrefs = {
        dbId: db_id,
        campaigns,
        leads,
        queries,
        rewards,
        tiers,
        transactions,
        userPoints,
        Users,
      };

      // Update the user's preferences
      await users.updatePrefs(newUserAccount.$id, userPrefs);
      console.log("User preferences updated:");

      //create document in users collection

      console.log("creating user document in users collection...");
      await databases.createDocument(
        configData.db_id,
        configData.Users,
        newUserAccount.$id,
        {
          firstName,
          lastName,
          company,
          country,
          referralCode: generateReferralCode(firstName),
          isRefferedLead: true,
          refferedBy: referredBy,
          email,
          phone,
        }
      );

      console.log("document created successfully");
      console.log("creating  document in leads collection...");

      //create document in leads collection
      await databases.createDocument(
        configData.db_id,
        configData.leads,
        ID.unique(),
        {
          referredBy: referredBy,
          users: newUserAccount.$id,
        }
      );

      console.log("document created successfully");
      console.log("creating document in points collection...");
      //create document in points collection
      await databases.createDocument(
        configData.db_id,
        configData.userPoints,
        ID.unique(),
        {
          userId: referredBy,
          points: 100,
        }
      );
      console.log("document created successfully");

      await sendmail(email, firstName, password, company);

      return {
        message:
          "User Registered Successfully \n Your Friend Earned 100 Points",
        type: "success",
      };
    } else {
      // creates new auth user
      console.log("creating auth user...");
      const newUserAccount = await account.create(
        ID.unique(),
        email,
        password,
        firstName
      );
      console.log(" auth user created...");

      console.log("setting user account verified ...");
      // sets Email Verification of the user
      await users.updateEmailVerification(
        newUserAccount.$id, // userId
        true
      );

      // update MFA of the user
      await users.updateMfa(
        newUserAccount.$id, // userId
        true
      );

      // sets prefs of the user
      console.log("updating user prefes...");
      await users.updateLabels(
        newUserAccount.$id, // userId
        ["user"] // prefs
      );
      console.log(" user prefes updated...");
      console.log("setting user preferences");
      // Set user preferences using updatePrefs
      const userPrefs = {
        dbId: db_id,
        campaigns,
        leads,
        queries,
        rewards,
        tiers,
        transactions,
        userPoints,
        Users,
      };

      // Update the user's preferences
      await users.updatePrefs(newUserAccount.$id, userPrefs);
      console.log("User preferences updated:");
      console.log(" creating document in user collections...");
      //create document in users collection
      await databases.createDocument(
        configData.db_id,
        configData.Users,
        newUserAccount.$id,
        {
          firstName,
          lastName,
          company,
          country,
          referralCode: generateReferralCode(firstName),
          isRefferedLead: false,
          refferedBy: null,
          email,
          phone,
        }
      );
      console.log(" document created...");
      await sendmail(email, firstName, password, company);

      return { message: "User Registered Successfully", type: "success" };
    }
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// Update User Password
export async function UpdateUserPassword(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { newpwd, confirmpwd, userId, userEmail } = data;

  if (userEmail === "demo@storekwil.com") {
    return {
      message: "Demo User password cannot be changed.",
      type: "error",
    };
  }

  try {
    const { users } = await createAdminClient();

    if (newpwd !== confirmpwd) {
      return { message: "Passwords Donot Match", type: "error" }; 
    } else {
      await users.updatePassword(userId, newpwd);
      return { message: "Password Updated Successfully", type: "success" };
    }
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}
const transporter = nodemailer.createTransport({
  host: "smtp.forwardemail.net", // or your SMTP host
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: "notifications@mailing.perktify.com", // replace with your email
    pass: "kuPfyt-3hubzi@jYkHi<k", // replace with your email password or app password
  },
});

export async function sendmail_(email, firstName, password, company) {
  const mailOptions = {
    from: '"Customer Support" <notifications@mailing.perktify.com>', // sender address
    to: email,
    subject: `Welcome to ${company}, ${firstName}!`,
    html: `
      <h1>Welcome, ${firstName}!</h1>
      <p>Thank you for joining ${company}. We're thrilled to have you as part of our community!</p>
      <p>You can now access your dashboard using the credentials below:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p><a href="https://app.perktify.com/login" target="_blank">Click here to login to your dashboard</a></p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Happy exploring!</p>
      <p>Best regards, <br> The ${company} Team</p>
    `,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendmail(email, firstName, password, company) {
  const resend = new Resend("re_CMTPfwL3_6L7GpSnu7bke9EgJgu5KffQQ");

  resend.emails.send({
    from: "customer@shabab.site",
    to: email,
    subject: `Welcome to ${company}, ${firstName}!`,
    html: `
       <h1>Welcome, ${firstName}!</h1>
      <p>Thank you for joining ${company}. We're thrilled to have you as part of our community!</p>
     <p>You can now access your dashboard using the credentials below:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p><a href="https://app.perktify.com/login" target="_blank">Click here to login to your dashboard</a></p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
       <p>Happy exploring!</p>
       <p>Best regards, <br> The ${company} Team</p>
    `,
  });
}

export async function sendmails(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { subject, msg, emails } = data;

  // Convert it back into an array
  const recipientsArray = emails.split(",");

  const resend = new Resend("re_Pn5pomA5_9w5UjrbBtz5McXQzzjfRbrgu");

  try {
    const { data, error } = await resend.emails.send({
      from: "storekwil@shabab.site",
      to: recipientsArray,
      subject: subject,
      html: `
        <h1>Excited Offers from StoreKwil!</h1>
        <p>${msg}</p>
  
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy shopping!</p>
        <p>The StoreKwil Team</p>
      `,
    });

    if (error) {
      return { message: `${error?.message}`, type: "error" };
    }

    return { message: "Mail Sent Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// Upload Marketing Material
export async function uploadMaterial(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { file } = data;

  try {
    const { storage } = await createAdminClient();

    // Upload File
    await storage.createFile(
      process.env.NEXT_PUBLIC_MARKETING_MATERIAL_STORAGE,
      ID.unique(),
      file
    );

    revalidatePath("/", "layout");
    return { message: "File Uploaded Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// create Compaign
export async function createCompaign(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { title, reward, expiry, file } = data;

  const rewardPoints = parseInt(reward);

  try {
    const { users, storage, databases } = await createAdminClient();
    const user = await auth.getUser();
    const prefs = await users.getPrefs(user.$id);

    // Upload File
    const poster = await storage.createFile(
      process.env.NEXT_PUBLIC_POSTERS_STORAGE,
      ID.unique(),
      file
    );

    await databases.createDocument(
      // process.env.NEXT_PUBLIC_DATABASE_ID,
      // process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS,
      prefs.dbId,
      prefs.campaigns,
      ID.unique(),
      {
        title,
        reward: rewardPoints,
        expiry,
        poster: poster.$id,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Compaign Created Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

export async function updateCompaign(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { docID, expiry } = data;

  try {
    const { databases } = await createAdminClient();

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS,
      docID,
      {
        expiry,
      }
    );

    revalidatePath("/", "layout");
    return { message: "Compaign Updated Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

// Delete Marketing Material
export async function deleteCompaign(formData) {
  const data = Object.fromEntries(formData);
  const { fileID, docID } = data;

  try {
    const { storage, databases } = await createAdminClient();

    // Delete File
    await storage.deleteFile(process.env.NEXT_PUBLIC_POSTERS_STORAGE, fileID);
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS,
      docID
    );

    revalidatePath("/", "layout");
    return { message: "File Deleted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}
// Delete Marketing Material
export async function deleteMaterial(formData) {
  const data = Object.fromEntries(formData);
  const { fileID } = data;

  try {
    const { storage } = await createAdminClient();

    // Delete File
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_MARKETING_MATERIAL_STORAGE,
      fileID
    );

    revalidatePath("/", "layout");
    return { message: "File Deleted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

export async function deleteReward(formData) {
  const data = Object.fromEntries(formData);
  const { fileID } = data;

  try {
    const { databases } = await createAdminClient();

    // Delete File
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_REWARDS,
      fileID
    );

    revalidatePath("/", "layout");
    return { message: "File Deleted Successfully", type: "success" };
  } catch (error) {
    return { message: `${error?.message}`, type: "error" };
  }
}

const extractConfigValues = (configString) => {
  const keys = [
    "pid",
    "dbid",
    "users",
    "points",
    "tiers",
    "rewards",
    "transactions",
    "queries",
    "leads",
    "campaigns",
  ];
  const values = [];

  // Loop through and extract each 20-character block
  for (let i = 0; i < keys.length; i++) {
    values.push(configString.slice(i * 20, (i + 1) * 20));
  }

  // Assign each value to its corresponding key
  const config = keys.reduce((acc, key, index) => {
    acc[key] = values[index];
    return acc;
  }, {});

  return config;
};

export async function BuySubscription() {
  const { users } = await createAdminClient();
  const user = await auth.getUser();
  const prefs = await users.getPrefs(user.$id);
  const customerId = prefs.dbId;

  console.log("running stripe...");
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount_decimal: 10 * 100,
            product_data: {
              name: "Premium Subscription",
              description: "Upgrade to remove Footer ",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        ProductPrice: 10 * 100,
        CustomerID: prefs.dbId,
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/admin/stripe/payment/${customerId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
    });
  } catch (error) {
    console.log(error);
    return { message: error?.message };
  }

  revalidatePath("/", "layout");
  return redirect(session.url);
}
function accountClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)               // e.g. https://cloud.appwrite.io/v1
    .setProject(process.env.APPWRITE_PROJECT_ID);             // your project ID
  return new Account(client);
}

/** Step 1: send email with recovery link */
// Look at your createAdminClient function and use the same variables
export async function startPasswordReset(prevState, formData) {
  try {
    const email = String(formData.get("email") || "").trim();
    if (!email) return { type: "error", message: "Email is required." };

    // Use the same client creation as your other functions
    const { account } = await createAdminClient();
    
    const redirectUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/password/reset/user`;
    
    await account.createRecovery(email, redirectUrl);
    
    return {
      type: "success",
      message: "Reset link sent successfully!"
    };

  } catch (error) {
    console.error("Recovery error:", error);
    return { type: "error", message: error?.message || "Recovery failed" };
  }
}

/** Step 2: complete reset using userId + secret from the email link */
export async function completePasswordReset(prevState, formData) {
  try {
    const userId = String(formData.get("userId") || "");
    const secret = String(formData.get("secret") || "");
    const newpwd = String(formData.get("newpwd") || "");
    const confirmpwd = String(formData.get("confirmpwd") || "");

    if (!userId || !secret) return { type: "error", message: "Invalid or expired link." };
    if (!newpwd || newpwd !== confirmpwd) return { type: "error", message: "Passwords don’t match." };

    const account = accountClient();
    await account.updateRecovery(userId, secret, newpwd, confirmpwd);

    return { type: "success", message: "Password updated. You can now sign in." };
  } catch (err) {
    console.error("completePasswordReset error", err);
    return { type: "error", message: "Reset failed. Your link may have expired—start again." };
  }
}
