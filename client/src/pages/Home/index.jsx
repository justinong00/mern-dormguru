import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, message, Rate } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetAllDorms } from "../../apis/dorms.js";

function Home() {
  const [dorms, setDorms] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchDorms = async () => {
    try {
      dispatch(setLoading(true)); // Show loading indicator
      const response = await GetAllDorms();
      setDorms(response.data); // Update state with fetched dorms
      dispatch(setLoading(false)); // Hide loading indicator
    } catch (error) {
      dispatch(setLoading(false)); // Hide loading indicator
      message.error(error.message); // Show error message
    }
  };

  // Fetch dorms when the component mounts
  useEffect(() => {
    fetchDorms();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-600 cursor-pointer">
        {dorms.map((dorm) => (
          <div
            key={dorm._id}
            className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-transform ease-in-out transform hover:scale-105"
            onClick={() => navigate(`/dorm/${dorm.name.replace(/\s+/g, '_').toLowerCase()}`)}
          >
            <img
              src={dorm.coverPhotos}
              alt="dorm-image"
              className="w-full h-48 rounded-sm object-contain"
            ></img>

            <h2 className="text-lg font-semibold text-gray-600">{dorm.name}</h2>

            <hr />

            <div className="flex justify-between text-sm">
              <span>City</span>
              <span>{dorm.city}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>State:</span>
              <span>{dorm.state}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Rating:</span>
              <Rate disabled defaultValue={dorm.rating || 0} showScore={false} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            navigate("/admin");
          }}
        >
          Go To Admin
        </Button>
      </div>
    </div>
  );
}

export default Home;
