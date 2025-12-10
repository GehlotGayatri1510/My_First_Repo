import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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

function AddEdit_VendorMaster() {
  const API_URL_SAVE = `${API_WEB_URLS.VendorMaster}/0/token`;
  const API_URL_EDIT = `${API_WEB_URLS.MASTER}/0/token/VendorMasterEdit/Id`;
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/VendorMaster`;
  const API_URL1 = `${API_WEB_URLS.MASTER}/0/token/DealsMaster`;
  const API_URL2 = `${API_WEB_URLS.MASTER}/0/token/StateMaster`;
  const API_URL3 = `${API_WEB_URLS.MASTER}/0/token/CityMasterById`;

  const [state, setState] = useState({
    id: 0,
    FillArray: [],
    FillArray1: [],
    FillArray2: [],
    FillArray3: [],
    formData: {
      Name: null,
      Phone: 0,
      CompanyName: null,
      F_CityMaster: 0,
      F_StateMaster: 0,
      VendorType: null,
      Status: false,
    },
    isProgress: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    Fn_FillListData(dispatch, setState, "FillArray", API_URL + "/Id/0");
    Fn_FillListData(dispatch, setState, "FillArray1", API_URL1 + "/Id/0");
    Fn_FillListData(dispatch, setState, "FillArray2", API_URL2 + "/Id/0");
  }, []);

  // Fetch data when editing
  useEffect(() => {
    const fetchData = async () => {
      const Id = location.state?.Id || 0;

      if (Id > 0) {
        try {
          console.log("Fetching data for Id:", Id);

          const data = await Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
          console.log("Fetched Data:", data);

          if (data?.F_StateMaster) {
            Fn_FillListData(dispatch, setState, "FillArray3", `${API_URL3}/Id/${data.F_StateMaster}`);
          }

          // Update state with fetched data
          setState((prevState) => ({
            ...prevState,
            id: Id,
            formData: { ...data },
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [dispatch, location.state]); // Runs when location.state changes

  

  const handleSubmit = (values) => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    const formData = new FormData();

    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append("UserId", obj.Id);

    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } }, // Pass the correct ID
      API_URL_SAVE,
      true,
      "memberid",
      navigate,
      "/VendorMaster"
    );
  };

  const handleStateChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue("F_CityMaster", ""); // Reset City selection when State changes
    Fn_FillListData(dispatch, setState, "FillArray3", API_URL3 + "/Id/" + value);
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
      <h2>VENDOR FORM</h2>

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
          enableReinitialize={true} // Important: Update form values when state.formData changes
         
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Row>
                <Col lg="6">
                  <label>Name</label>
                  <Field className="form-control" type="text" name="Name" />
                  
                </Col>

                <Col lg="6">
                  <label>Phone</label>
                  <Field className="form-control" type="text" name="Phone" />
                   
                </Col>
              </Row>

              <Row>
                <Col lg="6">
                  <label>State</label>
                  <Field className="form-control" as="select" name="F_StateMaster" onChange={(e) => {
                    setFieldValue("F_StateMaster", e.target.value);
                    handleStateChange(e, setFieldValue);
                  }}>
                    <option value="">Select State</option>
                    {state.FillArray2.map((state) => (
                      <option key={state.Id} value={state.Id}>
                        {state.Name}
                      </option>
                    ))}
                  </Field>
                 
                </Col>

                <Col lg="6">
                  <label>City</label>
                  <Field className="form-control" as="select" name="F_CityMaster">
                    <option value="">Select City</option>
                    {state.FillArray3.map((city) => (
                      <option key={city.Id} value={city.Id}>
                        {city.Name}
                      </option>
                    ))}
                  </Field>
                  
                </Col>
              </Row>


              <Row>
              <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Company Name</label>
                    <Field
                      className="form-control"
                      type="text"
                      name="CompanyName"
                    />
                    <ErrorMessage
                      name="CompanyName"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                </Col>

                <Col lg="6">
                  <div style={{ marginBottom: "15px" }}>
                    <label>Vendor Type</label>
                    <Field
                      className="form-control"
                      type="text"
                      name="VendorType"
                    />
                    <ErrorMessage
                      name="VendorType"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                </Col>
                

                
              </Row>

              <Row>
              <Col lg="6">
                  <div
                    style={{
                      marginBottom: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label>Status</label>
                    <ReactToggle
                      // checked={values.Status}
                      onChange={() => setFieldValue("Status", !values.Status)}
                    />
                    
                  </div>
                </Col>
              </Row>

              <Button type="submit" color="primary" style={{ marginTop: "20px", width: "100%", padding: "10px", fontSize: "16px" }}>
                {state.id ? "Update" : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

export default AddEdit_VendorMaster;
