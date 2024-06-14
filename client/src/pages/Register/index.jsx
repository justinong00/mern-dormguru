import React, { useEffect } from 'react';
import { Form, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { RegisterUser } from '../../apis/users.js';
import { useNavigate } from 'react-router-dom';
import { antValidationError } from '../../helpers/index.js';

/** Register component for user registration. *
 *
 * @returns {JSX.Element} The rendered Register component.
 */
function Register() {
  const navigate = useNavigate();

  /** Handles the form submission event.
   *
   * @param {Object} values - The form values.
   * @return {Promise<void>} - A promise that resolves when the registration is successful.
   */
  const onFinish = async (values) => {
    try {
      // Call the RegisterUser function from users.js to register the user
      const response = await RegisterUser(values);

      // Display a success message using ant design's message component if registration is successful
      message.success(response.message);
      navigate('/login');
    } catch (error) {
      // Display an error message using ant design's message component if registration fails
      message.error(error.message);
    }
  };

  // If the user is already logged in, don't allow them to access the register page
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-primary flex flex-col items-center justify-center">
        <h1 className="text-8xl text-orange-500 font-semibold">DormGuru</h1>
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
          >
            <Form.Item label="Name" name="name" rules={antValidationError}>
              <input type="text" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={antValidationError}>
              <input type="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={antValidationError}
            >
              <input type="password" />
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
        <h1 className="text-8xl text-orange-500 font-semibold">DormGuru</h1>
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
