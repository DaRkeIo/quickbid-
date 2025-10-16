import api from './api';

export const checkEmail = async (email: string) => {
  try {
    const response = await api.post('/auth/check-email', { email });
    return response.data;
  } catch (error: any) {
    console.error('Error checking email:', error);
    return { exists: false, message: error.response?.data?.message || 'Failed to check email' };
  }
};
