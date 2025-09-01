import {
  ID,
  Permission,
  RelationMutate,
  RelationshipType,
  Role,
} from "node-appwrite";
import { createAdminClient } from "../config";
import {
  appwriteCollections,
  appwriteDatabase,
  getUserPref,
} from "../dbconfig";

export default async function createCollections() {
  const prefs = await getUserPref();
  const { databases } = await createAdminClient();
  // console.log(prefs.dbId)

  const requiredOrder = [
    "campaigns",
    "tiers",
    "userPoints",
    "Users",
    "leads",
    "queries",
    "rewards",
    "transactions",
  ];

  for (const key of requiredOrder) {
    const collection = appwriteCollections[key];
    console.log(`Processing collection: ${key}...`);

    // // Loop through all collections
    // for (const key in appwriteCollections) {
    //   const collection = appwriteCollections[key];

    // Create Collection
    await databases.createCollection(
      prefs.dbId,
      prefs[key],
      collection.name,
      collection.permissions,
      true
    );
    console.log(`${collection.name} Collection Created`);

    console.log(`Creating Attributes for ${collection.name}...`);

    // Create Attributes
    for (const attribute of collection.attributes) {
      if (attribute.type === "string") {
        await databases.createStringAttribute(
          prefs.dbId,
          prefs[key],
          attribute.name,
          attribute.size,
          attribute.required
        );
      } else if (attribute.type === "integer") {
        await databases.createIntegerAttribute(
          prefs.dbId,
          prefs[key],
          attribute.name,
          attribute.required
        );
      } else if (attribute.type === "email") {
        await databases.createEmailAttribute(
          prefs.dbId,
          prefs[key],
          attribute.name,
          attribute.required
        );
      } else if (attribute.type === "datetime") {
        await databases.createDatetimeAttribute(
          prefs.dbId,
          prefs[key],
          attribute.name,
          attribute.required
        );
      } else if (attribute.type === "boolean") {
        await databases.createBooleanAttribute(
          prefs.dbId,
          prefs[key],
          attribute.name,
          attribute.required
        );
      } else if (attribute.type === "enum") {
        await databases.createEnumAttribute(
          prefs.dbId,
          prefs[key],
          attribute.name,
          attribute.options,
          attribute.required,
          attribute.default
        );
      } else if (attribute.type === "url") {
        await databases.createUrlAttribute(
          prefs.dbId,
          prefs[key],
          attribute.name,
          attribute.required
        );
      }
      // Add support for other attribute types if needed
    }
  }

  // Step 2: Create Relationships
  for (const key of requiredOrder) {
    const collection = appwriteCollections[key];
    if (collection.relationships) {
      console.log(`Creating Relationships for ${collection.name}...`);
      for (const relationship of collection.relationships) {
        await databases.createRelationshipAttribute(
          prefs.dbId,
          prefs[key],
          prefs[relationship.targetCollection],
          relationship.type,
          relationship.twoWays,
          relationship.fieldName,
          relationship.relatedFieldName,
          relationship.mutate
        );
      }
      console.log(`${collection.name} Relationships Created`);
    }

    // Create default Tier documents after attribute creation
    if (key === "tiers") {
      console.log("Creating default Tier documents...");

      const defaultTiers = [
        { label: "Gold", threshold: 2500 },
        { label: "Bronze", threshold: 1002 },
        { label: "Silver", threshold: 100 },
      ];

      for (const tier of defaultTiers) {
        await databases.createDocument(prefs.dbId, prefs[key], "unique()", {
          label: tier.label,
          threshold: tier.threshold,
        });
      }

      console.log("Default Tier documents created.");
    }
  }
}
