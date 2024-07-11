import React from "react";
import "./ReviewFilterBar.css";

function ReviewFilterBar({ onFilterChange }) {
  return (
    <div className="filters">
      <div className="select-wrapper">
        <select onChange={onFilterChange}>
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
  );
}


export default ReviewFilterBar;
