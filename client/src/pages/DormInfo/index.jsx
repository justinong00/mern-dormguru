import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message, Rate } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetDormById } from "../../apis/dorms.js";

function DormInfo() {
  const [dorm, setDorm] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchSpecificDorm = async () => {
    try {
      dispatch(setLoading(true)); // Show loading indicator
      const response = await GetDormById(id);
      setDorm(response.data); // Update state with fetched dorm
      dispatch(setLoading(false)); // Hide loading indicator
    } catch (error) {
      dispatch(setLoading(false)); // Hide loading indicator
      message.error(error.message); // Show error message
    }
  };

  useEffect(() => {
    fetchSpecificDorm();
  }, []);

  return (
    dorm && (
      <div>
        <div className="flex flex-col lg:flex-row gap-10">
          <img
            src={dorm.coverPhotos}
            alt="dorm-image"
            className="h-72 rounded-lg object-cover"
          />

          <div className="flex flex-col w-full">
            <h1 className="text-2xl font-semibold text-gray-600 mb-2">{dorm?.name}</h1>
            <hr />
            <div className="flex flex-col gap-5 mt-5 text-gray-600">
              <div className="flex justify-between ">
                <span>Address: </span>
                <span>{dorm?.address}</span>
              </div>

              <div className="flex justify-between ">
                <span>Postal Code: </span>
                <span>{dorm?.postalCode}</span>
              </div>

              <div className="flex justify-between ">
                <span>City: </span>
                <span>{dorm?.city}</span>
              </div>

              <div className="flex justify-between ">
                <span>State: </span>
                <span>{dorm?.state}</span>
              </div>

              <div className="flex justify-between ">
                <span>Established Year: </span>
                <span>{dorm?.establishedYear}</span>
              </div>

              <div className="flex justify-between ">
                <span>Rooms Offered: </span>
                <span>{dorm?.roomsOffered}</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-600 mt-5">Description</h2>
        <hr />

        <div className="mt-5">{dorm?.description}</div>

        <h2 className="text-lg font-semibold text-gray-600 mt-5">Parent University</h2>
        <hr />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 text-gray-600 ">
          <div
            className="flex h-24 cursor-pointer"
            onClick={() => navigate(`/uni/${dorm?.parentUniversity?._id}`)}
          >
            <img
              src={dorm?.parentUniversity?.logoPic}
              alt="University Logo"
              className="rounded-sm object-cover"
            />
            <div className="flex justify-center items-center p-5">
              <span className="font-semibold">{dorm?.parentUniversity?.name}</span>
            </div>
          </div>

          <div className="flex flex-col items-start h-24">
            <span className="font-semibold">Bio:</span>
            <span>{dorm?.parentUniversity?.bio}</span>
          </div>
        </div>
      </div>
    )
  );
}

export default DormInfo;
