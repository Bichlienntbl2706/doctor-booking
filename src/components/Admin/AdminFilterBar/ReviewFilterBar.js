import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ReviewFilterBar({ onFilterChange }) {
  return (
    <div className="filter-bar bg-light p-3 rounded mb-4">
      <div className="filters d-flex align-items-center">
        <div className="select-wrapper me-3">
          <select className="form-select" onChange={onFilterChange}>
            <option value="Filter by Rating...">Filter by Rating...</option>
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
            <option value="4">★★★★</option>
            <option value="5">★★★★★</option>
            {/* Add more options here */}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ReviewFilterBar;
