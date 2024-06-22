import { message } from 'antd';
import { useState, useEffect } from 'react';
import { GetCurrentUser } from '../apis/users.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../redux/usersSlice.js';
import { setLoading } from '../redux/loadersSlice.js';

/** ProtectedPage component is a higher-order component that wraps a route or a section of the application and provides authentication and authorization functionality.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ReactNode} props.children - The child components to be rendered.
 * @returns {ReactNode} The rendered ProtectedPage component.
 */
function ProtectedPage({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users); // Get the users state from the Redux store
  const navigate = useNavigate(); // Hook to navigate to different routes

  /** Fetches the current user from the server and updates the state.
   *
   * If there is an error, it displays an error message using ant design's message component.
   */
  const getCurrentUser = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetCurrentUser();
      dispatch(setLoading(false));
      dispatch(setUsers(response.data));  // Update the users state in the Redux store
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
            className="text-primary text-sm cursor-pointer underline"
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

      {/* Renders the children components if there is a current user */}
      {user && <div className="p-5">{children}</div>}
    </div>
  );
}

export default ProtectedPage;
