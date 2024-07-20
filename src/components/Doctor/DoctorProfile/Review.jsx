import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img from "../../../images/doc/doctor 3.jpg";
import { FaRegThumbsUp } from "react-icons/fa";
import moment from "moment";
import StarRatings from "react-star-ratings";
import {
  useCreateReviewMutation,
  useGetDoctorReviewsQuery,
} from "../../../redux/api/reviewsApi";
import { useGetPatientAppointmentsQuery } from "../../../redux/api/appointmentApi";
import { Button, Radio, message, Space, Rate, Empty } from "antd";
import { useForm } from "react-hook-form";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const Review = ({ doctorId }) => {
  const { register, handleSubmit, reset } = useForm();
  const [value, setValue] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [showError, setShowError] = useState(false);

  const {
    data: reviewsData,
    isError,
    isLoading,
    refetch,
  } = useGetDoctorReviewsQuery(doctorId);
  console.log(reviewsData, "reviewsData");
  const { data: appointmentsData, isLoading: isAppointmentsLoading } =
    useGetPatientAppointmentsQuery();
  console.log(appointmentsData, "appointmentsData1");
  const [
    createReview,
    {
      isSuccess: createIsSuccess,
      isError: createTsError,
      error: createError,
      isLoading: createIsLoading,
    },
  ] = useCreateReviewMutation();

  const onChange = (e) => setRecommend(e.target.value);

  useEffect(() => {
    if (recommend !== null && value !== null) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [recommend, value]);

  const onSubmit = (data) => {
    const obj = {
      isRecommended: recommend === 1 ? true : recommend === 2 ? false : null,
      description: data.description,
      star: value && value.toString(),
      doctorId: doctorId,
    };

    if (obj.description.trim() === "") {
      message.error("Please Add Review Text !!");
      return;
    }

    createReview({ data: obj })
      .unwrap()
      .then(() => {
        message.success("Successfully Review Submitted !");
        reset();
        refetch(); // Refresh reviews after submission
      })
      .catch((error) => {
        console.error("Failed to submit review", error);
        message.error("Failed to submit review. Please try again later.");
      });
  };

  useEffect(() => {
    if (!createIsLoading && createTsError) {
      message.error(createError?.data?.message || "Failed to submit review.");
    }
  }, [createIsLoading, createTsError, createError]);

  let content = null;
  if (isLoading) {
    content = <Empty />;
  } else if (isError) {
    content = <div>Something Went Wrong !</div>;
  } else if (reviewsData?.length === 0) {
    content = <div>No reviews available.</div>;
  } else {
    content = (
      <>
        {reviewsData.map((item, key) => (
          <div className="mb-4" key={item._id}>
            <div className="d-flex gap-3 justify-content-between">
              <div className="d-flex gap-4">
                <div className="review-img">
                  <img className="" alt="" src={item?.patientId?.img || img} />
                </div>
                <div>
                  <h5 className="text-nowrap">
                    {item?.patientId?.firstName +
                      " " +
                      item?.patientId?.lastName}
                  </h5>
                  <p className="text-success">
                    <FaRegThumbsUp />{" "}
                    {item?.isRecommended
                      ? "I recommend the doctor"
                      : "I do not recommend the doctor"}
                  </p>
                </div>
              </div>
              <div className="text-end">
                <div>
                  <StarRatings
                    rating={parseInt(item.star)}
                    starRatedColor="#f4c150"
                    numberOfStars={5}
                    name="rating"
                    starDimension="15px"
                    starSpacing="2px"
                  />
                </div>
                <div className="">
                  Reviewed {moment(item?.createdAt).startOf("hours").fromNow()}
                </div>
              </div>
            </div>
            <div className="mx-2 form-text">
              <div className="fs-6">{item?.description}</div>
              {item?.response && (
                <div className="doctor-reply mt-2">
                  <div className="reply-header gap-4 d-flex align-items-center">
                    <img
                      className="review-img"
                      alt=""
                      src={item?.doctorId?.img || img}
                    />
                    <h5 className="text-nowrap ml-3">
                      {item?.doctorId?.firstName +
                        " " +
                        item?.doctorId?.lastName}
                      :
                    </h5>
                    <div className="fs-6">{item?.response}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    );
  }

  const hasCompletedAppointment = appointmentsData?.some(
    (appointment) => appointment._id
  );

  return (
    <>
      <div>
        <div
          className="w-100 mb-3 rounded py-3 px-2"
          style={{ background: "#f8f9fa" }}
        >
          {content}
        </div>

        {hasCompletedAppointment && (
          <div className="mt-5">
            <h4>Write a review..</h4>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mb-3">
                <div className="d-flex flex-column">
                  <label className="form-label">
                    Your Review{" "}
                    {value ? <strong>{desc[value - 1]}</strong> : ""}
                  </label>
                  <Space>
                    <Rate tooltips={desc} onChange={setValue} value={value} />
                  </Space>
                </div>
              </div>
              <div className="form-group mb-3">
                <Radio.Group onChange={onChange} value={recommend}>
                  <Space direction="vertical">
                    <Radio value={1}>Recommend Doctor</Radio>
                    <Radio value={2}>Not Recommend Doctor</Radio>
                  </Space>
                </Radio.Group>
              </div>

              <div className="form-group">
                <label className="form-label">Your review</label>
                <textarea
                  className="form-control"
                  {...register("description")}
                  placeholder="Description..."
                  rows={8}
                />
              </div>
              <hr />
              <div className="submit-section">
                <Button
                  htmlType="submit"
                  size="medium"
                  type="primary"
                  disabled={!showError}
                >
                  Add Review
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Review;
