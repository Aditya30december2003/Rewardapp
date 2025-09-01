"use server";
import {
  ID,
  Permission,
  RelationMutate,
  RelationshipType,
  Role,
} from "node-appwrite";
import { createAdminClient } from "./config";

import auth from "../lib/auth";
import getOrCreateDB from "./dbModel/dbSetup";

// export const intializeDb = async () => {
//   try {
//     const db = await getOrCreateDB();
//     return db;
//   } catch (error) {
//     console.log("error intializing db", error);
//   }
// };

export const getUserPref = async () => {
  const user = await auth.getUser();
  const { users } = await createAdminClient();
  const prefs = await users.getPrefs(user.$id);
  return prefs;
};

const dbId = ID.unique();
export const appwriteDatabase = {
  id: dbId,
  name: "newDb",
};

export const appwriteBucket = {
  id: String(process.env.NEXT_PUBLIC_BUCKET_ID),
  name: "cyberheldStorage",
};

// Centralized collections configuration
export const appwriteCollections = {
  tiers: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_TIERS),
    name: "tiers",
    permissions: [], // No permissions assigned
    attributes: [
      {
        type: "string",
        name: "label",
        size: 255,
        required: false,
      },
      {
        type: "integer",
        name: "threshold",
        required: false,
      },
    ],
  },
  campaigns: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_COMPAIGNS),
    name: "campaigns",
    permissions: [], // No permissions assigned
    attributes: [
      {
        type: "string",
        name: "title",
        size: 255,
        required: false,
      },
      {
        type: "integer",
        name: "reward",
        required: false,
      },
      {
        type: "datetime",
        name: "expiry",
        required: false,
      },
      {
        type: "string",
        name: "poster",
        size: 255,
        required: false,
      },
    ],
  },
  userPoints: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_POINTS),
    name: "userPoints",
    permissions: [], // No permissions assigned
    attributes: [
      {
        type: "integer",
        name: "points",
        required: false,
      },
    ],
  },
  queries: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_QUERIES),
    name: "queries",
    permissions: [], // No permissions assigned
    attributes: [
      {
        type: "string",
        name: "subject",
        size: 255,
        required: false,
      },
      {
        type: "string",
        name: "description",
        size: 1000,
        required: false,
      },
      {
        type: "enum",
        name: "status",
        options: ["Unread", "Read"],
        required: false,
        default: null,
      },
      {
        type: "string",
        name: "reply",
        size: 1000,
        required: false,
      },
    ],
  },
  transactions: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_TRANSACTIONS),
    name: "transactions",
    permissions: [], // No permissions assigned
    attributes: [],
  },
  rewards: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_REWARDS),
    name: "rewards",
    permissions: [], // No permissions assigned
    attributes: [
      {
        type: "string",
        name: "name",
        size: 255,
        required: false,
      },
      {
        type: "string",
        name: "promoCode",
        size: 255,
        required: false,
      },
      {
        type: "integer",
        name: "pointsRequired",
        required: false,
      },
      {
        type: "datetime",
        name: "expiry",
        required: false,
      },
      {
        type: "string",
        name: "rewardType",
        size: 255,
        required: false,
      },
    ],
    relationships: [
      {
        targetCollection: "transactions",
        type: RelationshipType.OneToMany,
        twoWays: true,
        fieldName: "transactions",
        relatedFieldName: "coupon",
        mutate: RelationMutate.Cascade,
      },
    ],
  },
  Users: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_USERS),
    name: "Users",
    permissions: [], // No permissions assigned
    attributes: [
      {
        type: "string",
        name: "firstName",
        size: 255,
        required: false,
      },
      {
        type: "string",
        name: "lastName",
        size: 255,
        required: false,
      },
      {
        type: "string",
        name: "company",
        size: 255,
        required: false,
      },
      {
        type: "string",
        name: "country",
        size: 255,
        required: false,
      },
      {
        type: "string",
        name: "referralCode",
        size: 255,
        required: false,
      },
      {
        type: "boolean",
        name: "isRefferedLead",
        required: false,
        default: false,
      },
      {
        type: "string",
        name: "refferedBy",
        size: 255,
        required: false,
      },
      {
        type: "email",
        name: "email",
        required: false,
      },
      {
        type: "string",
        name: "phone",
        size: 255,
        required: false,
      },
    ],
    relationships: [
      {
        targetCollection: "userPoints",
        type: RelationshipType.OneToMany,
        twoWays: true,
        fieldName: "earnedPoints",
        relatedFieldName: "userId",
        mutate: RelationMutate.Cascade,
      },
      {
        targetCollection: "transactions",
        type: RelationshipType.OneToMany,
        twoWays: true,
        fieldName: "transactions",
        relatedFieldName: "user",
        mutate: RelationMutate.Cascade,
      },
      {
        targetCollection: "queries",
        type: RelationshipType.OneToMany,
        twoWays: true,
        fieldName: "queries",
        relatedFieldName: "user",
        mutate: RelationMutate.Cascade,
      },
    ],
  },
  leads: {
    id: String(process.env.NEXT_PUBLIC_COLLECTION_ID_LEADS),
    name: "leads",
    permissions: [], // No permissions assigned
    attributes: [],
    relationships: [
      {
        targetCollection: "Users",
        type: RelationshipType.ManyToOne,
        twoWays: true,
        fieldName: "referredBy",
        relatedFieldName: "lead",
        mutate: RelationMutate.Cascade,
      },
      {
        targetCollection: "Users",
        type: RelationshipType.ManyToOne,
        twoWays: false,
        fieldName: "users",
        mutate: RelationMutate.SetNull,
      },
    ],
  },
};
