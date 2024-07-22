import { Button, Checkbox, Form, Input, message } from "antd";
import React, { useState } from "react";
import { validationRules } from "../../helpers/index.js";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../redux/usersSlice.js";
import { setLoading } from "../../redux/loadersSlice.js";
import { UpdateUser } from "../../apis/users.js";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

function UserDetails() {
  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook
  const [updatePassword, setUpdatePassword] = useState(false); // State to toggle password fields

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));

      // Destructure form values, separating password fields from other update fields
      const { oldPassword, newPassword, confirmPassword, ...updateFields } = values;

      // If updatePassword is trueinclude password fields in the update request object
      if (updatePassword) {
        updateFields.oldPassword = oldPassword;
        updateFields.newPassword = newPassword;
      }

      // No need to pass user._id, as we will get that info from authMiddleware in the backend
      const response = await UpdateUser(updateFields);
      message.success(response.message);
      dispatch(setUsers(response.data));
      // Reset the password fields
      form.resetFields(["oldPassword", "newPassword", "confirmPassword"]);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div className="flex h-full items-center justify-center px-4">
      <Form
        layout="vertical"
        className="flex w-full max-w-md flex-col gap-y-4"
        onFinish={onFinish}
        form={form}
        initialValues={{ name: user.name, email: user.email }}
      >
        {/* Name */}
        <Form.Item label="Name" name="name" rules={validationRules["name"]}>
          <Input type="text" />
        </Form.Item>

        {/* Email */}
        <Form.Item label="Email" name="email" rules={validationRules["email"]}>
          <Input type="email" />
        </Form.Item>

        {/* Update Password Checkbox */}
        <Checkbox checked={updatePassword} onChange={(e) => setUpdatePassword(e.target.checked)}>
          Update Password
        </Checkbox>

        {/* Check if checkbox is checked to show password fields */}
        {updatePassword && (
          <>
            {/* Old Password */}
            <Form.Item label="Old Password" name="oldPassword" rules={validationRules["password"]}>
              <Input.Password
                placeholder="Enter your old password"
                autoComplete=""
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            {/* New Password */}
            <Form.Item label="New Password" name="newPassword" rules={validationRules["password"]}>
              <Input.Password autoComplete="" placeholder="Enter your new password" />
            </Form.Item>

            {/* Confirm New Password */}
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                ...validationRules["password"],
                {
                  validator: (_, value) => {
                    // Check if new password and confirm password match
                    if (value !== form.getFieldValue("newPassword")) {
                      return Promise.reject(
                        new Error("New password and confirm password do not match"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password autoComplete="" placeholder="Confirm your new password" />
            </Form.Item>
          </>
        )}

        {/* Update Button */}
        <Button type="primary" htmlType="submit" block className="mt-4">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default UserDetails;
