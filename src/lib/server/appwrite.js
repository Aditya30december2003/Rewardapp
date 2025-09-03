// src/lib/server/appwrite.js
import "server-only";
import { Client, Account, Databases, Storage, Teams, Users, ID, Query } from "node-appwrite";

// Use NON-public env vars on the server.
// Do NOT read NEXT_PUBLIC_* here unless you really have to.
const ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT  = process.env.APPWRITE_PROJECT || process.env.NEXT_PUBLIC_PROJECT_ID;
const API_KEY  = process.env.APPWRITE_API_KEY;

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT)
    .setKey(API_KEY);

  return {
    client,
    account:   new Account(client),
    databases: new Databases(client),
    storage:   new Storage(client),
    teams:     new Teams(client),
    users:     new Users(client),
    ID,
    Query,
  };
}

/** Server-side client using JWT (from Web SDK). */
export function createSessionClient(jwt) {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT);

  if (jwt) client.setJWT(jwt);

  return {
    client,
    account:   new Account(client),
    databases: new Databases(client),
    storage:   new Storage(client),
    teams:     new Teams(client),
    users:     new Users(client),
    ID,
    Query,
  };
}

/** Second project (Storekwil) – server-only */
export function storekwilAdminClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT) // or a separate endpoint if different
    .setProject(process.env.STOREKWIL_PROJECT_ID || process.env.NEXT_PUBLIC_STOREKWIL_PROJECT_ID)
    .setKey(process.env.STOREKWIL_API_KEY);

  return {
    client,
    account:   new Account(client),
    databases: new Databases(client),
    storage:   new Storage(client),
    teams:     new Teams(client),
    users:     new Users(client),
    ID,
    Query,
  };
}
