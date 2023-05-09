import { useEffect, useState } from "react";
import StepWizard, { StepWizardChildProps } from "react-step-wizard";
import { styled } from "@mui/system";
import { Button, ButtonProps, Container } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import StepperNav from "./StepperNav";
import { StepperProps } from "./model";

const StepperWrapper = styled("div")`
  .animated {
    -webkit-animation-duration: 0.8192s;
    animation-duration: 0.8192s;
    -webkit-animation-fill-mode: backwards;
    animation-fill-mode: backwards;
  }

  /** fadeInRight */
  @-webkit-keyframes fadeInRight {
    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  .fadeInRight {
    -webkit-animation-name: fadeInRight;
    animation-name: fadeInRight;
  }

  /** fadeInLeft */
  @-webkit-keyframes fadeInLeft {
    from {
      opacity: 0;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  .fadeInLeft {
    -webkit-animation-name: fadeInLeft;
    animation-name: fadeInLeft;
  }

  /** fadeOutRight */
  @-webkit-keyframes fadeOutRight {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  @keyframes fadeOutRight {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  .fadeOutRight {
    -webkit-animation-name: fadeOutRight;
    animation-name: fadeOutRight;
  }

  /** fadeOutLeft */
  @-webkit-keyframes fadeOutLeft {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }
  }

  @keyframes fadeOutLeft {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }
  }

  .fadeOutLeft {
    -webkit-animation-name: fadeOutLeft;
    animation-name: fadeOutLeft;
  }
`;

const ActionsWrapper = styled("div")({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

export const StepperButton = ({
  label,
  ...props
}: ButtonProps & { label: string }) => {
  return (
    <Button
      sx={{
        my: pxToRem(40)
      }}
      type="submit"
      variant="outlined"
      size="large"
      color="offWhite"
      {...props}
    >
      {label}
    </Button>
  );
};

export default (props: StepperProps) => {
  const [instance, setInstance] = useState<StepWizardChildProps & any>();
  const [actions, setActions] = useState<JSX.Element>();

  useEffect(() => {
    props.instance(() => instance);
  }, [instance]);

  return (
    <Container
      maxWidth="md"
      sx={{
        width: "100%",
        flexGrow: 1,
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      <StepperWrapper>
        <StepWizard
          transitions={{
            enterRight: `animated enterRight`,
            enterLeft: `animated enterLeft`,
            exitRight: `animated exitRight`,
            exitLeft: `animated exitLeft`,
            intro: `animated exitLeft`
          }}
          isLazyMount
          nav={<StepperNav steps={props.steps} />}
          instance={setInstance}
        >
          {props.steps.map(({ component }, index) => {
            const Step = component;
            return (
              <Step
                key={`top-step-${index}`}
                setActions={setActions}
                hashKey={`Step${index + 1}`}
                stepper={instance}
              />
            );
          })}
        </StepWizard>
        <ActionsWrapper>{actions}</ActionsWrapper>
      </StepperWrapper>
    </Container>
  );
};
