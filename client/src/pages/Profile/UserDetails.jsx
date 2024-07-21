import { Button, Form, message } from "antd";
import React, { useState } from "react";
import { antValidationError } from "../../helpers/index.js";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../redux/usersSlice.js";
import { setLoading } from "../../redux/loadersSlice.js";
import { UpdateUser } from "../../apis/users.js";
import { BoldOutlined } from "@ant-design/icons";

function UserDetails() {
  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      // No need to pass user._id, as we will get that info from authMiddleware in the backend
      const response = await UpdateUser(values);
      message.success(response.message);
      dispatch(setUsers(response.data));
      form.setFieldsValue({
        ...response.data,
        oldPassword: "",
        newPassword: "",
      });
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <Form
        layout="vertical"
        className="mt-3 flex w-96 flex-col gap-5"
        onFinish={onFinish}
        form={form}
        initialValues={{ name: user.name, email: user.email }}
      >
        <Form.Item label="Name" name="name" rules={antValidationError}>
          <input type="text" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={antValidationError}>
          <input type="email" />
        </Form.Item>

        <Form.Item label="Old Password" name="oldPassword" rules={antValidationError}>
          <input type="password" />
        </Form.Item>

        <Form.Item label="New Password" name="newPassword" rules={antValidationError}>
          <input type="password" />
        </Form.Item>

        <div className="flex flex-col gap-5">
          <Button type="primary" htmlType="submit" block>
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UserDetails;
