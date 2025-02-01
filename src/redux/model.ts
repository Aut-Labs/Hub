 
import { AlertColor } from "@mui/material/Alert";

export interface SnackbarPayload {
  message: string;
  severity?: AlertColor;
  duration?: number;
}

export interface CurrentStep {
  activeStep: number;
  title: string;
  description: string;
  toPrevBtnPath: string;
  stepperText: string;
  descriptionTooltip: string;
}

export enum TaskStatus {
  Created = 0,
  Taken,
  Submitted,
  Finished
}

export enum TaskTypes {
  Open,
  Ongoing,
  Closed,
  MyTasks
}

export interface GroupTask {
  label: string;
  tasks: Task[];
}
export interface Task {
  activityId: string;
  createdOn: string;
  status: TaskStatus;
  description: string;
  title: string;
  creator: string;
  taker: string;
  owner: {
    tokenId: string;
    imageUrl: string;
    nickname: string;
  };
}
