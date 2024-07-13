import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout/AdminLayout";
import ReviewFilterBar from "../AdminFilterBar/ReviewFilterBar";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filterRating, setFilterRating] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/v1/review");
        if (response.status === 200 && response.data.success) {
          const reviewsData = response.data.data.map((review) => ({
            ...review,
            star: review.star.toString(), // Ensure star rating is a string
          }));
          console.log("Fetched Reviews: ", reviewsData);
          setReviews(reviewsData);
          setLoading(false);
        } else {
          console.error("Error fetching reviews:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleActionClick = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".actions")) {
      setActiveDropdown(null);
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    const newFilterRating = value === "Filter by Rating..." ? null : value;
    setFilterRating(newFilterRating);
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const filteredReviews =
    filterRating !== null
      ? reviews.filter((review) => review.star === filterRating)
      : reviews;

  return (
    <AdminLayout>
      <ReviewFilterBar onFilterChange={handleFilterChange} />
      <div className="review-list bg-white rounded p-4 shadow-sm">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Rate</th>
                <th>Rated To</th>
                <th>Written on</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review, index) => (
                <tr key={review._id}>
                  <td>{index + 1}</td>
                  <td className="table-avatar">
                    <img
                      src={`https://i.pravatar.cc/150?img=${review.id}`}
                      alt="avatar"
                      className="avatar-img rounded-circle me-2"
                    />
                    {review.patientId ? (
                      <Link to={`/profile/${review.patientId._id}`}>
                        {`${review.patientId.firstName} ${review.patientId.lastName}`}
                      </Link>
                    ) : (
                      <span>Unknown Patient</span>
                    )}
                  </td>
                  <td className="text-warning">
                    {"★".repeat(Number(review.star))}
                    {"☆".repeat(5 - Number(review.star))}
                  </td>
                  <td>
                    <Link to={`/profile/${review.doctorId?._id}`}>
                      {`${review.doctorId?.firstName} ${review.doctorId?.lastName}`}
                    </Link>
                  </td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="comment border rounded p-2">
                      {review.description}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
