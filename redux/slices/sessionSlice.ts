import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  sessionId: number | null;
}

const initialState: SessionState = {
  sessionId: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<number>) => {
      state.sessionId = action.payload;
    },
    clearSessionId: (state) => {
      state.sessionId = null;
    },
  },
});

export const { setSessionId, clearSessionId } = sessionSlice.actions;
export default sessionSlice.reducer;
