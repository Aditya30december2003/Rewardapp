import MarketingMaterial from "@/components/admin/MarketingMaterial";
import { fetchAllMaterials } from "@/lib/data";
import { cookies } from "next/headers";

export default async function MarketingMaterialManagementPage() {
  cookies();
  const materials= await fetchAllMaterials()
      
  return (
    <>
      <MarketingMaterial files={materials}/>
    </>
  );
}
