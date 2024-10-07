// service/api.ts
import axios from 'axios';
import { QuestionnaireData } from '../redux/slices/questionnaireSlice';

const BASE_URL = 'https://flask-hello-world-295622083030.asia-northeast1.run.app'; // 后端API的基础URL
export let useMock = false; // 导出 useMock 变量

/**
 * 检查后端连接
 */
export const checkBackendConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/hello`);
    console.log('Connected to backend'); // 连接成功时日志输出
    useMock = false;
    return response.data;
  } catch (error) {
    console.error('Failed to connect to backend:', error);
    console.log('Switching to mock mode'); // 进入模拟模式时日志输出
    useMock = true;
  }
};

/**
 * 生成用户ID
 */
export const generateUserId = async () => {
  if (useMock) {
    return mockGenerateUserId(); // 如果使用模拟模式，返回模拟的用户ID
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/generate_user_id`);
    return response.data.semo_user_id; // 从响应中获取用户ID
  } catch (error) {
    console.error('Failed to generate user ID:', error);
    useMock = true; // 失败后切换为模拟模式
    return mockGenerateUserId(); // 返回模拟的用户ID
  }
};

/**
 * 发送问卷数据（在问卷完成后发送，疗愈师默认值）
 * 
 * @param semoUserId 用户ID
 * @param data 问卷数据
 */
export const sendQuestionnaireData = async (semoUserId: string, data: QuestionnaireData) => {
  if (useMock) {
    return mockSendQuestionnaireData(data);  // 如果使用模拟模式，发送模拟数据
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/semo/v1/user/${semoUserId}/initialise`, data); // 发送数据到后端
    return response.data;
  } catch (error) {
    console.error('Failed to send questionnaire data:', error);
    useMock = true;  // 失败后切换为模拟模式
    return mockSendQuestionnaireData(data);  // 返回模拟的响应
  }
};

/**
 * 发送疗愈师风格设定（用户选择疗愈师风格后再发送一次）
 * 
 * @param semoUserId 用户ID
 * @param therapistStyle 用户选择的疗愈师风格
 */
export const updateTherapistStyle = async (semoUserId: string, therapistStyle: string) => {
  if (useMock) {
    return mockSendTherapistStyle(therapistStyle); // 模拟模式返回假数据
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/semo/v1/user/${semoUserId}/update-therapist`, {
      therapist_style: therapistStyle, // 只发送风格信息
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send therapist style:', error);
    useMock = true; // 失败后切换为模拟模式
    return mockSendTherapistStyle(therapistStyle);
  }
};

/**
 * 获取AI对话回复
 */
export const getAIResponse = async (semoUserId: string, message: string, topicId: number | null) => {
  if (useMock) {
    return mockGetAIResponse(message);
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/semo/v1/user/${semoUserId}/chat`, { 
      user_input: message,
      topic_id: topicId // 将 topic_id 发送到后端
    });
    console.log("Response from backend:", response.data);
    return response.data; // 返回完整的响应数据，包括 topic_id
  } catch (error) {
    console.error('Failed to get AI response:', error);
    useMock = true;
    return mockGetAIResponse(message);
  }
};

/**
 * 获取情绪报告
 */
export const getReport = async (semoUserId: string) => {
  if (useMock) {
    return mockGetReport(); // 如果使用模拟模式，返回模拟报告
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/user/${semoUserId}/report`); // 将 userId 添加到 URL 路径中
    return response.data;
  } catch (error) {
    console.error('Failed to get report:', error);
    useMock = true; // 失败后切换为模拟模式
    return mockGetReport(); // 返回模拟的报告
  }
};

/* 模拟函数部分（保持不变） */
const mockGetReport = async () => {
  console.log('Simulated report retrieval');
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      summary: '模拟的情绪报告摘要。',
      recommendations: ['建议1', '建议2', '建议3'],
      emotion_list: [0.2, 0.4, 0.6, 0.8], // 模拟的情绪值
    }), 1000)
  );
};

const mockGenerateUserId = async () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`mock_user_id_${Math.floor(Math.random() * 10000)}`), 500)
  );
};

const mockSendQuestionnaireData = async (data: QuestionnaireData) => {
  console.log('Simulated send questionnaire data:', data);
  return new Promise((resolve) => setTimeout(() => resolve({ status: 'success' }), 1000));
};

const mockSendTherapistStyle = async (style: string) => {
  console.log('Simulated send therapist style:', style);
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      status: 'success',
      content: `Simulated content for therapist style: ${style}`,
      predicted_options: ['选项1', '选项2'],
      topic_id: 123,
    }), 1000)
  );
};

const mockGetAIResponse = async (message: string) => {
  console.log('Simulated AI response for message:', message);
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      response: `This is a simulated AI response to: ${message}`,
      emotion: Math.random(), // 模拟情绪值
      predicted_options: ['选项1', '选项2', '选项3'] // 模拟选项
    }), 1000)
  );
};
