// /redux/slices/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
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
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;  // 清除 userId
      // 从本地存储中删除
      AsyncStorage.removeItem('userId');
    },
  },
});

export const { setUserId, clearUserId } = userSlice.actions;
export default userSlice.reducer;

// 新增：从本地存储加载 userId 的异步 action
export const loadUserIdFromStorage = () => async (dispatch: any) => {
  try {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (storedUserId) {
      dispatch(userSlice.actions.setUserId(storedUserId));
    }
  } catch (error) {
    console.error('Failed to load userId from storage:', error);
  }
};

export const updateUserId = createAsyncThunk(
  'user/updateUserId',
  async (userId: string, { dispatch }) => {
    await AsyncStorage.setItem('userId', userId);
    dispatch(userSlice.actions.setUserId(userId));
    return userId;
  }
);
