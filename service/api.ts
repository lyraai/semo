// /Users/bailangcheng/Desktop/semo/service/api.ts
import axios from 'axios';
import { QuestionnaireData } from '../redux/slices/questionnaireSlice';

const BASE_URL = 'https://flask-hello-world-295622083030.asia-northeast1.run.app';

let useMock = false;

export const checkBackendConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/hello`);
    useMock = false;
    return response.data;
  } catch (error) {
    console.error('Failed to connect to backend:', error);
    useMock = true;
  }
};

export const generateUserId = async () => {
  if (useMock) {
    return mockGenerateUserId();
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/generate_user_id`);
    return response.data.semo_user_id;
  } catch (error) {
    console.error('Failed to generate user ID:', error);
    useMock = true;
    return mockGenerateUserId();
  }
};

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
    return response.data; // 返回完整的响应数据
  } catch (error) {
    console.error('Failed to get AI response:', error);
    useMock = true;
    return mockGetAIResponse(message);
  }
};

export const getReport = async (semoUserId: string) => {
  if (useMock) {
    return mockGetReport();
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/semo/v1/get_report`, {
      params: {
        semo_user_id: semoUserId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get report:', error);
    useMock = true;
    return mockGetReport();
  }
};

const mockGetReport = async () => {
  console.log('Simulated report retrieval');
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      summary: '模拟的情绪报告摘要。',
      recommendations: ['建议1', '建议2', '建议3'],
      emotion_list: [0.2, 0.4, 0.6, 0.8],
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