import { createAdminClient } from "../config";
import { appwriteDatabase, getUserPref } from "../dbconfig";
import createCollections from "./createCollection";

export default async function getOrCreateDB() {
    const prefs = await getUserPref();
  const { databases } = await createAdminClient();
  try {
    await databases.get(prefs.dbId);
    console.log("Database connected");
  } catch (error) {
    try {
      await databases.create(prefs.dbId, prefs.company);
      console.log("database created");
      //create collections
      await createCollections()
      console.log("Collection created");
      console.log("Database connected");
    } catch (error) {
      console.log("Error creating databases or collection", error);
    }
  }

  return databases;
}
