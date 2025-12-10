import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Col, Row, Container, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Fn_AddEditData,
  Fn_DisplayData,
  Fn_FillListData,
} from "../../store/Functions";
import { API_WEB_URLS } from "../../constants/constAPI";
import ReactToggle from "react-toggle";
import "react-toggle/style.css";

function AddEdit_TenderMaster() {
  const API_URL_SAVE = `${API_WEB_URLS.TenderMaster}/0/token`;
  const API_URL_EDIT = `${API_WEB_URLS.MASTER}/0/token/TenderMasterEdit/Id`;
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/TenderMaster`;

  const [state, setState] = useState({
    id: 0,
    F_EmdMaster: "",
    FillArray: [],
    formData: {
      Name: null,
      TenderID: null,
      Amount: 0,
      TenderStartDate: '',
      TenderEndDate: '',
      Department: null,
      Area: null,
      Status: false,
      Document: null
    },
    isProgress: false,
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const Id = location.state?.Id || 0;
    if (Id > 0) {
      setState(prevState => ({ ...prevState, id: Id }));
      Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
    }
  }, [location.state, dispatch]);

  const handleSubmit = (values) => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    const formData = new FormData();
    
    // Handle all values properly
    Object.keys(values).forEach((key) => {
      if (key === "Document" && values[key] instanceof File) {
        formData.append(key, values[key]);
      } else if (key === "Status") {
        formData.append(key, values[key] || false);
      } else if (key === "Amount") {
        formData.append(key, values[key] || 0);
      } else if (key === "TenderStartDate" || key === "TenderEndDate") {
        // Allow empty dates to be saved
        formData.append(key, values[key] || '');
      } else {
        formData.append(key, values[key] || null);
      }
    });
    
    formData.append("UserId", obj?.Id || 0);

    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid",
      navigate,
      "/TenderMaster"
    );
  };

  return (
    <Container
      className="page-content"
      style={{
        marginBottom: "50px",
        padding: "20px",
        background: "#f9f9f9",
        borderRadius: "8px",
        marginTop: "80px",
      }}
    >
      <div>
        <h2>TENDER FORM</h2>
      </div>
      <div
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Formik
          initialValues={state.formData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Row>
                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Name</label>
                    <Field className="form-control" type="text" name="Name" placeholder="Enter Tender Name" />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Tender ID</label>
                    <Field className="form-control" type="text" name="TenderID" placeholder="Enter Tender ID" />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Amount</label>
                    <Field className="form-control" type="number" name="Amount" placeholder="Enter Amount" />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Tender Start Date</label>
                    <Field className="form-control" type="date" name="TenderStartDate" />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Department</label>
                    <Field className="form-control" type="text" name="Department" placeholder="Enter Department" />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Tender End Date</label>
                    <Field className="form-control" type="date" name="TenderEndDate" />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Area</label>
                    <Field className="form-control" type="text" name="Area" placeholder="Enter Area" />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Document</label>
                    <input
                      className="form-control"
                      type="file"
                      name="Document"
                      onChange={(event) => setFieldValue("Document", event.currentTarget.files[0])}
                    />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <label>Status</label>
                    <ReactToggle
                      checked={values.Status}
                      onChange={() => setFieldValue("Status", !values.Status)}
                    />
                  </div>
                </Col>
              </Row>
              <Button
                type="submit"
                color="primary"
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                }}
              >
                {state.id > 0 ? "Update" : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

export default AddEdit_TenderMaster;
