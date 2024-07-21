import { Button, Checkbox, Form, Input, message } from "antd";
import React, { useState } from "react";
import { antValidationError } from "../../helpers/index.js";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../redux/usersSlice.js";
import { setLoading } from "../../redux/loadersSlice.js";
import { UpdateUser } from "../../apis/users.js";

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

      // If updatePassword is true, validate and include password fields in the update
      if (updatePassword) {
        // if newPassword does not match confirmPassword, throw an error
        if (newPassword !== confirmPassword) {
          throw new Error("New password and confirm password do not match");
        }
        // Includde password fields in the updateFields object
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
    <div className="flex h-full items-center justify-center">
      <Form
        layout="vertical"
        className="flex w-full max-w-md flex-col gap-y-4"
        onFinish={onFinish}
        form={form}
        initialValues={{ name: user.name, email: user.email }}
      >
        {/* Name */}
        <Form.Item label="Name" name="name" rules={antValidationError}>
          <Input type="text" />
        </Form.Item>

        {/* Email */}
        <Form.Item label="Email" name="email" rules={antValidationError}>
          <Input type="email" />
        </Form.Item>

        {/* Update Password Checkbox */}
        <Checkbox checked={updatePassword} onChange={(e) => setUpdatePassword(e.target.checked)}>
          Update Password
        </Checkbox>

        {/* Old Password, New Password, and Confirm New Password fields if updatePassword is true */}
        {updatePassword && (
          <>
            <Form.Item label="Old Password" name="oldPassword" rules={antValidationError}>
              <Input type="password" />
            </Form.Item>

            <Form.Item label="New Password" name="newPassword" rules={antValidationError}>
              <Input type="password" />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              rules={antValidationError}
            >
              <Input type="password" />
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
