import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message, Rate } from "antd";
import { setLoading } from "../../redux/loadersSlice.js";
import { formatDateToMonthDayYear } from "../../helpers/index.js";
import { LikeOutlined, LikeFilled, FlagOutlined, FlagFilled } from "@ant-design/icons";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "/node_modules/malaysia-state-flag-icon-css/css/flag-icon.min.css";
import { getStateCode } from "../../helpers/stateCodesHelper.js";
import { GetUniById } from "./../../apis/unis";
import { GetDormsByUniId } from "../../apis/dorms.js";
import { roundToHalf } from "../../helpers/roundToHalf.js";
import AvailableDormCard from "../../components/AvailableDormCard.jsx";

function UniInfo() {
  const [uni, setUni] = useState(null);
  const [dorms, setDorms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  /** Fetches a specific uni from the server. Updates the state with the fetched data.
   *
   * @return {Promise<void>} - A Promise that resolves when the fetch is complete.
   */
  const fetchSpecificUni = async () => {
    try {
      dispatch(setLoading(true));
      const uniResponse = await GetUniById(id);
      setUni(uniResponse.data);
      const dormsResponse = await GetDormsByUniId(id);
      setDorms(dormsResponse.data);
      console.log(dormsResponse.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Fetch uni data on component mount
  useEffect(() => {
    fetchSpecificUni();
  }, []);

  return (
    uni && (
      <div className="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-6">
        {/* Title Section */}
        <div className="bg-primary rounded-xl p-4">
          <h1 className="text-center text-4xl font-extrabold leading-10 text-white lg:text-5xl">
            {uni?.name}
          </h1>
        </div>

        {/* Uni Basic Info Section */}
        <div className="my-10 grid grid-cols-8 justify-center gap-10">
          {/* Uni Basic Info Image */}
          <div className="col-span-8 flex h-full flex-col justify-between gap-y-4 lg:col-span-4">
            {/* Aspect ratio container using padding-bottom method */}
            <div className="pb-2/4 sm:pb-2/5 relative h-0 w-full overflow-hidden lg:flex-1 lg:pb-0">
              {/** Explanation:
               *
               * pb-2/4 and sm:pb-2/5: These set the padding-bottom to a fraction of the width.
               * For example, pb-2/4 means the padding-bottom is 50% of the width, creating a 2:1 aspect ratio.
               * relative: This sets the position of the container as relative, allowing the img to be positioned absolutely within it.
               * h-0: This sets the initial height to 0. The actual height is controlled by the padding-bottom.
               * w-full: This sets the width to 100% of the parent container.
               * overflow-hidden: This hides any overflow content, ensuring the image doesn't exceed the container.
               * lg:flex-1: On large screens and above, this makes the container flexible, allowing it to grow and fill available space.
               * lg:pb-0: On large screens and above, this removes the padding-bottom, allowing the container height to be controlled by flexbox.
               */}
              <img
                src={uni.logoPic || "https://via.placeholder.com/300"}
                alt="Uni Logo Image"
                className="absolute inset-0 h-full w-full rounded-lg object-contain"
              />
              {/** Explanation:
               *
               * absolute: This positions the image absolutely within its container.
               * inset-0: This ensures the image is positioned at the top-left corner of the container.
               * h-full and w-full: These make the image fill the height and width of the container.
               * rounded-lg: This applies a large border-radius to the image, making it rounded.
               * object-contain: This ensures the image maintains its aspect ratio and is contained within the container.
               */}
            </div>
          </div>

          {/* Uni Basic Info Details */}
          <div className="col-span-8 flex flex-col gap-5 lg:col-span-4 lg:text-left">
            {/* Flex container for vertical layout */}
            <div className="flex h-full flex-col justify-between">
              {/* Section title */}
              <p className="mb-10 text-center text-3xl font-bold leading-10 sm:text-4xl lg:text-left">
                Basic Info
              </p>

              {/* Grid container for info items */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 lg:gap-8">
                {/* Address */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Address</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{uni?.address}</span>
                  </div>
                </div>

                {/* Postal Code */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-x-2 lg:flex-1 lg:flex-row lg:items-start lg:border-none lg:px-0">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Postal Code</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{uni?.postalCode}</span>
                  </div>
                </div>

                {/* City */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">City</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">{uni?.city}</span>
                  </div>
                </div>

                {/* State */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-none md:px-0 lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">State</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
                      <span
                        className={`malaysia-state-flag-icon h-10 w-20 shadow-md transition-shadow duration-300 hover:shadow-lg malaysia-state-flag-icon-${getStateCode(uni?.state)}`}
                      ></span>
                      <span className="text-center text-lg lg:text-start">{uni?.state}</span>
                    </div>
                  </div>
                </div>

                {/* Established Year */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between md:border-x-2 md:border-y-0 md:border-solid md:border-gray-200 md:px-2 lg:flex-1 lg:flex-row lg:items-start lg:border-none lg:px-0">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Established Year</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <span className="text-center text-lg lg:text-start">
                      {uni?.establishedYear}
                    </span>
                  </div>
                </div>

                {/* Website URL */}
                <div className="flex flex-col items-center gap-y-4 sm:items-center sm:justify-between sm:border-y-0 sm:border-l-2 sm:border-r-0 sm:border-solid sm:border-gray-200 sm:px-2 md:border-none md:px-0 lg:flex-row">
                  <div className="flex h-full flex-1">
                    <span className="text-2xl font-semibold">Website URL</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center lg:flex-1 lg:items-start">
                    <a
                      href={uni?.websiteURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transform text-center text-lg no-underline transition-transform ease-in-out hover:scale-105 hover:underline lg:text-start"
                    >
                      {uni?.websiteURL}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />

        {/* Bio Section */}
        <h2 className="my-10 text-center text-3xl font-bold leading-10 text-black sm:text-4xl">
          Bio
        </h2>

        {/* Bio Content */}
        <div className="my-10 text-center text-lg">{uni?.bio}</div>
        <hr />

        {/* Available Dorms Section */}
        <h2 className="my-10 text-center text-3xl font-bold leading-10 text-black sm:text-4xl">
          Available Dorms
        </h2>

        {/* Available Dorms Content */}
        {/* Grid for the dorm cards */}
        <div className="mb-10 grid grid-cols-12 gap-x-4 gap-y-8 md:gap-x-8">
          {dorms.length === 1 && (
            <>
              <div className="md:col-span-3 lg:col-span-4"></div>
              <div className="col-span-12 flex justify-center md:col-span-6 lg:col-span-4">
                <AvailableDormCard dorm={dorms[0]} />
              </div>
              <div className="md:col-span-3 lg:col-span-4"></div>
            </>
          )}
          {dorms.length === 2 && (
            <>
              <div className="md:col-span-1 lg:col-span-2"></div>
              {dorms.map((dorm) => (
                <div
                  key={dorm._id}
                  className="col-span-12 flex flex-col items-center text-wrap md:col-span-5 lg:col-span-4"
                >
                  <AvailableDormCard dorm={dorm} />
                </div>
              ))}
              <div className="md:col-span-1 lg:col-span-2"></div>
            </>
          )}
          {dorms.length > 2 &&
            dorms.map((dorm) => (
              <div
                key={dorm._id}
                className="col-span-12 flex flex-col items-center md:col-span-6 lg:col-span-4"
              >
                <AvailableDormCard dorm={dorm} />
              </div>
            ))}
          {/* {dorms.map((dorm) => (
            <div
              key={dorm._id}
              className="col-span-12 flex flex-col items-center gap-y-4 md:col-span-6 lg:col-span-4"
            >
              <div
                className="h-full w-full cursor-pointer overflow-hidden rounded-xl bg-white shadow-md shadow-gray-300 transition hover:scale-105 hover:shadow-2xl"
                onClick={() => navigate(`/dorm/${dorm._id}`)}
              >
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src={dorm.coverPhotos}
                    alt={`${dorm.name} Logo`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between gap-4 p-6">
                  <h5 className="h-32 text-2xl font-semibold sm:h-24">{dorm.name}</h5>
                  <Rate
                    disabled
                    value={roundToHalf(dorm.averageRating)}
                    allowHalf
                    style={{ fontSize: 25 }}
                  />
                  <p className="-mt-4 text-lg leading-8 text-gray-400">
                    {dorm.numberOfReviews} Reviews
                  </p>
                  <p className="line-clamp-3 text-lg">{dorm.description}</p>
                </div>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    )
  );
}

export default UniInfo;
