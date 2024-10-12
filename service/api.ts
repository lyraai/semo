// service/api.ts
import axios, { AxiosInstance } from 'axios';
import { QuestionnaireData } from '../redux/slices/questionnaireSlice';
import { languageCode } from '../locales/localization';


const BASE_URL = 'https://flask-hello-world-295622083030.asia-northeast1.run.app'; 
// const BASE_URL = 'http://127.0.0.1:8081'; 
export let useMock = false; 

// 创建一个自定义的 Axios 实例
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// 添加请求拦截器
api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = languageCode;
  return config;
});

/**
 * Check backend connection
 * 
 * Sends: No data (GET request)
 * Receives: `{ message: string }`
 */
export const checkBackendConnection = async () => {
  try {
    const response = await api.get('/api/semo/v1/hello');
    console.log('Connected to backend');
    useMock = false;
    return response.data; // Expected format: { message: "Connected" }
  } catch (error) {
    console.error('Failed to connect to backend:', error);
    console.log('Switching to mock mode');
    useMock = true;
  }
};

/**
 * Generate a new User ID
 * 
 * Sends: No data (GET request)
 * Receives: `{ semo_user_id: string }`
 */
export const generateUserId = async () => {
  if (useMock) {
    return mockGenerateUserId();
  }

  try {
    const response = await api.get('/api/semo/v1/generate_user_id');
    return response.data.semo_user_id; // Expected format: { semo_user_id: "string" }
  } catch (error) {
    console.error('Failed to generate user ID:', error);
    useMock = true;
    return mockGenerateUserId();
  }
};

/**
 * Retrieve basic user info
 * 
 * Sends: No data (GET request)
 * Receives:
 * ```
 * {
 *   age: number,
 *   current_feeling: string,
 *   current_state: string,
 *   duration: string,
 *   expectation: string,
 *   gender: string,
 *   semo_user_id: string,
 *   therapist_style: string,
 *   message: string
 * }
 * userInfo updated: {"age": 30, "current_feeling": "Happy", "current_state": "Relaxed", "duration": "30 minutes", "expectation": "Stress relief", "gender": "Female", "message": "Data retrieved successfully", "semo_user_id": "mock_user_id_1234", "therapist_style": "Calm"}
 * ```
 */
export const getBasicUserInfo = async (semoUserId: string) => {
  if (useMock) {
    return mockGetBasicUserInfo();
  }

  try {
    const response = await api.get(`/api/semo/v1/user/${semoUserId}/basic_info`);
    return response.data; // Expected format: { age, current_feeling, current_state, etc. }
  } catch (error) {
    console.error('Failed to retrieve basic user info:', error);
    useMock = true;
    return mockGetBasicUserInfo();
  }
};

/**
 * Send Questionnaire Data (Initial user setup with therapist style)
 * 
 * Sends: 
 * - Method: POST
 * - Body: 
 *   ```
 *   {
 *     "age": number,
 *     "current_feeling": string,
 *     "current_state": string,
 *     "duration": string,
 *     "expectation": string,
 *     "gender": string,
 *     "therapist_style": string
 *   }
 *   ```
 * Receives: `{ message: string }`
 */
export const sendQuestionnaireData = async (semoUserId: string, data: QuestionnaireData) => {
  if (useMock) {
    return mockSendQuestionnaireData(data);
  }

  try {
    const response = await api.post(`/api/semo/v1/user/${semoUserId}/initialise`, data);
    return response.data; // Expected format: { message: "Data received successfully" }
  } catch (error) {
    console.error('Failed to send questionnaire data:', error);
    useMock = true;
    return mockSendQuestionnaireData(data);
  }
};

/**
 * Update Therapist Style (allows users to change their therapist's style)
 * 
 * Sends:
 * - Method: PUT
 * - Body: `{ therapist_style: string }`
 * Receives: `{ status: string }`
 */
export const updateTherapistStyle = async (semoUserId: string, therapistStyle: string) => {
  if (useMock) {
    return mockSendTherapistStyle(therapistStyle);
  }

  try {
    const response = await api.put(`/api/semo/v1/user/${semoUserId}/therapist_style`, {
      therapist_style: therapistStyle
    });
    return response.data; // Expected format: { status: "success" }
  } catch (error) {
    console.error('Failed to update therapist style:', error);
    useMock = true;
    return mockSendTherapistStyle(therapistStyle);
  }
};

/**
 * Get available therapist styles and the user's current selection
 * 
 * Sends: No data (GET request)
 * Receives:
 * ```
 * {
 *   current_style: string,
 *   styles: [
 *     {
 *       desc: string,
 *       id: string,
 *       name: string
 *     }
 *   ]
 * }
 * ```
 */
export const getTherapistStyles = async (semoUserId: string) => {
  if (useMock) {
    return mockGetTherapistStyles();
  }

  try {
    const response = await api.get(`/api/semo/v1/user/${semoUserId}/therapist_styles`);
    return response.data; 
  } catch (error) {
    console.error('Failed to get therapist styles:', error);
    useMock = true;
    return mockGetTherapistStyles();
  }
};

/**
 * Initialise chat session for a user (starts a chat session)
 * 
 * Sends: No data (GET request)
 * Receives:
 * ```
 * {
 *   content: string,
 *   predicted_options: [string],
 *   topic_id: number
 * }
 * ```
 */
export const initialiseChat = async (semoUserId: string) => {
  if (useMock) {
    return mockInitialiseChat();
  }

  try {
    const response = await api.get(`/api/semo/v1/user/${semoUserId}/chat/initialise`);
    return response.data; 
  } catch (error) {
    console.error('Failed to initialise chat:', error);
    useMock = true;
    return mockInitialiseChat();
  }
};

/**
 * Get AI chat response from backend
 * 
 * Sends:
 * - Method: POST
 * - Body: 
 *   ```
 *   {
 *     user_input: string,
 *     topic_id: number
 *   }
 *   ```
 * Receives:
 * ```
 * {
 *   response: string,
 *   emotion: number,
 *   predicted_options: [string]
 * }
 * ```
 */
export const getAIResponse = async (semoUserId: string, message: string, topicId: number | null) => {
  if (useMock) {
    return mockGetAIResponse(message);
  }

  try {
    const response = await api.post(`/api/semo/v1/user/${semoUserId}/chat`, {
      user_input: message,
      topic_id: topicId 
    });
    console.log("Response from backend:", response.data);
    return response.data; 
  } catch (error) {
    console.error('Failed to get AI response:', error);
    useMock = true;
    return mockGetAIResponse(message);
  }
};

/**
 * Retrieve user emotional report from backend
 * 
 * Sends: No data (GET request)
 * Receives:
 * ```
 * {
 *   summary: string,
 *   recommendations: [string],
 *   emotion_list: [number]
 * }
 * ```
 */
export const getReport = async (semoUserId: string) => {
  if (useMock) {
    return mockGetReport();
  }

  try {
    const response = await api.get(`/api/semo/v1/user/${semoUserId}/report`);
    return response.data; 
  } catch (error) {
    console.error('Failed to get report:', error);
    useMock = true;
    return mockGetReport();
  }
};

/* Mock functions for testing */
/* Mock functions for testing */
/* Mock functions for testing */
/* Mock functions for testing */
/* Mock functions for testing */
const mockGetReport = async () => {
  console.log('Simulated report retrieval');
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      summary: 'Simulated emotional report summary.',
      recommendations: ['Recommendation 1', 'Recommendation 2'],
      emotion_list: [0.2, 0.4, 0.6, 0.8], 
    }), 1000)
  );
};

const mockGenerateUserId = async () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`mock_user_id_${Math.floor(Math.random() * 10000)}`), 500)
  );
};

const mockGetBasicUserInfo = async () => {
  console.log('Simulated basic user info retrieval');
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      age: 30,
      current_feeling: 'Happy',
      current_state: 'Relaxed',
      duration: '30 minutes',
      expectation: 'Stress relief',
      gender: 'Female',
      semo_user_id: 'mock_user_id_1234',
      therapist_style: 'Calm',
      message: 'Data retrieved successfully'
    }), 1000)
  );
};

const mockSendQuestionnaireData = async (data: QuestionnaireData) => {
  console.log('Simulated questionnaire data submission:', data);
  return new Promise((resolve) => setTimeout(() => resolve({ status: 'success' }), 1000));
};

const mockSendTherapistStyle = async (style: string) => {
  console.log('Simulated therapist style submission:', style);
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      status: 'success',
      content: `Simulated content for therapist style: ${style}`,
      predicted_options: ['Option 1', 'Option 2'],
      topic_id: 123,
    }), 1000)
  );
};

const mockGetTherapistStyles = async () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      current_style: 'calm',
      styles: [
        { desc: 'A calm and understanding therapist', id: 'calm', name: 'Calm' },
        { desc: 'A direct and straightforward therapist', id: 'direct', name: 'Direct' }
      ]
    }), 1000)
  );
};

const mockInitialiseChat = async () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      content: 'Hello, how are you feeling today?',
      predicted_options: ['Good', 'Not so good'],
      topic_id: 456
    }), 1000)
  );
};

const mockGetAIResponse = async (message: string) => {
  console.log('Simulated AI response for message:', message);
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      response: `Simulated AI response to: ${message}`,
      emotion: Math.random(),
      predicted_options: ['Option 1', 'Option 2', 'Option 3']
    }), 1000)
  );
};
