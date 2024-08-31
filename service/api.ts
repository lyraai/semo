import axios from 'axios';
import { QuestionnaireData } from '../redux/slices/questionnaireSlice';

// 发送问卷数据到后端的函数
// export const sendQuestionnaireData = async (data: QuestionnaireData) => {
//   try {
//     const response = await axios.post('https://your-backend-api.com/questionnaire', data);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to send questionnaire data:', error);
//     throw error;
//   }
// };

// // 获取AI回复的函数
// export const getAIResponse = async (message: string) => {
//   try {
//     const response = await axios.post('https://your-backend-api.com/ai', { message });
//     return response.data.reply; // 假设后端返回的回复字段为 reply
//   } catch (error) {
//     console.error('Failed to get AI response:', error);
//     throw error;
//   }
// };
// src/services/api.ts

// 模拟发送问卷数据的函数
export const sendQuestionnaireData = async (data: QuestionnaireData) => {
    console.log('Simulated send questionnaire data:', data);
    return new Promise((resolve) => setTimeout(() => resolve({ status: 'success' }), 1000));
  };
  
  // 模拟获取AI回复的函数
  export const getAIResponse = async (message: string) => {
    console.log('Simulated AI response for message:', message);
    return new Promise((resolve) =>
      setTimeout(() => resolve(`This is a simulated AI response to: ${message}`), 1000)
    );
  };