// import React from 'react';
// import './Reviews.css';
// import DashboardLayout from '../DashboardLayout/DashboardLayout';
// import img from '../../../images/avatar.jpg';
// import { useGetDoctorReviewsQuery } from '../../../redux/api/reviewsApi';
// import { FaRegThumbsUp } from "react-icons/fa";
// import moment from 'moment';
// import StarRatings from 'react-star-ratings';
// import useAuthCheck from '../../../redux/hooks/useAuthCheck';
// import { Empty } from 'antd';

// const Reviews = () => {
//     const { data: loginInfo } = useAuthCheck();
//     const { data, isError, isLoading } = useGetDoctorReviewsQuery(loginInfo?.id);
//     let content = null;
//     if (!isLoading && isError) content = <div>Something Went Wrong !</div>
//     if (!isLoading && !isError && data?.length === 0) content = <Empty />
//     if (!isLoading && !isError && data?.length > 0) content =
//         <>
//             {
//                 data && data.map((item, key) => (
//                     <div className='mb-4' key={item?.id + key}>
//                         <div className='d-flex gap-3 justify-content-between'>
//                             <div className='d-flex gap-4'>
//                                 <div className='review-img'>
//                                     <img className="" alt="" src={data?.patient?.img ? data?.patient?.img : img} />
//                                 </div>
//                                 <div>
//                                     <h5 className="text-nowrap text-capitalize">{item?.patient?.firstName + ' ' + item?.patient?.lastName}</h5>
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
//         <DashboardLayout>
//             <div className="w-100 mb-3 rounded py-3 px-2" style={{ background: '#f8f9fa' }}>
//                 {content}
//             </div>
//         </DashboardLayout>
//     )
// }

// export default Reviews;


import React, { useState } from "react";
import "./Reviews.css";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import img from "../../../images/avatar.jpg";
import {
  useGetDoctorReviewsQuery,
  useReplyReviewsMutation,
} from "../../../redux/api/reviewsApi";
import { FaRegThumbsUp } from "react-icons/fa";
import moment from "moment";
import StarRatings from "react-star-ratings";
import useAuthCheck from "../../../redux/hooks/useAuthCheck";
import { Empty } from "antd";
import CustomTable from "../../UI/component/CustomTable";

const Reviews = () => {
  const { data: doctorData } = useAuthCheck();
  const { data, isError, isLoading, refetch } = useGetDoctorReviewsQuery(
    doctorData?._id
  );

  const [replyToReview] = useReplyReviewsMutation();
  const [reply, setReply] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = async (reviewId) => {
    try {
      await replyToReview({ id: reviewId, data: { response: reply } }).unwrap();
      setReply("");
      setReplyingTo(null);
      refetch();
    } catch (error) {
      console.error("Failed to reply to the review", error);
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patient",
      key: "patient",
      render: (text, record) => (
        <div className="d-flex gap-4">
          <div className="review-img">
            <img className="" alt="" src={record.patientId?.img || img} />
          </div>
          <div>
            <h5 className="text-nowrap text-capitalize">
              {record.patientId?.firstName + " " + record.patientId?.lastName}
            </h5>
          </div>
        </div>
      ),
    },
    {
      title: "Review",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <div>
          <p className="mx-2 form-text">{record.description}</p>
          <p className="text-success">
            <FaRegThumbsUp />{" "}
            {record.isRecommended
              ? "I recommend the doctor"
              : "I do not recommend the doctor"}
          </p>
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (text, record) => (
        <div className="text-start">
          <StarRatings
            rating={parseInt(record.star)}
            starRatedColor="#f4c150"
            numberOfStars={5}
            name="rating"
            starDimension="15px"
            starSpacing="2px"
          />
          <div className="">
            Reviewed {moment(record.createdAt).startOf("hours").fromNow()}
          </div>
        </div>
      ),
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      render: (text, record) => (
        <div>
          {record.response && (
            <div className="mx-2 form-text text-muted">
              <strong>Doctor's Response:</strong> {record.response}
            </div>
          )}
          {replyingTo === record._id ? (
            <div className="reply-form">
              <textarea
                className="form-control"
                value={reply}
                onChange={handleReplyChange}
                placeholder="Write your reply..."
              />
              <button
                className="btn btn-primary mt-2"
                onClick={() => handleReplySubmit(record._id)}
              >
                Submit Reply
              </button>
              <button
                className="btn btn-secondary mt-2"
                onClick={() => setReplyingTo(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-link"
              onClick={() => setReplyingTo(record._id)}
            >
              Reply
            </button>
          )}
        </div>
      ),
    },
  ];

  let content = null;
  if (!isLoading && isError) content = <div>Something Went Wrong!</div>;
  if (!isLoading && !isError && data?.length === 0) content = <Empty />;
  if (!isLoading && !isError && data?.length > 0) content = data;

  return (
    <DashboardLayout>
      <div
        className="w-100 mb-3 rounded py-3 px-2"
        style={{ background: "#f8f9fa" }}
      >
        <CustomTable
          loading={isLoading}
          columns={columns}
          dataSource={data}
          showPagination={true}
          pageSize={5}
          showSizeChanger={true}
          rowKey={(record) => record._id}
        />
      </div>
    </DashboardLayout>
  );
};

export default Reviews;
