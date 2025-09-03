import { createAdminClient } from "@/appwrite/config";
import PurchaseSubscription from "@/components/admin/PurchaseSubscription";
import auth from "@/lib/auth";
import React from "react";

const UpgradePlan = async () => {
  const { users, databases } = await createAdminClient();
  const user = await auth.getUser();
  const prefs = await users.getPrefs(user.$id);
  const data = await databases.getDocument(
    process.env.SUBSCRIPTION_DATABASE_ID

,
    process.env.SUBSCRIBERS_COLLECTION_ID

,
    prefs.dbId
  );
  return (
    <div className="border flex flex-col items-start bg-white rounded-md p-6 max-w-[700px]  ">
      <h2 className="text-2xl font-bold mb-2">Upgrade Your Plan</h2>
      <p className="text-gray-600 mb-4">
        Upgrading your plan will remove the Powered by watermark from your
        dashboard, unlock premium features, and give you a smoother experience.
      </p>
      <PurchaseSubscription bodyColor={data.bodyColor} />
    </div>
  );
};

export default UpgradePlan;
