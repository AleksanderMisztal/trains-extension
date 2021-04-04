import axios from 'axios';

const url = (path: string) => `http://localhost:5000${path}`;
// const url = (path: string) => `https://192.168.86.96:5000${path}`;

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
