import React from 'react';
import { Form, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { RegisterUser } from '../../apis/users.js';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      message.success(response.message);
      navigate('/login');
    } catch (error) {
      message.error(error.message);
    }
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
          >
            <Form.Item label="Name" name="name">
              <input type="text" />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <input type="email" />
            </Form.Item>

            <Form.Item label="Password" name="password">
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
