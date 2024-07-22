import React, { useState } from "react";

function Filters({ filters, setFilters }) {
  const [hideResults, setHideResults] = useState(false);
  return (
    <div className="relative mb-5 w-1/2">
      <input
        type="text"
        placeholder="Search Dorms / Universities"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        onBlur={() => setHideResults(true)}
        onFocus={() => setHideResults(false)}
      />

      {/* results div */}

      {filters.search && !hideResults && <div className="quick-search-results"></div>}
    </div>
  );
}

export default Filters;
