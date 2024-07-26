import { Button, Checkbox, Form, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { validationRules } from "../../helpers/index.js";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../redux/usersSlice.js";
import { setLoading } from "../../redux/loadersSlice.js";
import { UpdateUser } from "../../apis/users.js";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { countryOptions } from "../../helpers/countryOptions.jsx";
import ImageUpload, { customValidateFileList } from "../../components/ImageUpload.jsx";
import { AddProfilePicture } from "../../apis/images.js";

function UserDetails() {
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm hook
  const [localUser, setLocalUser] = useState({}); // State to store the user state from the Redux store so that we can pass the current state and function to the ImageUpload component
  const [updatePassword, setUpdatePassword] = useState(false); // State to toggle password fields
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list

  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  useEffect(() => {
    setLocalUser(user);
  }, []);

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));

      // Destructure form values, separating password fields from other update fields
      const { oldPassword, newPassword, ...updateFields } = values;

      // If updatePassword is true include password fields in the update request object
      if (updatePassword) {
        updateFields.oldPassword = oldPassword;
        updateFields.newPassword = newPassword;
      }

      // If a file is selected, upload the image
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        // Append the selected image file and dorm name to the FormData object
        formData.append("image", fileList[0].originFileObj);
        formData.append("registerName", values.name);
        // Log FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        const uploadResponse = await AddProfilePicture(formData); // Upload the image

        // If the upload is successful, update the coverPhotos value object with the new cloudinary URL
        if (uploadResponse.success) {
          values.profilePicture = uploadResponse.data;
        } else {
          // If the upload fails, throw an error to be caught in the catch block
          throw new Error("Failed to upload image");
        }
      } else if (localUser?.profilePicture) {
        values.profilePicture = localUser.profilePicture;
      }

      const response = await UpdateUser({
        ...updateFields,
        // assign back the cloudinary URL to the profilePicture field when updating the user
        profilePicture: values.profilePicture,
        id: user._id,
      });
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
        initialValues={{
          name: user.name,
          email: user.email,
          country: user.country,
          profilePicture: user.profilePicture,
        }}
      >
        {/* Email */}
        <Form.Item label="Email (Cannot be updated)" name="email" rules={validationRules["email"]}>
          <Input type="email" disabled />
        </Form.Item>

        {/* Name */}
        <Form.Item label="Name" name="name" rules={validationRules["name"]}>
          <Input type="text" />
        </Form.Item>

        {/* Country */}
        <Form.Item label="Country" name="country" rules={validationRules["country"]}>
          <Select
            showSearch
            placeholder="Select a country"
            // This allows the Select component to use the labelForSearch property for filtering options based on user input.
            optionFilterProp="labelForSearch"
            options={countryOptions}
            onChange={(value) => form.setFieldsValue({ country: value })}
            // Used a custom filterOption function to filter the options based on labelForSearch.
            filterOption={(input, option) =>
              option.labelForSearch.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {/* Profile Picture */}
        <Form.Item
          label="Profile Picture"
          name="profilePicture"
          rules={[
            {
              required: true,
              validator: (_, value) =>
                // Passed localUser.profilePicture to the customValidateFileList function to evaluate as initialImage in ImageUploa component
                customValidateFileList(fileList, value, localUser.profilePicture),
            },
          ]}
        >
          <ImageUpload
            fileList={fileList}
            setFileList={setFileList}
            selectedItem={localUser}
            form={form}
            fieldName="profilePicture"
            setSelectedItem={setLocalUser}
          />
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
