// /redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      // 同步更新到本地存储
      AsyncStorage.setItem('userId', action.payload);
    },
    clearUserId: (state) => {
      state.userId = null;  // 清除 userId
      // 从本地存储中删除
      AsyncStorage.removeItem('userId');
    },
  },
});

export const { updateUserId, clearUserId } = userSlice.actions;
export default userSlice.reducer;

// 新增：从本地存储加载 userId 的异步 action
export const loadUserIdFromStorage = () => async (dispatch: any) => {
  try {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (storedUserId) {
      dispatch(updateUserId(storedUserId));
    }
  } catch (error) {
    console.error('Failed to load userId from storage:', error);
  }
};