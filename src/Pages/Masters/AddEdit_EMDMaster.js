// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Col, Row, Container, Button } from "reactstrap";
// import { useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Fn_AddEditData,
//   Fn_DisplayData,
//   Fn_FillListData,
// } from "../../store/Functions";
// import { API_WEB_URLS } from "../../constants/constAPI";
// import ReactToggle from "react-toggle";
// import "react-toggle/style.css";

// function AddEdit_EMDMaster() {
//   const API_URL_SAVE = `${API_WEB_URLS.EMDMaster}/0/token`;
//   const API_URL_EDIT = `${API_WEB_URLS.MASTER}/0/token/EMDMasterEdit/Id`;
//   const API_URL = `${API_WEB_URLS.MASTER}/0/token/EMDMaster`;

//   const [state, setState] = useState({
//     id: 0,
//     FillArray: [],
//     formData: {
//       TenderAmount: 0,
//       EmdAmt: 0,
//       TenderFees: 0,
//       ProcessingFees: 0,
//       TimePeriod: 0,
//       Percentage: 0,
//       Date: null,
//       WorkStartDate: null,
//       Office: null,
//       Location: null,
//       EMD_GRN_No: "",
//       IsBidAward: false,
//       EMDReceipt: null,
//     },
//     isProgress: true,
//   });

//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const Id = location.state?.Id || 0;
//     Fn_FillListData(dispatch, setState, "FillArray", `${API_URL}/Id/0`);

//     if (Id > 0) {
//       setState((prevState) => ({ ...prevState, id: Id }));
//       Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
//     }
//   }, [location.state, dispatch]);

//   const validationSchema = Yup.object().shape({
     
//     EMD_GRN_No: Yup.string().required("EMD GRN No is required"),

    
//   });

//   const handleSubmit = (values) => {
//     try {
//       console.log("Submitting form data:", values); // Debugging log

//       const obj = JSON.parse(localStorage.getItem("authUser"));
//       const formData = new FormData();

//       Object.keys(values).forEach((key) => {
//         if (key === "EMDReceipt" && values[key] instanceof File) {
//           formData.append(key, values[key]);
//         } else {
//           formData.append(key, values[key]);
//         }
//       });

//       formData.append("UserId", obj?.Id || 0);

//       Fn_AddEditData(
//         dispatch,
//         setState,
//         { arguList: { id: state.id, formData } },
//         API_URL_SAVE,
//         true,
//         "memberid",
//         navigate,
//         "/EMDMaster"
//       );
//       console.log("Form submitted successfully"); // Debugging log
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <Container
//       className="page-content"
//       style={{
//         marginBottom: "50px",
//         padding: "20px",
//         background: "#f9f9f9",
//         borderRadius: "8px",
//         marginTop: "80px",
//       }}
//     >
//       <div>
//         <h2>EMD FORM</h2>
//       </div>
//       <div
//         style={{
//           maxHeight: "80vh",
//           overflowY: "auto",
//           padding: "20px",
//           background: "#fff",
//           borderRadius: "8px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Formik
//           // initialValues={state.formData}
//           // enableReinitialize
//           // validationSchema={validationSchema}
//           // onSubmit={handleSubmit}

//           initialValues={state.formData}
//   enableReinitialize
//   validationSchema={validationSchema}
//   onSubmit={handleSubmit}
//   validateOnBlur={true}
//   validateOnChange={true}
//         >
//           {({ setFieldValue, values }) => (
//             <Form>
//               <Row>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Tender Amount</label>
//                     <Field
//                       className="form-control"
//                       type="number"
//                       name="TenderAmount"
//                     />
                   
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>EMD Amount</label>
//                     <Field
//                       className="form-control"
//                       type="number"
//                       name="EmdAmt"
//                     />
                   
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Tender Fees</label>
//                     <Field
//                       className="form-control"
//                       type="number"
//                       name="TenderFees"
//                     />
                    
//                   </div>
//                 </Col>{" "}
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Processing Fees</label>
//                     <Field
//                       className="form-control"
//                       type="number"
//                       name="ProcessingFees"
//                     />
                    
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>EMD GRN No</label>
//                     <Field className="form-control" type="text" name="EMD_GRN_No" />
// <ErrorMessage name="EMD_GRN_No" component="div" style={{ color: "red" }} />

//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Work Start Date</label>
//                     <Field
//                       className="form-control"
//                       type="date"
//                       name="WorkStartDate"
//                     />
                   
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Date</label>
//                     <Field className="form-control" type="date" name="Date" />
                    
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Location</label>
//                     <Field
//                       className="form-control"
//                       type="text"
//                       name="Location"
//                     />
                     
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Office</label>
//                     <Field className="form-control" type="text" name="Office" />
                     
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Time Period</label>
//                     <Field
//                       className="form-control"
//                       type="number"
//                       name="TimePeriod"
//                     />
                     
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>Percentage</label>
//                     <Field
//                       className="form-control"
//                       type="text"
//                       name="Percentage"
//                     />
                    
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div style={{ marginBottom: "15px" }}>
//                     <label>EMD Receipt</label>
//                     <input
//                       className="form-control"
//                       type="file"
//                       name="EMDReceipt"
//                       onChange={(event) =>
//                         setFieldValue(
//                           "EMDReceipt",
//                           event.currentTarget.files[0]
//                         )
//                       }
//                     />
                   
//                   </div>
//                 </Col>
//                 <Col lg="6">
//                   <div
//                     style={{
//                       marginBottom: "15px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <label>IsBidAward</label>
//                     <ReactToggle
//                       checked={values.IsBidAward}
//                       onChange={() =>
//                         setFieldValue("IsBidAward", !values.IsBidAward)
//                       }
//                     />
                    
//                   </div>
//                 </Col>
//               </Row>
//               <Button
//                 type="submit"
//                 color="primary"
//                 style={{
//                   marginTop: "20px",
//                   width: "100%",
//                   padding: "10px",
//                   fontSize: "16px",
//                 }}
//               >
//                 Submit
//               </Button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </Container>
//   );
// }

// export default AddEdit_EMDMaster;
