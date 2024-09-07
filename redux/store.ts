// /redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';  // 引入 userSlice
import questionnaireReducer from './slices/questionnaireSlice';  // 假设你有其他 slice

export const store = configureStore({
  reducer: {
    user: userReducer,  // 注册 user reducer
    questionnaire: questionnaireReducer,  // 假设你有的问卷数据 reducer
  },
});

// 导出 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;