import React from 'react'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaBriefcase } from "react-icons/fa";

const OverView = ({data}) => {
    return (
        <div className="col-md-12 col-lg-9">
            <div className='mb-3'>
                <h5 className='overview-text'>About Me</h5>
                <p className='text-secondary'>{data?.biography}</p>
            </div>

            <div>
                <h5 className='overview-text'>Education</h5>

                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date={data?.completionYear}
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">{data?.college}</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Creative Direction, User Experience, Visual Design, Project Management, Team Leading
                        </p>
                    </VerticalTimelineElement>

                </VerticalTimeline>

            </div>
            <div className='my-5'>
                <h5 className='overview-text'>Work & Experience</h5>

                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date={data?.year}
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">{data?.clinicName}</h5>
                        <h6 className="text-white">{data?.clinicAddress}</h6>
                        <p style={{ fontSize: '14px' }}>
                            Creative Direction, User Experience, Visual Design, Project Management, Team Leading
                        </p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date={`${data?.experienceStart} - ${data?.experienceEnd}`}
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">{data?.experienceHospitalName}</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>
                            Creative Direction, User Experience, Visual Design, Project Management, Team Leading
                        </p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="2005 - 2007 (2 years)"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">Dream Smile Dental Practice</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, dignissimos.</p>
                    </VerticalTimelineElement>


                  

                </VerticalTimeline>
                
            </div>
            <div >
                <h5 className='overview-text'>Awards</h5>

                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date={data?.awardYear}
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">{data?.award}</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a ipsum tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#000' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="March 2011"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">Certificate for International Volunteer Service</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a ipsum tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#2e81c4', color: '#00' }}
                        contentArrowStyle={{ borderRight: '7px solid  #2e81c4' }}
                        date="March 2011"
                        iconStyle={{ background: '#2e81c4', color: '#fff' }}
                        icon={<FaBriefcase />}
                    >
                        <h5 className="text-white">The Dental Professional of The Year Award</h5>
                        <h6 className="text-white">Miami, FL</h6>
                        <p style={{ fontSize: '14px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a ipsum tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
                    </VerticalTimelineElement>

                </VerticalTimeline>
            </div>
            <div>
                <h5 className='overview-text'>Services</h5>
                <ul>
                {data?.services.map((service, index) => (
                        service.split(',').map((individualService, subIndex) => (
                            <li key={index + "-" + subIndex}>{individualService.trim()}</li>
                        ))
                    ))}
                </ul>
            </div>
            <div>
                <h5 className='overview-text'>Specializations</h5>
                <ul className="clearfix">
                    {data?.specialization && data.specialization.split(',').map((individualService, index) => (
                            <li key={index }>{individualService.trim()}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}
export default OverView;