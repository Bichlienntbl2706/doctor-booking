import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout/AdminLayout";
import "./Reviews.css";
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
            // Đảm bảo giá trị sao là chuỗi
            star: review.star.toString(),
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
      <div className="review-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
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
                      className="avatar-img"
                    />
                    {review.patientId ? (
                      <a href="#">
                        {`${review.patientId.firstName} ${review.patientId.lastName}`}
                      </a>
                    ) : (
                      <span>Unknown Patient</span>
                    )}
                  </td>
                  <td className="rating" style={{ color: "orange" }}>
                    {"★".repeat(Number(review.star))}
                    {"☆".repeat(5 - Number(review.star))}
                  </td>
                  <td style={{ fontSize: "12px" }}>
                    <Link
                      style={{ color: "#00bfa5" }}
                      to={`/profile/${review.doctorId}`}
                    >
                      {`${review.doctorId?.firstName} ${review.doctorId?.lastName}`}
                    </Link>
                  </td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="comment">{review.description}</div>
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
