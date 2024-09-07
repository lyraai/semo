// /redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义用户的初始状态
interface UserState {
  userId: string | null;
}

const initialState: UserState = {
  userId: null,
};

// 创建一个 slice 来管理 userId
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;  // 更新 userId
    },
    clearUserId: (state) => {
      state.userId = null;  // 清除 userId
    },
  },
});

export const { updateUserId, clearUserId } = userSlice.actions;
export default userSlice.reducer;