import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";

// Step 5: Success Message

const StepFive = () => {
  const router=useRouter()
  const caseId=localStorage.getItem('NewCaseID')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    localStorage.clear()
    router.push(`/staff/cases/${caseId}`)
  },[])
  return(
    <div className="p-6 bg-white rounded-xl border text-center flex flex-col items-center justify-center gap-4">
      <FaRegCircleCheck className="text-4xl text-green-600" />
      <div>
        <h2 className="text-2xl font-semibold mb-1">Case Filed Successfully!</h2>
        <p className="text-gray-700 text-lg">Your case has been created.</p>
      </div>
  
      {loading && <div className="flex items-center justify-start gap-1">
        <Oval
          visible={true}
          height="20"
          width="20"
          strokeWidth="4"
          color="#5064CE"
          secondaryColor="#666"
          ariaLabel="infinity-spin-loading"
        />
        <span>Redirecting...</span>
      </div>}
    </div>
  );
}

export default StepFive;
