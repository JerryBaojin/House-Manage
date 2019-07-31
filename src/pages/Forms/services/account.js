import request from '@/utils/request';
import {page_size} from '@/defaultSettings.js'
import { message,notification } from 'antd';

export function fetch({ page, type }) {
  // return request(`http://jsonplaceholder.typicode.com/users?_page=${page}&_limit=3`);
  return request(`/api/account/orders?_page=${page}&_limit=${page_size}&_type=${type}`, {
    method: 'get',
  });
}

export function all({type}) {

  return request(`/api/account/all?_type=${type}`, {
    method: 'get',
  });
}

export function date({begin, end}) {
  return request(`/api/account/all?_type=other&begin=${begin}&end=${end}`, {
    method: 'get',
  });
}

export function remove(id) {
  return request(`/api/account/users/${id}`, {
    method: 'POST',
  }).then((data) => {
    notification.success({message:data.info});
  });
}

export function patch(id, values) {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}
