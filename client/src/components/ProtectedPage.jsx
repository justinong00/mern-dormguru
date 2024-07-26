import { message, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { GetCurrentUser } from "../apis/users.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../redux/usersSlice.js";
import { setLoading } from "../redux/loadersSlice.js";
import { HiBadgeCheck } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";

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
      dispatch(setUsers(response.data)); // Update the users state in the Redux store
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
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getCurrentUser();
    }
  }, []);

  // Renders the current user's name and the children components
  return (
    <div>
      <div className="bg-primary xxs:flex-row xxs:items-center flex flex-col justify-between gap-y-2 p-5">
        <span
          className="cursor-pointer text-2xl font-semibold text-yellow-500"
          onClick={() => navigate("/")}
        >
          DormGuru
        </span>

        <div className="xxs:justify-between xxs:w-auto flex w-40 items-center gap-2 rounded bg-yellow-500 p-2">
          <Tooltip title="Profile">
            <div
              className="text-primary border-primary flex cursor-pointer items-center justify-between gap-2 border-y-0 border-l-0 border-r-2 border-solid pr-3"
              // Redirects to the admin page if the user is an admin, otherwise to the user's profile page
              onClick={() => navigate(user.isAdmin ? "/admin" : "/profile")}
            >
              <img
                src={`${user?.profilePicture}`}
                alt="profilePic"
                className="ring-primary cursor p h-8 w-8 rounded-full ring-2"
              />
              <div className="flex items-center gap-x-1">
                <span className="text-sm underline">{user?.name}</span>
                <Tooltip title={user?.isAdmin ? "Admin" : "Verified Student"}>
                  {user?.isAdmin ? <RiShieldUserFill /> : <FaUser />}
                </Tooltip>
              </div>
            </div>
          </Tooltip>
          <Tooltip title="Logout">
            <i
              className="ri-logout-box-r-line"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </Tooltip>
        </div>
      </div>

      {/* Renders the children components if there is a current user */}
      {user && <div className="p-5">{children}</div>}
    </div>
  );
}

export default ProtectedPage;
