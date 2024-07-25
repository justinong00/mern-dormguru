import React, { useEffect, useState } from "react";
import { Form, Button, message, Input, Select } from "antd";
import { Link } from "react-router-dom";
import { RegisterUser } from "../../apis/users.js";
import { useNavigate } from "react-router-dom";
import { antValidationError, validationRules } from "../../helpers/index.js";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loadersSlice.js";
import { countryOptions } from "../../helpers/countryOptions.jsx";
import { AddProfilePicture } from "../../apis/images.js";
import ImageUpload, { customValidateFileList } from "../../components/ImageUpload.jsx";

/** Register component for user registration. *
 *
 * @returns {JSX.Element} The rendered Register component.
 */
function Register() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // State to store the uploaded file list
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** Handles the form submission event.
   *
   * @param {Object} values - The form values.
   * @return {Promise<void>} - A promise that resolves when the registration is successful.
   */
  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true)); // Sets the loading state to true
      // Simulates a delay of 1 second to show the loading spinner.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        // Append the selected image file and registration name to the FormData object
        formData.append("image", fileList[0].originFileObj);
        formData.append("registerName", values.name);
        // Log FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        const uploadResponse = await AddProfilePicture(formData); // Upload the image

        // If the upload is successful, update the profilePicture value object with the new cloudinary URL
        if (uploadResponse.success) {
          values.profilePicture = uploadResponse.data;
        } else {
          // If the upload fails, throw an error to be caught in the catch block
          throw new Error("Failed to upload image");
        }
      }

      // Call the RegisterUser function from users.js to register the user
      const response = await RegisterUser(values);

      dispatch(setLoading(false));
      message.success(response.message);
      navigate("/login");
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // If the user is already logged in, don't allow them to access the register page
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    // The main container for the registration page
    <div className="grid h-screen grid-cols-2">
      {/* Background section */}
      <div className="bg-primary flex flex-col items-center justify-center">
        <h1 className="text-8xl font-semibold text-yellow-500">DormGuru</h1>
        <span className="text-md mt-2 text-gray-300">
          One stop for all your university dorm ratings and reviews in Malaysia
        </span>
      </div>

      {/* Form section */}
      <div className="flex items-center justify-center">
        <div className="w-[400px]">
          <h1 className="my-5 mb-2 text-2xl">Register Your Account</h1>
          <hr />
          <Form
            form={form}
            layout="vertical"
            className="mt-3 flex flex-col gap-2"
            onFinish={onFinish}
          >
            <Form.Item label="Name" name="name" rules={validationRules["name"]}>
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={validationRules["email"]}>
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={validationRules["password"]}>
              <Input.Password autoComplete="" placeholder="Enter your new password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                ...antValidationError,
                {
                  validator: (_, value) => {
                    // Check if password and confirm password match
                    if (value !== form.getFieldValue("password")) {
                      return Promise.reject(
                        new Error("Password and confirm password do not match"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password autoComplete="" placeholder="Confirm your password" />
            </Form.Item>

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

            <Form.Item
              label="Profile Picture"
              name="profilePicture"
              rules={[
                {
                  required: true,
                  validator: (_, value) => customValidateFileList(fileList, value),
                },
              ]}
            >
              <ImageUpload
                fileList={fileList}
                setFileList={setFileList}
                selectedItem={null}
                form={form}
                fieldName="profilePicture"
              />
            </Form.Item>

            <div className="mt-3 flex flex-col gap-y-2">
              <Button type="primary" htmlType="submit" block>
                Register
              </Button>

              {/* Link to login page */}
              <Link to="/login">Already have an account? Login here</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;

// To solve the issue of "A component is changing an uncontrolled input of type text to be controlled error in ReactJS"
/* function Register() {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-primary flex flex-col items-center justify-center">
        <h1 className="text-8xl text-yellow-500 font-semibold">DormGuru</h1>
        <span className="text-md text-gray-300 mt-2">
          One stop for all your university dorm ratings and reviews in Malaysia
        </span>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-[400px]">
          <h1 className="text-2xl my-5 mb-2">Register Your Account</h1>
          <hr />
          <Form
            layout="vertical"
            className="flex flex-col gap-5 mt-3"
            onFinish={onFinish}
            form={form}
            initialValues={formData}
          >
            <Form.Item label="Name" name="name">
              <input type="text" onChange={onChange} value={formData.name} />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <input type="email" onChange={onChange} value={formData.email} />
            </Form.Item>

            <Form.Item label="Password" name="password">
              <input
                type="password"
                onChange={onChange}
                value={formData.password}
              />
            </Form.Item>

            <div className="flex flex-col gap-5">
              <Button type="primary" htmlType="submit" block>
                Register
              </Button>

              <Link to="/login">Already have an account? Login here</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
} */
