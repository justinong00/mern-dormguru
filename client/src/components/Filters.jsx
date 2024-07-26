import React, { useEffect, useState } from "react";
import GetQuickSearchFilterResults from "../apis/filters.js";
import { message } from "antd";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "/node_modules/malaysia-state-flag-icon-css/css/flag-icon.min.css";
import { getStateCode } from "../helpers/stateCodesHelper.js";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

function Filters({ filters, setFilters }) {
  const [hideResults, setHideResults] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const fetchQuickSearchFilterResults = async () => {
    try {
      const response = await GetQuickSearchFilterResults(filters.search);
      setResults(response.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (filters.search) {
      // Implement debounce for search input (This debounce mechanism helps to reduce unnecessary API calls by waiting for the user to pause typing before fetching results, improving performance and reducing server load.)
      // Wait 500ms after user stops typing before fetching results
      const debounce = setTimeout(() => {
        fetchQuickSearchFilterResults();
      }, 500);

      // Clear timeout if user types again before 500ms
      return () => clearTimeout(debounce);
    } else {
      setResults([]); // Reset results when search input is cleared
    }
  }, [filters.search]); // Re-run effect when search filter changes

  return (
    <div className="relative mb-5">
      <label
        htmlFor="dormSearch"
        className="xxs:text-sm mb-2 block text-xs font-bold text-gray-700 md:text-base lg:text-lg"
      >
        Search Dorms by Name, City, State, or University
      </label>
      <div className="relative">
        <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          id="dormSearch"
          type="text"
          placeholder="Enter here..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          // Close results dropdown when user clicks outside of input
          // setTimeout is used to delay the hiding of the results dropdown by 200ms to allow the onClick event to propagate before firing the onBlur event. This ensures that the onBlur event is triggered after the onClick event. (The stopPropagation method prevents the event from bubbling up the DOM tree but does not prevent the onBlur event from firing because it is a focus-related event.)
          onBlur={() => setTimeout(() => setHideResults(true), 200)}
          // Open results dropdown when user clicks inside input
          onFocus={() => setHideResults(false)}
          className="w-full pl-10" // Add left padding to make room for the icon
        />
      </div>

      {/* QuickSearchFilterResults div */}
      {filters.search && !hideResults && results?.dorms?.length > 0 && (
        // Drop down results container
        <div className="absolute z-50 max-h-64 w-full overflow-y-auto border border-solid border-gray-300 bg-white shadow-md">
          {results?.dorms?.length > 0 && (
            // List of results
            <ul>
              {results.dorms.map((dorm) => (
                <li
                  key={dorm._id}
                  className="flex cursor-pointer items-center gap-5 border-0 border-b border-solid border-gray-300 p-2"
                  onClick={() => {
                    navigate(`/dorm/${dorm._id}`);
                  }}
                >
                  {/* dorm image */}
                  <img
                    src={dorm?.coverPhotos}
                    alt={dorm.name}
                    className="h-20 w-20 rounded object-cover"
                  />

                  {/* dorm info */}
                  <div className="w-full">
                    {/* dorm rating and name */}
                    <p className="mb-1 text-lg font-semibold">
                      {dorm.averageRating === 0 ? "0" : dorm.averageRating.toFixed(1)}{" "}
                      <StarFilled style={{ color: "#fadb14" }} /> {dorm.name}
                    </p>

                    {/* dorm university */}
                    <p className="mb-1 font-medium">{dorm.parentUniversity.name}</p>

                    {/* dorm city and state and state flag */}
                    <div className="xs:flex-row xs:items-center flex flex-col">
                      {/* dorm city */}
                      <p className="text-sm italic text-gray-500">{dorm.city}</p>
                      {/* separator */}
                      <p className="xs:inline xs:mx-1 xs:text-sm xs:text-gray-500 hidden">•</p>
                      {/* dorm state and state flag */}
                      <div className="xs:flex-row xs:mt-0 mt-1 flex flex-col-reverse">
                        {/* dorm state */}
                        <p className="text-sm italic text-gray-500">{dorm.state}</p>
                        {/* dorm state flag */}
                        <div
                          className={`malaysia-state-flag-icon xs:ml-2 ml-0 h-5 w-10 malaysia-state-flag-icon-${getStateCode(dorm?.state)}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Filters;
