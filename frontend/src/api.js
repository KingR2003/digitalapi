const API_BASE = '/api/v1';

export const getAuthToken = () => localStorage.getItem('quiz_token');

export const setAuthSession = (token, user) => {
  localStorage.setItem('quiz_token', token);
  localStorage.setItem('quiz_user', JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem('quiz_token');
  localStorage.removeItem('quiz_user');
};

export const getStoredUser = () => {
  const data = localStorage.getItem('quiz_user');
  return data ? JSON.parse(data) : null;
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email, password, fullName) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    }),

  // Wallet
  getWallet: () => request('/wallet/me'),
  getTransactions: (page = 0, size = 10) =>
    request(`/wallet/transactions?page=${page}&size=${size}`),
  mockBuyCredits: (credits, paymentMethod) =>
    request('/wallet/mock-buy', {
      method: 'POST',
      headers: {
        'Idempotency-Key': `PAY_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      },
      body: JSON.stringify({
        credits,
        paymentMethod: paymentMethod || 'MOCK_UPI',
      }),
    }),

  // Quizzes
  getQuizzes: () => request('/quizzes'),
  getQuiz: (id) => request(`/quizzes/${id}`),
  startQuiz: (id) =>
    request(`/quizzes/${id}/start`, {
      method: 'POST',
    }),
  submitQuiz: (attemptId, answers) =>
    request(`/quizzes/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  // Admin
  getAdminQuizzes: () => request('/admin/quizzes'),
  createQuiz: (quizData) =>
    request('/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    }),
  deleteQuiz: (id) =>
    request(`/admin/quizzes/${id}`, {
      method: 'DELETE',
    }),
  addQuestion: (quizId, questionData) =>
    request(`/admin/quizzes/${quizId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    }),
  deleteQuestion: (questionId) =>
    request(`/admin/questions/${questionId}`, {
      method: 'DELETE',
    }),
};
