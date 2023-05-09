import {
  AnyAction,
  AsyncThunkPayloadCreatorReturnValue,
  ThunkDispatch
} from "@reduxjs/toolkit";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { FallbackIfUnknown } from "@reduxjs/toolkit/dist/tsHelpers";
import { Web3ProviderExtras } from "@aut-labs-private/abi-types";

export type AppDispatch = ThunkDispatch<any, any, AnyAction>;

export interface BaseThunkArgs<FunctionsTypes, EventType> {
  provider: (
    addressOrName: string,
    extras?: Partial<Web3ProviderExtras<EventType>>
  ) => Promise<FunctionsTypes>;
  updateTransactionStateAction?: (state: string, dispatch: AppDispatch) => void;
  updateErrorStateAction?: (error: string, dispatch: AppDispatch) => void;
}

export interface ProviderEvent<EventType> {
  type?: string;
  event: EventType;
}

export interface ProviderThunkType {
  type: string;
}

export type ThunkArgs<EventType> = ProviderEvent<EventType> | ProviderThunkType;

export interface AsyncThunkConfig {
  state?: any;
  dispatch?: AppDispatch;
  extra?: any;
  rejectValue?: any;
  serializedErrorType?: any;
  pendingMeta?: any;
  fulfilledMeta?: any;
  rejectedMeta?: any;
}

type GetState<ThunkApiConfig> = ThunkApiConfig extends {
  state: infer State;
}
  ? State
  : any;
type GetExtra<ThunkApiConfig> = ThunkApiConfig extends {
  extra: infer Extra;
}
  ? Extra
  : any;
type GetDispatch<ThunkApiConfig> = ThunkApiConfig extends {
  dispatch: AppDispatch;
}
  ? FallbackIfUnknown<
      AppDispatch,
      ThunkDispatch<
        GetState<ThunkApiConfig>,
        GetExtra<ThunkApiConfig>,
        AnyAction
      >
    >
  : ThunkDispatch<
      GetState<ThunkApiConfig>,
      GetExtra<ThunkApiConfig>,
      AnyAction
    >;

export type GetThunkAPI<ThunkApiConfig> = BaseThunkAPI<
  GetState<ThunkApiConfig>,
  GetExtra<ThunkApiConfig>,
  GetDispatch<ThunkApiConfig>,
  GetRejectValue<ThunkApiConfig>,
  GetRejectedMeta<ThunkApiConfig>,
  GetFulfilledMeta<ThunkApiConfig>
>;
type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
  rejectValue: infer RejectValue;
}
  ? RejectValue
  : any;
type GetFulfilledMeta<ThunkApiConfig> = ThunkApiConfig extends {
  fulfilledMeta: infer FulfilledMeta;
}
  ? FulfilledMeta
  : any;
type GetRejectedMeta<ThunkApiConfig> = ThunkApiConfig extends {
  rejectedMeta: infer RejectedMeta;
}
  ? RejectedMeta
  : any;

export type AsyncThunkPayloadCreator<
  ContractFunction,
  Returned,
  ThunkArg,
  ThunkApiConfig extends AsyncThunkConfig = any
> = (
  contract: ContractFunction,
  arg?: ThunkArg,
  thunkAPI?: GetThunkAPI<ThunkApiConfig>
) => Promise<AsyncThunkPayloadCreatorReturnValue<Returned, ThunkApiConfig>>;
