// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
// import img from '../../../images/doc/doctor 3.jpg'
// import { FaRegThumbsUp } from "react-icons/fa";
// import moment from 'moment';
// import StarRatings from 'react-star-ratings';
// import { useCreateReviewMutation, useGetDoctorReviewsQuery } from '../../../redux/api/reviewsApi';
// import { Button, Radio, message, Space, Rate } from 'antd';
// import { useForm } from 'react-hook-form';
// const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

// const Review = ({ doctorId }) => {
//     const { register, handleSubmit, } = useForm({});
//     const [value, setValue] = useState(null);
//     const [recommend, setRecommend] = useState(null);
//     const [showError, setShowError] = useState(false);

//     const { data, isError, isLoading } = useGetDoctorReviewsQuery(doctorId);
//     const [createReview, { isSuccess: createIsSuccess, isError: createTsError, error: createError, isLoading: createIsLoading }] = useCreateReviewMutation();

//     const onChange = (e) => setRecommend(e.target.value);

//     useEffect(() => {
//         if (recommend !== null && value !== null) {
//             setShowError(true)
//         }
//     }, [recommend, value]);

//     const onSubmit = (data) => {
//         const obj = {}
//         obj.isRecommended = recommend === 1 ? true : recommend === 2 ? false : null;
//         obj.description = data.description;
//         obj.star = value && value?.toString();
//         obj.doctorId = doctorId;
//         if (obj.description !== '') {
//             createReview({ data: obj });
//         } else {
//             message.error("Please Add Review Text !!");
//         }

//     };

//     useEffect(() => {
//         if (!createIsLoading && createTsError) {
//             message.error(createError?.data?.message);
//         }
//         if (createIsSuccess) {
//             message.success('Successfully Review Submited !');
//             setRecommend(null);
//             setValue(null);
//         }
//     }, [createIsLoading, createTsError, createError, createIsSuccess])

//     let content = null;
//     if (!isLoading && isError) content = <div>Something Went Wrong !</div>
//     if (!isLoading && !isError && data?.length === 0) content = <div>Empty</div>
//     if (!isLoading && !isError && data?.length > 0) content =
//         <>
//             {
//                 data && data.map((item, key) => (
//                     <div className='mb-4' key={item?.id + key}>
//                         <div className='d-flex gap-3 justify-content-between'>
//                             <div className='d-flex gap-4'>
//                                 <div className='review-img'>
//                                     <img className="" alt="" src={img} />
//                                 </div>
//                                 <div>
//                                     <h5 className="text-nowrap">{item?.patient?.firstName + ' ' + item?.patient?.lastName}</h5>
//                                     <p className="text-success"><FaRegThumbsUp /> {item?.isRecommended ? 'I recommend the doctor' : 'I do not recommend the doctor'}</p>
//                                 </div>
//                             </div>

//                             <div className='text-end'>
//                                 <div>
//                                     <StarRatings
//                                         rating={5}
//                                         starRatedColor="#f4c150"
//                                         numberOfStars={5}
//                                         name='rating'
//                                         starDimension="15px"
//                                         starSpacing="2px"
//                                     />
//                                 </div>
//                                 <div className="">Reviewed {moment(item?.createdAt).startOf('day').fromNow()}</div>
//                             </div>
//                         </div>
//                         <div>
//                             <p className="mx-2 form-text">{item?.description}</p>
//                         </div>
//                     </div>
//                 ))
//             }
//         </>
//     return (
//         <>
//             <div>
//                 <div className="w-100 mb-3 rounded py-3 px-2" style={{ background: '#f8f9fa' }}>
//                     {content}
//                 </div>

//                 <div className="text-center">
//                     <Link to={'/'} className='more-btn'>Show all feedback <strong>(167)</strong></Link>
//                 </div>

//                 <div className="mt-5">
//                     <h4>Write a review..</h4>

//                     <form onSubmit={handleSubmit(onSubmit)}>
//                         <div className="form-group mb-3">
//                             <div className='d-flex flex-column'>
//                                 <label className='form-label'>Your Review {value ? <strong>{desc[value - 1]}</strong> : ''}</label>
//                                 <Space>
//                                     <Rate tooltips={desc} onChange={setValue} value={value} />
//                                 </Space>
//                             </div>
//                         </div>
//                         <div className="form-group mb-3">
//                             <Radio.Group onChange={onChange} value={recommend}>
//                                 <Space direction="vertical">
//                                     <Radio value={1}>Recommend Doctor</Radio>
//                                     <Radio value={2}>Not Recommened Doctor</Radio>
//                                 </Space>
//                             </Radio.Group>
//                         </div>

//                         <div className="form-group">
//                             <label className='form-label'>Your review</label>
//                             <textarea className="form-control" {...register("description")} placeholder="Description..." rows={8} />
//                         </div>
//                         <hr />
//                         <div className="submit-section">
//                             <Button htmlType='submit' size='medium' type='primary' disabled={!showError}>Add Review</Button>
//                         </div>
//                     </form>

//                 </div>

//             </div>


//         </>
//     )
// }

// export default Review


import React, { useEffect, useState } from "react";
import img from "../../../images/doc/doctor 3.jpg";
import { FaRegThumbsUp } from "react-icons/fa";
import moment from "moment";
import StarRatings from "react-star-ratings";
import {
  useCreateReviewMutation,
  useGetDoctorReviewsQuery,
  useUpdateReviewMutation,
} from "../../../redux/api/reviewsApi";
import { useGetPatientAppointmentsQuery } from "../../../redux/api/appointmentApi";
import { Button, Radio, message, Space, Rate, Empty } from "antd";
import { useForm } from "react-hook-form";
import useAuthCheck from "../../../redux/hooks/useAuthCheck"; 

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const Review = ({ doctorId }) => {
  const { data: userData } = useAuthCheck();
  const { register, handleSubmit, reset, setValue: setFormValue } = useForm();
  const [value, setValue] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [showError, setShowError] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: reviewsData,
    isError,
    isLoading,
    refetch,
  } = useGetDoctorReviewsQuery(doctorId);

  const { data: appointmentsData, isLoading: isAppointmentsLoading } =
    useGetPatientAppointmentsQuery();

  const [
    createReview,
    {
      isSuccess: createIsSuccess,
      isError: createTsError,
      error: createError,
      isLoading: createIsLoading,
    },
  ] = useCreateReviewMutation();

  const [
    updateReview,
    {
      isSuccess: updateIsSuccess,
      isError: updateTsError,
      error: updateError,
      isLoading: updateIsLoading,
    },
  ] = useUpdateReviewMutation();

  const onChange = (e) => setRecommend(e.target.value);

  useEffect(() => {
    if (recommend !== null && value !== null) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [recommend, value]);

  useEffect(() => {
    if (reviewsData && userData) {
      const review = reviewsData.find(
        (review) => review.patientId._id === userData._id
      );
      if (review) {
        setExistingReview(review);
        setFormValue("description", review.description);
        setValue(parseInt(review.star));
        setRecommend(review.isRecommended ? 1 : 2);
        setIsEditing(true);
      }
    }
  }, [reviewsData, userData, setFormValue]);

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

    if (existingReview) {
      // Update the existing review
      updateReview({ id: existingReview._id, data: obj })
        .unwrap()
        .then(() => {
          message.success("Successfully Updated Review!");
          // No reset or refetch needed, just update the local state
          setExistingReview((prev) => ({
            ...prev,
            ...obj,
          }));
        })
        .catch((error) => {
          console.error("Failed to update review", error);
          message.error("Failed to update review. Please try again later.");
        });
    } else {
      // Create a new review
      createReview({ data: obj })
        .unwrap()
        .then(() => {
          message.success("Successfully Submitted Review!");
          reset();
          // refetch(); // Refresh reviews after submission
        })
        .catch((error) => {
          console.error("Failed to submit review", error);
          message.error("Failed to submit review. Please try again later.");
        });
    }
  };

  useEffect(() => {
    if (!createIsLoading && createTsError) {
      message.error(createError?.data?.message || "Failed to submit review.");
    }
    if (!updateIsLoading && updateTsError) {
      message.error(updateError?.data?.message || "Failed to update review.");
    }
  }, [
    createIsLoading,
    createTsError,
    createError,
    updateIsLoading,
    updateTsError,
    updateError,
  ]);

  let content = null;
  if (isLoading) {
    content = <Empty />;
  } else if (isError) {
    content = <div>Something Went Wrong!</div>;
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
                <div className="d-flex align-items-center">
                  <div>
                    <h6 className="text-nowrap">
                      {item?.patientId?.firstName +
                        " " +
                        item?.patientId?.lastName}
                    </h6>
                    {item.patientId._id === userData._id && (
                      <Button
                        type="link"
                        onClick={() => {
                          setIsEditing(true);
                          setExistingReview(item);
                          setFormValue("description", item.description);
                          setValue(parseInt(item.star));
                          setRecommend(item.isRecommended ? 1 : 2);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    <p className="text-success">
                      <FaRegThumbsUp />{" "}
                      {item?.isRecommended
                        ? "I recommend the doctor"
                        : "I do not recommend the doctor"}
                    </p>
                  </div>
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
            <div className="mx-5 form-text text-black">
              <div className="fs-6 mb-3">{item?.description}</div>
              {item?.response && (
                <div className="doctor-reply mt-2">
                  <div className="reply-header gap-4 d-flex align-items-center">
                    <img
                      className="review-img"
                      alt=""
                      src={item?.doctorId?.img || img}
                    />
                    <h6 className="text-nowrap">
                      {item?.doctorId?.firstName +
                        " " +
                        item?.doctorId?.lastName}
                    </h6>

                    <div className="fs-6 mb-2">{item?.response}</div>
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
            <h4>
              {existingReview && isEditing
                ? "Update your review.."
                : "Write a review.."}
            </h4>

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
                  {existingReview && isEditing ? "Update Review" : "Add Review"}
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
