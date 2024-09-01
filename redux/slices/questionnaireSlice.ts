// /Users/bailangcheng/Desktop/semo/redux/slices/questionnaireSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuestionnaireData {
  age: number;  // 修改为 number 类型
  gender: string;
  duration: string;
  current_state: string;
  current_feeling: string;
  expectation: string;
  therapist_style: string;
}

const initialState: QuestionnaireData = {
  age: 0,    // 初始化为数字类型
  gender: '',
  duration: '',
  current_state: '',
  current_feeling: '',
  expectation: '',
  therapist_style: '',
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    updateAnswer: (state, action: PayloadAction<{ question: keyof QuestionnaireData, answer: any }>) => {
      const { question, answer } = action.payload;
      state[question] = answer;
    },
  },
});

export const { updateAnswer } = questionnaireSlice.actions;
export default questionnaireSlice.reducer;