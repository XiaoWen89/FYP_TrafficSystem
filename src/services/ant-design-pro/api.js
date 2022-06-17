// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

export async function currentUser(options) {
  return request('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 退出登录接口 POST /api/login/outLogin */

export async function outLogin(options) {
  return request('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 登录接口 POST /api/login/account */

export async function login(body, options) {
  return request('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  /api_/getIncidentData **/

export async function getAccidentData(body, options) {
  return request('/apis/getAccidentData', {
    method: 'GET',
    data: body,
    ...(options || {}),
  });
}

/** POST  /api_/incidentShow **/

export async function incidentShow(body, options) {
  return request('/apis/incidentShow', {
    method: 'GET',
    data: body,
    ...(options || {}),
  });
}

/** POST  /api_/incidentShow **/

export async function prediction_(body, options) {
  return request('/apis/prediction', {
    method: 'GET',
    data: body,
    ...(options || {}),
  });
}
