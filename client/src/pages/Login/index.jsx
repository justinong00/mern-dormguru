import React from 'react';
import { Form, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { LoginUser } from '../../apis/users.js';

/** Login component for user login.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
function Login() {
  /** Handles the form submission event.
   *
   * @param {Object} values - The form values.
   * @return {Promise<void>} - A promise that resolves when the login is successful.
   */
  const onFinish = async (values) => {
    try {
      // Call the LoginUser function from users.js to log in the user
      const response = await LoginUser(values);
      // Store the JWT token in the local storage
      localStorage.setItem('token', response.data);
      // Display a success message using ant design's message component
      message.success(response.message);
    } catch (error) {
      // Display an error message using ant design's message component
      message.error(error.message);
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Background section */}
      <div className="bg-primary flex flex-col items-center justify-center">
        <h1 className="text-8xl text-orange-500 font-semibold">DormGuru</h1>
        <span className="text-md text-gray-300 mt-2">
          One stop for all your university dorm ratings and reviews in Malaysia
        </span>
      </div>

      {/* Login form section */}
      <div className="flex items-center justify-center">
        <div className="w-[400px]">
          <h1 className="text-2xl my-5 mb-2">Login To Your Account</h1>
          <hr />
          {/* Ant Design form component */}
          <Form
            layout="vertical"
            className="flex flex-col gap-5 mt-3"
            onFinish={onFinish}
          >
            {/* Form item for email */}
            <Form.Item label="Email" name="email">
              <input type='email'/>
            </Form.Item>

            {/* Form item for password */}
            <Form.Item label="Password" name="password">
              <input type="password" />
            </Form.Item>

            {/* Form submit and register section */}
            <div className="flex flex-col gap-5">
              {/* Submit button */}
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>

              {/* Link to register page */}
              <Link to="/register">Don't have an account? Register here</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
