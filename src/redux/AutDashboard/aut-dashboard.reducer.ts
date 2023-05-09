import { ResultState } from "@store/result-status";
import { createSlice } from "@reduxjs/toolkit";
import { LockDatatableItems } from "@components/datatable/DatatableHelpers";
import { createSelector } from "reselect";
import {
  getWhitelistedAddresses,
  addNewWhitelistedAddresses,
  addPAUrl,
  getPAUrl,
  addPAContracts,
  getPAContracts,
  addDiscordToCommunity
} from "@api/community.api";
// export const addDiscordWebhook = createAsyncThunk('aut-dashboard/discord/addurl', async (payload: any, { dispatch }) => {
//   try {
//     dispatch(openSnackbar({ message: 'Discord webhook was updated successfully', severity: 'success' }));
//     return url;
//   } catch (error) {
//     const message = ErrorParser(error);
//     dispatch(openSnackbar({ message, severity: 'error' }));
//     throw new Error(message);
//   }
// });

export interface AutDashboardState {
  whitelistedAddresses: any[];
  contracts: any[];
  status: ResultState;
  paUrl: string;
  errorMessage: string;
}

const initialState = {
  contracts: [],
  whitelistedAddresses: [],
  paUrl: null,
  status: ResultState.Idle,
  errorMessage: ""
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetAutDashboardState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDiscordToCommunity.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(addDiscordToCommunity.fulfilled, (state) => {
        state.status = ResultState.Idle;
      })
      .addCase(addDiscordToCommunity.rejected, (state, action) => {
        if (!action.meta.aborted) {
          state.status = ResultState.Failed;
        } else {
          state.status = ResultState.Idle;
        }
      })
      .addCase(getWhitelistedAddresses.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(getWhitelistedAddresses.fulfilled, (state, action) => {
        // state.whitelistedAddresses = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(getWhitelistedAddresses.rejected, (state, action) => {
        state.whitelistedAddresses = [];
        if (!action.meta.aborted) {
          state.status = ResultState.Failed;
        } else {
          state.status = ResultState.Idle;
        }
        state.errorMessage = action.payload as string;
      })
      .addCase(getPAContracts.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(getPAContracts.fulfilled, (state, action) => {
        // state.contracts = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(getPAContracts.rejected, (state, action) => {
        state.contracts = [];
        if (!action.meta.aborted) {
          state.status = ResultState.Failed;
        } else {
          state.status = ResultState.Idle;
        }
        state.errorMessage = action.payload as string;
      })

      .addCase(getPAUrl.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(getPAUrl.fulfilled, (state, action) => {
        state.paUrl = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(getPAUrl.rejected, (state, action) => {
        state.paUrl = null;
        if (!action.meta.aborted) {
          state.status = ResultState.Failed;
        } else {
          state.status = ResultState.Idle;
        }
        state.errorMessage = action.payload as string;
      })

      .addCase(addPAUrl.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(addPAUrl.fulfilled, (state) => {
        state.status = ResultState.Idle;
      })
      .addCase(addPAUrl.rejected, (state, action) => {
        if (!action.meta.aborted) {
          state.status = ResultState.Failed;
        } else {
          state.status = ResultState.Idle;
        }
        state.errorMessage = action.payload as string;
      })

      .addCase(addNewWhitelistedAddresses.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(addNewWhitelistedAddresses.fulfilled, (state) => {
        state.status = ResultState.Idle;
      })
      .addCase(addNewWhitelistedAddresses.rejected, (state, action) => {
        if (!action.meta.aborted) {
          state.status = ResultState.Failed;
        } else {
          state.status = ResultState.Idle;
        }
        state.errorMessage = action.payload as string;
      })

      .addCase(addPAContracts.pending, (state) => {
        state.status = ResultState.Updating;
      })
      .addCase(addPAContracts.fulfilled, (state) => {
        state.status = ResultState.Idle;
      })
      .addCase(addPAContracts.rejected, (state, action) => {
        if (!action.meta.aborted) {
          state.status = ResultState.Failed;
        } else {
          state.status = ResultState.Idle;
        }
        state.errorMessage = action.payload as string;
      });
  }
});

const addresses = (state) => state.dashboard.whitelistedAddresses;
const contracts = (state) => state.dashboard.contracts;

export const PaUrl = (state) => state.dashboard.paUrl as string;

export const DiscordWebHookUrl = (state) =>
  state.dashboard?.paCommunity?.discordWebhookUrl;

export const getLockedContracts = createSelector(contracts, (x1) => {
  let lockedData = LockDatatableItems(
    x1.map((c) => {
      return {
        use: "N/A",
        address: c,
        addedBy: "N/A"
      };
    })
  );

  if (!lockedData.length) {
    lockedData = [{ id: 0, isNew: true, locked: false }];
  }
  return lockedData;
});

export const getLockedWhitelistedAddresses = createSelector(addresses, (x1) => {
  let lockedData = LockDatatableItems(
    x1.map((w) => {
      return {
        name: w.name,
        address: w.address
      };
    })
  );

  if (!lockedData.length) {
    lockedData = [{ id: 0, isNew: true, locked: false }];
  }
  return lockedData;
});

export default dashboardSlice.reducer;
