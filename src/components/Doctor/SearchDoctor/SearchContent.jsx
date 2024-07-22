import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import showImg from '../../../images/specialities/specialities-01.png';
import StarRatings from 'react-star-ratings';
import { Tag } from 'antd';
import './index.css';
import { FaLocationArrow, FaRegThumbsUp, FaDollarSign, FaComment } from "react-icons/fa";
import { truncate } from '../../../utils/truncate';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import { useGetDoctorReviewsQuery } from "../../../redux/api/reviewsApi";

const SearchContent = ({ data }) => {
    const {
        data: reviewsData,
        isLoading,
        isError,
      } = useGetDoctorReviewsQuery(data?._id);
      const [averageRating, setAverageRating] = useState(0);
      const [totalReviews, setTotalReviews] = useState(0);
    let services = [];

    const { role } = useAuthCheck();

    useEffect(() => {
        if (reviewsData) {
          const totalReviews = reviewsData.length;
          const totalRating = reviewsData.reduce((acc, review) => {
            const star = parseFloat(review.star); // Ensure star is a number
            return acc + (isNaN(star) ? 0 : star);
          }, 0);
          const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    
          setAverageRating(parseFloat(averageRating.toFixed(2)));
          setTotalReviews(totalReviews);
        }
      }, [reviewsData]);

    // Handle different types for data.services
    if (typeof data?.services === 'string') {
        services = data.services.split(',');
    } else if (Array.isArray(data?.services)) {
        services = data.services; // If services is already an array
    } else if (typeof data?.services === 'object' && data?.services !== null) {
        // If services is an object, handle it accordingly (example: convert object values to an array)
        services = Object.values(data.services);
    } else {
        console.error('Unexpected type for data.services:', typeof data.services);
        services = [];
    }

    return (
        <div className="mb-4 rounded" style={{ background: '#f3f3f3' }}>
            <div className='d-flex p-3 justify-content-between'>
                <div className='d-flex gap-3'>
                    <div className='doc-img-fluid d-flex align-items-center'>
                        {data?.img && <img src={data.img} className="" alt="User Image" />}
                    </div>
                    <div className="doc-info">
                        <h5 className='mb-0'><Link to={`/doctors/profile/${data?._id}`}>Dr. {data?.firstName + ' ' + data?.lastName}</Link></h5>
                        <p className='m-0 form-text'>{data?.email}</p>
                        <p className="doc-department m-0"><img src={showImg} className="img-fluid" alt="Speciality" />{data?.designation}</p>

                        <div className='d-flex align-items-center'>
                            <div>
                                <StarRatings
                                    rating={averageRating}
                                    starRatedColor="#f4c150"
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension="15px"
                                    starSpacing="2px"
                                />
                            </div>
                            <div>({totalReviews} reviews)</div>
                        </div>

                        <div className="clinic-details">
                            <p className="form-text text-secondary"><FaLocationArrow /> {data?.address}, {data?.country}</p>
                            <ul className="clinic-gallery mt-3">
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: "30px" }} />
                                </li>
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: "30px" }} />
                                </li>
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: "30px" }} />
                                </li>
                                <li>
                                    <img src={showImg} alt="Feature" style={{ maxWidth: "30px" }} />
                                </li>
                            </ul>
                        </div>
                        {
                            services.map((item, id) => (
                                <Tag key={id + 51}>{item}</Tag>
                            ))
                        }
                    </div>
                </div>
                <div className="doc-info-right me-3">
                    <div className="clini-infos">
                        <ul>
                            <li><FaRegThumbsUp />  {averageRating}</li>
                            <li><FaComment /> {totalReviews} Feedback</li>
                            <li><FaLocationArrow />{truncate(data?.clinicAddress || '', 20)}</li>
                            <li><FaDollarSign /> {data?.price ? truncate(String(data.price), 4) : 60} (Per Hour)</li>
                        </ul>
                    </div>
                    {role === 'patient' && 
                        <div className="clinic-booking">
                            <Link to={`/doctors/profile/${data?._id}`} className="view-pro-btn">View Profile</Link>
                            <Link to={`/booking/${data?._id}`} className="apt-btn">Book Appointment</Link>
                        </div>
                    }
                    { role === 'doctor' && 
                        <div className="clinic-booking">
                            <Link to={`/doctors/profile/${data?._id}`} className="view-pro-btn">View Profile</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchContent;
