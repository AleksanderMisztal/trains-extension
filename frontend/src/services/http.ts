import axios from 'axios';

const BACKEND =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4001' : '/api';
const url = (path: string) => `${BACKEND}${path}`;

async function get(endpoint: string, data?: object, token?: string) {
  const response = await axios({
    method: 'get',
    url: url(endpoint),
    data,
    headers: { 'x-auth-token': token },
  });
  return response;
}
async function post(endpoint: string, data?: object, token?: string) {
  const response = await axios({
    method: 'post',
    url: url(endpoint),
    data,
    headers: token ? { 'x-auth-token': token } : {},
  });
  return response;
}

export default {
  get,
  post,
};
