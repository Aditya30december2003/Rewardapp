import { Permission, Role } from "node-appwrite";
import { createAdminClient } from "../config";
import { appwriteBucket } from "../dbconfig";


export default async function getOrCreateStorage() {
    const { storage } = await createAdminClient();
    try {
        
        await storage.getBucket(appwriteBucket.id);
        console.log("Storage Connected");
    } catch (error) {
        try {
            await storage.createBucket(
                appwriteBucket.id,
                appwriteBucket.name,
                [
                    Permission.create("users"),
                    Permission.read(Role.label("admin")),
                    Permission.read(Role.label("lawyer")),
                    Permission.read(Role.label("staff")),
                    Permission.create(Role.label("admin")),
                    Permission.create(Role.label("lawyer")),
                    Permission.create(Role.label("staff")),
                ],
                false,
                // undefined,
                // undefined,
                // ["jpg", "png", "gif", "jpeg", "webp", "heic"]
            );

            console.log("Storage Created");
            console.log("Storage Connected");
        } catch (error) {
            console.error("Error creating storage:", error);
        }
    }
}
