import React, { useEffect } from "react";
import { Form, Button, message, Input } from "antd";
import { Link } from "react-router-dom";
import { LoginUser } from "../../apis/users.js";
import { useNavigate } from "react-router-dom";
import { antValidationError, validationRules } from "../../helpers/index.js";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loadersSlice.js";

/** Login component for user login.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** Handles the form submission event.   *
   *
   * @param {Object} values - The form values.
   * @return {Promise<void>} - A promise that resolves when the login is successful.
   */
  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true)); // Sets the loading state to true

      // Simulates a delay of 1 second to show the loading spinner. This creates a new Promise that resolves after a 1-second delay (1000 milliseconds). setTimeout is a built-in function that executes the resolve function after the specified delay. resolve is a function that, when called, will settle the promise and allow the code to continue */
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the LoginUser function from users.js to log in the user
      const response = await LoginUser(values);
      dispatch(setLoading(false)); // Sets the loading state to false
      console.log(values); // Log form values on submission
      // Store the JWT token in the local storage
      localStorage.setItem("token", response.data);

      // Displays a success message using ant design's message component upon successful login
      message.success(response.message);
      navigate("/");
    } catch (error) {
      dispatch(setLoading(false)); // Sets the loading state to false
      console.error(error); // Log error on submission
      // Displays an error message using ant design's message component upon failed login
      message.error(error.message);
    }
  };

  // If the user is already logged in, don't allow them to access the login page
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col md:min-h-screen md:flex-row">
      {/* Background section */}
      <div className="bg-primary flex flex-1 flex-col items-center justify-center p-6 md:p-12">
        <h1 className="text-4xl font-semibold text-yellow-500 md:text-6xl lg:text-7xl xl:text-8xl">
          DormGuru
        </h1>
        <span className="text-md mt-2 text-center text-gray-300">
          One stop for all your university dorm ratings and reviews in Malaysia
        </span>
      </div>

      {/* Form section */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <h1 className="my-5 mb-2 text-center text-2xl md:text-left">Login To Your Account</h1>
          <hr />
          {/* Ant Design form component */}
          <Form layout="vertical" className="mt-3 flex flex-col gap-5" onFinish={onFinish}>
            {/* Form item for email */}
            <Form.Item label="Email" name="email" rules={validationRules["email"]}>
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>

            {/* Form item for password */}
            <Form.Item label="Password" name="password" rules={validationRules["password"]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {/* Form submit and register section */}
            <div className="flex flex-col gap-y-2">
              {/* Submit button */}
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>

              {/* Link to register page */}
              <Link to="/register" className="text-center md:text-left">
                Don't have an account? Register here
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
