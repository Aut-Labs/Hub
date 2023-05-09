import { StepWizardChildProps, StepWizardProps } from "react-step-wizard";

export interface StepperChildProps extends Partial<StepWizardProps> {
  stepper: StepWizardChildProps;
  setActions?: (fn: () => JSX.Element) => void;
}

interface StepComponent {
  (props: StepperChildProps): React.ReactElement<StepperChildProps> | null;
}

export interface Step {
  component: StepComponent;
  title: string;
  description: JSX.Element | string;
}

export interface StepperProps {
  steps: Step[];
  instance?: (fn: () => StepWizardChildProps & any) => void;
}

export interface StepperNavProps extends Partial<StepWizardChildProps> {
  steps: Step[];
}
