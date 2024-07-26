import React from "react";
import { FaUserGraduate } from "react-icons/fa";

const VerifiedStudentBadge = () => (
  <div className="text-xxs flex items-center gap-x-2 rounded-md border bg-black px-2 py-1 text-white xl:text-xs">
    <span>Verified Student</span>
    <FaUserGraduate />
  </div>
);

export default VerifiedStudentBadge;
