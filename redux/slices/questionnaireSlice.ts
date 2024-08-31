// /Users/bailangcheng/Desktop/semo/redux/slices/questionnaireSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuestionnaireData {
  relationshipStatus: string;
  breakupDuration: string;
  currentEmotion: string;
  desiredOutcome: string;
  age: string;    // 新增的字段
  gender: string; // 新增的字段
}

const initialState: QuestionnaireData = {
  relationshipStatus: '',
  breakupDuration: '',
  currentEmotion: '',
  desiredOutcome: '',
  age: '',    // 初始化
  gender: '', // 初始化
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    updateAnswer: (state, action: PayloadAction<{ question: keyof QuestionnaireData, answer: string }>) => {
      const { question, answer } = action.payload;
      state[question] = answer;
    },
  },
});

export const { updateAnswer } = questionnaireSlice.actions;
export default questionnaireSlice.reducer;