import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Img
} from 'antd';
import { useIntl, history } from 'umi';

import { register } from '../services/ant-design-pro/api'

const Registration = () => {
  const intl = useIntl();

  const handleSubmit = async (data) => {
    try {
      console.log(data)
      const response = await register(data)
      if (response.code === "0") {
        const defaultRegistrationSuccessMessage = intl.formatMessage({
          id: 'pages.registration.success',
          defaultMessage: '注册成功！',
        });
        message.success(defaultRegistrationSuccessMessage);
        history.push('/user/login')
      } else {
        const defaultRegistrationAccountRepeatMessage = intl.formatMessage({
          id: 'pages.registration.repeat',
          defaultMessage: '账号已存在，请重试！',
        });
        message.error(defaultRegistrationAccountRepeatMessage);
      }
    } catch (error) {
      const defaultRegistrationFailureMessage = intl.formatMessage({
        id: 'pages.registration.failure',
        defaultMessage: '注册失败，请重试！',
      });
      message.error(defaultRegistrationFailureMessage);
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div class="ant-pro-form-login-container">
      {/*<h1 style={{paddingTop:'10px', marginLeft:'40%'}}>Registration</h1>*/}
      <div class="ant-pro-form-login-top" style={{ paddingBottom: '20px' }}>
        <div class="ant-pro-form-login-header">
          <span class="ant-pro-form-login-logo"><img alt="logo" src="/logo.svg" /></span>
          <span class="ant-pro-form-login-title">Registration</span>
        </div>
      </div>
      <div class="ant-pro-form-login-main" style={{ width: '40%' }}>
        <Form
          /*style={{width: '27%', padding: '10px', marginLeft: '25%'}}*/
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            rules={[
              {
                required: true,
                message: 'Please input your confirm password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Registration;