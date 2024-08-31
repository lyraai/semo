// my-semo-app/redux/slices/questionnaireSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义 QuestionnaireData 接口
export interface QuestionnaireData {
  relationshipStatus: string;
  breakupDuration: string;
  currentEmotion: string;
  desiredOutcome: string;
}

// 初始化状态
const initialState: QuestionnaireData = {
  relationshipStatus: '',
  breakupDuration: '',
  currentEmotion: '',
  desiredOutcome: '',
};

// 创建 slice
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

// 导出 actions 和 reducer
export const { updateAnswer } = questionnaireSlice.actions;
export default questionnaireSlice.reducer;