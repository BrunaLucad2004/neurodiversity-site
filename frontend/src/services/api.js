import axios from 'axios';

export const api = axios.create({
  withCredentials: true,
  credentials: 'include',
  baseURL: process.env.REACT_APP_API_URL,
});

export const createSession = async (email, password) => api.post('/auth/login', { email, password });

export const deleteSession = async () => api.post('/auth/logout', {});

export const createUser = async (options) => api.post('/users', options);

export const getUsers = async () => api.get('/users');

export const deleteUser = async (id) => api.delete(`/users/${id}`);

export const getUserId = async (id) => api.get(`/users/${id}`);

export const updateUserId = async (id, data) => api.put(`/users/${id}`, data);

export const getFonts = async () => api.get('/fonts');

export const deleteFont = async (id) => api.delete(`/fonts/${id}`);

export const getFontId = async (id) => api.get(`/fonts/${id}`);

export const updateFontId = async (id, data) => api.put(`/fonts/${id}`, data);

export const createFont = async (data) => api.post('/fonts', data);

export const getArts = async ({ font, page = 1, limit = 10, search, title, code, author } = {}) => {
  const params = { page, limit };
  if (font) params.font = font;
  if (search) params.search = search;
  else {
    if (title) params.title = title;
    if (code) params.code = code;
  }
  if (author) params.author = author;
  return api.get('/artworks', { params });
};

export const deleteArt = async (id) => api.delete(`/artworks/${id}`);

export const createArt = async (data) => api.post('/artworks', {
  ...data,
  attributes: JSON.stringify(data.attributes)
}, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const getArtId = async (id) => api.get(`/artworks/${id}`);

export const updateArtId = async (id, data) => api.put(`/artworks/${id}`, data);

export const getArtsByAttributes = async (fontName, attributesAndValues) => {
  const names = [];
  const values = [];

  attributesAndValues.forEach((attributeAndValue) => {
    if (attributeAndValue.isSelected) {
      names.push(attributeAndValue.name);
      values.push(attributeAndValue.value);
    }
  });

  const queryNames = names.map((name) => `names=${name}`).join('&');
  const queryValues = values.map((value) => `values=${value}`).join('&');
  const queryParam = `${queryNames}&${queryValues}`;

  return api.get(`/fonts/${fontName}/artworks?${queryParam}`);
}

export const postComment = async (id, data) => api.post(`/artworks/${id}`, data);

export const deletComment = async (id, commentId) => api.delete(`/artworks/${id}/${commentId}`)

export const getDashboardInfo = async () => api.get('/dashboard');
