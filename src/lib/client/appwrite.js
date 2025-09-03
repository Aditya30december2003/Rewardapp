// src/lib/client/appwrite.js
import { Client, Account, Teams, Databases, ID, Query } from "appwrite";

// This file is safe for the browser. Use NEXT_PUBLIC_* here.
export function getBrowserSDK() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

  return {
    client,
    account: new Account(client),
    teams: new Teams(client),
    databases: new Databases(client),
    ID,
    Query,
  }; 
}
export function createWebClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

  return { client, account: new Account(client) };
}
