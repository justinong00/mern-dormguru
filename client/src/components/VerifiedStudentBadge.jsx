import React from "react";
import { FaUserGraduate } from "react-icons/fa";

const VerifiedStudentBadge = ({ className }) => (
  <div
    className={`flex items-center gap-x-2 rounded-md border bg-black px-2 py-1 text-xs text-white ${className}`}
  >
    <span>Verified Student</span>
    <FaUserGraduate />
  </div>
);

export default VerifiedStudentBadge;
