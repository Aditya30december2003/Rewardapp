// Web SDK – runs in the browser only
import { Client, Account } from "appwrite";

export function createWebClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

  return { client, account: new Account(client) };
}
