import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetAppointmentedPaymentInfoQuery } from "../../../redux/api/appointmentApi";
import moment from "moment";
import { Empty, Button } from "antd";
import { FaPrint } from "react-icons/fa";
import ReactToPrint from "react-to-print";
import AdminHeader from "../../UI/AdminHeader";
import Footer from "../../Shared/Footer/Footer";
import logo from "../../../images/logo.png";

const InvoiceDetail = () => {
  const ref = useRef();
  const { id } = useParams();
  const { data, isLoading, isError } = useGetAppointmentedPaymentInfoQuery(id);

  let content = null;
  if (isLoading) content = <div>Loading ...</div>;
  if (!isLoading && isError) content = <div>Something went Wrong!</div>;
  if (!isLoading && !isError && !data) content = <Empty />;
  if (!isLoading && !isError && data) {
    content = (
      <>
        <div className="col-lg-8 offset-lg-2">
          <div className="invoice-content">
            <div className="invoice-item">
              <div className="row">
                <div className="col-md-6">
                  <div className="invoice-logo">
                    <img src={logo} alt="Logo" />
                  </div>
                </div>
                <div className="col-md-6">
                  <p className="invoice-details">
                    <strong>Invoice:</strong> #{data.invoiceNumber} <br />
                    <strong>Issued:</strong> {moment(data.createdAt).format("LL")}
                  </p>
                </div>
              </div>
            </div>

            <div className="invoice-item">
              <div className="row">
                <div className="col-md-6">
                  <div className="invoice-info">
                    <strong className="customer-text">Invoice From</strong>
                    <p className="invoice-details invoice-details-two">
                      Dr. {data?.doctorId?.firstName || "Of DoctorOnCall"} {data?.doctorId?.lastName} <br />
                      {data?.doctorId?.address || "Sylhet, Dhaka, BD, 3214"}, {data?.doctorId?.city}, <br />
                      {data?.doctorId?.country} <br />
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="invoice-info invoice-info2">
                    <strong className="customer-text">Invoice To</strong>
                    <p className="invoice-details">
                      {data?.patientId?.firstName + " " + data?.patientId?.lastName} <br />
                      {data?.patientId?.address}, {data?.patientId?.city}, <br />
                      {data?.patientId?.country} <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-item">
              <div className="row">
                <div className="col-md-12">
                  <div className="invoice-info">
                    <strong className="customer-text">Payment Method</strong>
                    <p className="invoice-details invoice-details-two">
                      {data?.paymentMethod} <br />
                      {data?.paymentType} <br />
                      XXXXXXXXXXXX-2541 <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-item invoice-table-wrap">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="invoice-table table table-bordered">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th className="text-center">Doctor Fee</th>
                          <th className="text-center">VAT</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>General Consultation</td>
                          <td className="text-center">${data?.DoctorFee}</td>
                          <td className="text-center">${data?.vat || 0}</td>
                          <td className="text-right">${data?.totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="invoice-table-two table">
                      <tbody>
                        <tr>
                          <th>Subtotal:</th>
                          <td><span>${data?.totalAmount}</span></td>
                        </tr>
                        <tr>
                          <th>Discount:</th>
                          <td><span>0%</span></td>
                        </tr>
                        <tr>
                          <th>Total Amount:</th>
                          <td><span>${data?.totalAmount}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="other-info">
              <h4>Other Information</h4>
              <p className="text-muted mb-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed dictum ligula, cursus blandit risus. Maecenas eget metus non tellus dignissim aliquam ut a ex. Maecenas sed vehicula dui, ac suscipit lacus. Sed finibus leo vitae lorem interdum, eu scelerisque tellus fermentum. Curabitur sit amet lacinia lorem. Nullam finibus pellentesque libero.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="content" style={{ marginBottom: "7rem", marginTop: "10rem" }}>
        <div className="d-flex justify-content-end mb-4" style={{ marginRight: "8rem" }}>
          <ReactToPrint
            bodyClass="print-agreement"
            content={() => ref.current}
            trigger={() => (
              <Button type="primary" icon={<FaPrint />}>
                Print
              </Button>
            )}
          />
        </div>
        <div className="container-fluid" ref={ref}>
          <div className="row">{content}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvoiceDetail;
