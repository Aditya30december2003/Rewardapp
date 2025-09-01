"use client";
import MultiStepProgressBar from "@/components/ui/MultiStepProgressBar";
import { useEffect, useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import { ID } from "node-appwrite";


// Main Multi-Step Form Component
export default function MultiStepForm({victims,platforms,profileHandles,perpetrators}) {
    // Define the steps array
    const steps = [1, 2, 3, 4];
    const [step, setStep] = useState(1);
     
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    useEffect(
      ()=>{
        localStorage.clear();
      },[]
    )
  
    return (
      <div className="max-w-screen-md mx-auto p-6 py-8 bg-light rounded-xl ">
        {/* Progress Bar */}
        <MultiStepProgressBar steps={steps} activeStep={step} />
        {step === 1 && (
          <StepOne
            victims={victims}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <StepTwo
          profileHandles={profileHandles}
            platforms={platforms}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 3 && (
          <StepThree
          perpetrators={perpetrators}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 4 && (
          <StepFour
          profileHandles={profileHandles}
          platforms={platforms}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 5 && <StepFive />}
      </div>
    );
  }