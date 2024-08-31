// my-semo-app/redux/slices/questionnaireSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuestionnaireState {
  [key: string]: string;
}

const initialState: QuestionnaireState = {};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    updateAnswer: (state, action: PayloadAction<{ question: string, answer: string }>) => {
      const { question, answer } = action.payload;
      state[question] = answer;
    },
  },
});

export const { updateAnswer } = questionnaireSlice.actions;

export default questionnaireSlice.reducer;