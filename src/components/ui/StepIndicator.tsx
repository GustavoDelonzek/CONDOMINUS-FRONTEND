interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 2 }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 w-full max-w-[180px]">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < currentStep ? 'bg-brand' : 'bg-border'}`} />
        ))}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Etapa {currentStep} de {totalSteps}
      </span>
    </div>
  );
}
