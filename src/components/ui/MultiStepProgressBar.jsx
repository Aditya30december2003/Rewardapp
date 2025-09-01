import React from 'react';

const MultiStepProgressBar = ({ steps, activeStep }) => {
  return (
    <div className="flex items-center justify-center mb-8 ">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {/* Circle */}
          <div
            className={`flex items-center justify-center w-12 md:w-16 h-12 md:h-16 rounded-full border-2 ${
              step < activeStep
                ? 'bg-secondary border-secondary text-white' // Completed step
                : step === activeStep
                ? 'border-secondary text-secondary' // Current step
                : 'border-gray-300 text-gray-300' // Upcoming step
            }`}
          >
            <span className="text-lg font-semibold">{step}</span>
          </div>

          {/* Connecting Line (if not the last step) */}
          {index !== steps.length - 1 && (
            <div className="flex flex-col gap-1 ">
              <div className={`w-24 h-0.5 ${step < activeStep ? 'bg-secondary' : 'bg-gray-300'}`}></div>
              <div className={`w-24 h-0.5 ${step < activeStep ? 'bg-secondary' : 'bg-gray-300'}`}></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiStepProgressBar;
