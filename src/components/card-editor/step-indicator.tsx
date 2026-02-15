interface StepIndicatorProps {
  currentStep: number
  steps: string[]
  onStepClick?: (step: number) => void
}

export function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isClickable = isCompleted && onStepClick

          return (
            <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full
                  font-semibold text-sm transition-all
                  ${isCurrent ? "bg-rose-600 text-white ring-4 ring-rose-100" : ""}
                  ${isCompleted ? "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700" : ""}
                  ${!isCurrent && !isCompleted ? "bg-gray-200 text-gray-500" : ""}
                  ${isClickable ? "hover:scale-110" : ""}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </button>

              {/* Step Label */}
              <div className="ml-3 hidden sm:block">
                <p
                  className={`
                    text-sm font-medium
                    ${isCurrent ? "text-rose-600" : ""}
                    ${isCompleted ? "text-emerald-600" : ""}
                    ${!isCurrent && !isCompleted ? "text-gray-500" : ""}
                  `}
                >
                  {step}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-4 rounded-full transition-colors
                    ${isCompleted ? "bg-emerald-600" : "bg-gray-200"}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Label */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-medium text-rose-600">{steps[currentStep - 1]}</p>
      </div>
    </div>
  )
}
