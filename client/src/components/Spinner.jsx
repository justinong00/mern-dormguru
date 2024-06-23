import React from 'react';

/** Renders a centered spinner with a semi-transparent background.
 *
 * @return {JSX.Element} The Spinner component.
 */
function Spinner() {
  return (
    // The spinner container
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[10000]">
      {/* The spinner itself */}
      <div className="h-10 w-10 border-solid border-4 border-t-transparent border-gray-50 rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
