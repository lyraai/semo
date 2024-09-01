// /Users/bailangcheng/Desktop/semo/service/api.ts
import axios from 'axios';
import { QuestionnaireData } from '../redux/slices/questionnaireSlice';

// Flask 后端的基本 URL
const BASE_URL = 'https://flask-hello-world-295622083030.asia-northeast1.run.app';

// 判断是否使用模拟模式
let useMock = false;

// 测试后端连接性的函数
export const checkBackendConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/hello`);
    useMock = false; // 后端连接成功，使用真实模式
    return response.data;
  } catch (error) {
    console.error('Failed to connect to backend:', error);
    useMock = true;  // 如果连接失败，则切换到模拟模式
  }
};

// 生产用户ID的函数
export const generateUserId = async () => {
  if (useMock) {
    return mockGenerateUserId();
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/generate_user_id`);
    return response.data.semo_user_id;
  } catch (error) {
    console.error('Failed to generate user ID:', error);
    useMock = true;  // 切换到模拟模式
    return mockGenerateUserId();
  }
};

// 发送问卷数据到后端的函数
export const sendQuestionnaireData = async (data: QuestionnaireData) => {
  if (useMock) {
    return mockSendQuestionnaireData(data);
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/semo/v1/test_info`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to send questionnaire data:', error);
    useMock = true;
    return mockSendQuestionnaireData(data);
  }
};

// 获取AI回复的函数
export const getAIResponse = async (semoUserId: string, message: string) => {
  if (useMock) {
    return mockGetAIResponse(message);
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/semo/v1/chat`, 
    { user_input: message },
    {
      params: {
        semo_user_id: semoUserId
      }
    });
    return response.data.reply; // 假设后端返回的回复字段为 reply
  } catch (error) {
    console.error('Failed to get AI response:', error);
    useMock = true;
    return mockGetAIResponse(message);
  }
};

// 模拟生成用户ID的函数
const mockGenerateUserId = async () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`mock_user_id_${Math.floor(Math.random() * 10000)}`), 500)
  );
};

// 模拟发送问卷数据的函数
const mockSendQuestionnaireData = async (data: QuestionnaireData) => {
  console.log('Simulated send questionnaire data:', data);
  return new Promise((resolve) => setTimeout(() => resolve({ status: 'success' }), 1000));
};

// 模拟获取AI回复的函数
const mockGetAIResponse = async (message: string) => {
  console.log('Simulated AI response for message:', message);
  return new Promise((resolve) =>
    setTimeout(() => resolve(`This is a simulated AI response to: ${message}`), 1000)
  );
};