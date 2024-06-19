import { message } from 'antd';
import { useState, useEffect } from 'react';
import { GetCurrentUser } from '../apis/users.js';
import { useNavigate } from 'react-router-dom';

/** ProtectedPage component is a higher-order component that wraps a route or a section of the application and provides authentication and authorization functionality.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ReactNode} props.children - The child components to be rendered.
 * @returns {ReactNode} The rendered ProtectedPage component.
 */
function ProtectedPage({ children }) {
  const [user, setUser] = useState(null); // State to store the current user
  const navigate = useNavigate(); // Hook to navigate to different routes

  /** Fetches the current user from the server and updates the state.
   *
   * If there is an error, it displays an error message using ant design's message component.
   */
  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUser();
      setUser(response.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  /** Runs when the component is mounted.
   *
   * If there is no token in the local storage, it navigates to the login page.
   * Otherwise, it fetches the current user.
   */
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      getCurrentUser();
    }
  }, []);

  // Renders the current user's name and the children components
  return (
    <div>
      <div className="flex items-center justify-between bg-primary p-5">
        <span
          className="font-semibold text-orange-500 text-2xl cursor-pointer"
          onClick={() => navigate('/')}
        >
          DormGuru
        </span>

        <div className="bg-white rounded px-5 py-2 flex gap-2 items-center">
          <i className="ri-shield-user-line"></i>
          <span
            className="text- text-sm cursor-pointer underline"
            onClick={() => navigate('/profile')}
          >
            {user?.name}
          </span>
          <i
            className="ri-logout-box-r-line ml-8"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          ></i>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

export default ProtectedPage;
