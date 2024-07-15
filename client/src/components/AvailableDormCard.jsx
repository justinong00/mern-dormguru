import React from "react";
import { Rate } from "antd";
import { roundToHalf } from "../helpers/roundToHalf.js";
import { useNavigate } from "react-router-dom";

/** AvailableDormCard component is a card component that displays the list of dorms associated with a specific uni.
 *
 * @param {Object} props - The properties for the component.
 * @param {Object} props.dorm - The dorm object containing information about the dorm.
 * @returns {JSX.Element} - The rendered AvailableDormCard component.
 */
function AvailableDormCard({ dorm }) {
  const navigate = useNavigate();

  /** Handles the click event to navigate to the dorm page and scroll to the top.
   */
  const handleClick = () => {
    navigate(`/dorm/${dorm._id}`);
    window.scrollTo(0, 0);
  };

  return (
    // Card container
    <div
      className="h-full w-full cursor-pointer overflow-hidden rounded-xl bg-white shadow-md shadow-gray-300 transition hover:scale-105 hover:shadow-2xl"
      onClick={handleClick}
    >
      {/* Image container */}
      <div className="aspect-w-3 aspect-h-2 md:aspect-w-4 md:aspect-h-3">
        <img
          src={dorm.coverPhotos}
          alt={`${dorm.name} Logo`}
          className="h-full w-full object-cover"
        />
      </div>
      {/* Content container */}
      <div className="flex flex-col justify-between gap-y-4 p-6">
        {/* Dorm name */}
        <div className="md:line-clamp-4 md:h-32">
          <h5 className="text-2xl font-semibold md:line-clamp-4">{dorm.name}</h5>
        </div>
        {/* Rating and number of reviews */}
        <div className="flex flex-grow flex-col justify-between gap-4">
          <div className="xs:flex-row flex flex-col-reverse justify-between gap-2">
            {/* Rating */}
            <Rate
              disabled
              value={roundToHalf(dorm.averageRating)}
              allowHalf
              style={{ fontSize: 25 }}
            />
            <p className="-mb-2 text-xl font-medium leading-8">{dorm.averageRating} </p>
          </div>
          <p className="-mt-2 text-lg leading-8 text-gray-400">{dorm.numberOfReviews} Reviews</p>
          {/* Description */}
          <p className="line-clamp-3 text-lg">{dorm.description}</p>
        </div>
      </div>
    </div>
  );
}

export default AvailableDormCard;
