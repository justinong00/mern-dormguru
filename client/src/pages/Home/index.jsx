import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, message, Rate } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { GetAllDorms } from "../../apis/dorms.js";
import { roundToHalf } from "../../helpers/roundToHalf.js";
import Filters from "../../components/Filters.jsx";

function Home() {
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col bg-gray-100 md:flex-row">
      {/* Image Container */}
      <div className="relative hidden flex-1 items-center justify-end bg-gray-200 md:flex">
        <img
          src="https://img.freepik.com/premium-photo/guidance-counselor-s-office-where-students-receive-support-guidance_741910-47754.jpg"
          alt="Dormitory background"
          className="absolute right-0 h-full w-full object-cover"
        />
      </div>
      {/* Text Container */}
      <div className="flex flex-1 flex-col justify-center px-8 lg:px-16 lg:py-24">
        <h1 className="mb-6 text-4xl font-bold text-gray-800 lg:text-5xl">
          Find Your Ideal Dormitory
        </h1>
        <p className="mb-8 text-lg text-gray-600 lg:text-xl">
          Discover and book the perfect dormitory that meets all your needs and preferences. Our
          platform offers a variety of options to help you find a place you'll love.
        </p>
        <div className="mb-8 hidden space-x-6 lg:flex">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <h1 className="text-3xl font-semibold text-gray-800">3+</h1>
            <h2 className="text-center text-lg text-gray-600">Months of Experience</h2>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <h1 className="text-3xl font-semibold text-gray-800">20+</h1>
            <h2 className="text-center text-lg text-gray-600">Colleges & Universities</h2>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <h1 className="text-3xl font-semibold text-gray-800">20+</h1>
            <h2 className="text-center text-lg text-gray-600">Dormitories Available</h2>
          </div>
        </div>
        <div className="mb-8">
          <Filters filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
}

export default Home;
