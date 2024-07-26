import React, { useEffect, useState } from "react";
import Filters from "../../components/Filters.jsx";
import { FaCheckCircle, FaUniversity, FaBed } from "react-icons/fa";
import { getHomeStats } from "../../apis/homeStats.js";
import { message } from "antd";
import homePageBanner from "../../assets/dorm-guru-home-page-banner.png";

function Home() {
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({});

  // Fetch home stats from backend
  const fetchHomeStats = async () => {
    try {
      const response = await getHomeStats();
      setStats(response.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchHomeStats();
  }, []);

  return (
    <div className="h-screen-4/5 flex flex-col gap-4 bg-gray-100 md:flex-row">
      {/* Image Container */}
      <div className="relative hidden flex-1 items-center justify-end bg-gray-200 md:flex">
        <img
          src={homePageBanner}
          alt="Home Page Banner"
          className="absolute h-full w-full object-cover"
        />
      </div>
      {/* Text Container */}
      <div className="xxs:p-8 flex flex-1 flex-col justify-start px-4 py-4 md:justify-center">
        <h1 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl xl:text-5xl">
          Explore University Dorm Reviews
        </h1>
        <p className="xxs:text-base mb-8 text-sm text-gray-600 md:text-lg lg:text-xl">
          Browse and share reviews of university dormitories across Malaysia. Find the best dorms
          based on genuine feedback from students like you.
        </p>

        <div className="mb-8">
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        <div className="3xl:justify-start xs:flex hidden justify-between space-x-6">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <FaCheckCircle className="mb-2 text-xl text-gray-800 md:text-2xl lg:text-3xl" />
            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl lg:text-3xl">
              {stats.reviewCount}+
            </h1>
            <h2 className="text-center text-sm text-gray-600 md:text-base lg:text-lg">
              Verified Reviews
            </h2>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <FaUniversity className="mb-2 text-xl text-gray-800 md:text-2xl lg:text-3xl" />
            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl lg:text-3xl">
              {stats.uniCount}+
            </h1>
            <h2 className="text-center text-sm text-gray-600 md:text-base lg:text-lg">
              Colleges & Universities
            </h2>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
            <FaBed className="mb-2 text-xl text-gray-800 md:text-2xl lg:text-3xl" />
            <h1 className="text-xl font-semibold text-gray-800 md:text-2xl lg:text-3xl">
              {stats.dormCount}+
            </h1>
            <h2 className="text-center text-sm text-gray-600 md:text-base lg:text-lg">
              Dormitories Available
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
