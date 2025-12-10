import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Row } from "reactstrap";
import {
  Fn_AddEditData,
  Fn_DisplayData,
  Fn_FillListData,
} from "../../store/Functions";
import { useDispatch } from "react-redux";
import { API_WEB_URLS } from "../../constants/constAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
 

function AddEdit_UserMaster() {
  const API_URL = API_WEB_URLS.MASTER + "/0/token/UserTypeMaster";
  const API_URL1 = API_WEB_URLS.MASTER + "/0/token/StateMaster";
  const API_URL2 = API_WEB_URLS.MASTER + "/0/token/CityMasterById";
  const API_URL_SAVE = API_WEB_URLS.UserMaster + "/0/token";
  const API_URL_EDIT = API_WEB_URLS.MASTER + "/0/token/UserMasterId/Id";
  
  const [state, setState] = useState({
    id: 0,
    FillArray: [],
    FillArray1: [],
    FillArray2: [],
    formData: {},
    OtherDataScore: [],
    isProgress: true,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
   
  const location = useLocation();

   useEffect(() => {
    Fn_FillListData(dispatch, setState, "FillArray", API_URL + "/Id/0");
    Fn_FillListData(dispatch, setState, "FillArray1", API_URL1 + "/Id/0");
    }, []);

useEffect(() => {
    const fetchData = async () => {
      const Id = location.state?.Id || 0;

      if (Id > 0) {
        try {
          console.log("Fetching data for Id:", Id);

          const data = await Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
          console.log("Fetched Data:", data);

          if (data?.F_StateMaster) {
            Fn_FillListData(dispatch, setState, "FillArray2", `${API_URL2}/Id/${data.F_StateMaster}`);
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
  }, [dispatch, location.state]);


  const validationSchema = Yup.object({
    F_UserType: Yup.string().required("User Type is required"),
    Name: Yup.string().required("Name is required"),
    // UserName: Yup.string().required("UserName is required"),
    UserPass: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),

    // ProfileIMG: Yup.mixed()
    //   .required("Photo is required")
    //   .test(
    //     "fileSize",
    //     "File size is too large",
    //     (value) => !value || (value && value.size <= 5 * 1024 * 1024) // 5MB
    //   )
    //   .test(
    //     "fileFormat",
    //     "Unsupported file format",
    //     (value) => !value || ["image/jpeg", "image/png"].includes(value.type)
    //   ),

    Phone: Yup.string()
          .required('Phone Number is required')
          .matches(/^[0-9]+$/, 'Phone Number must be a number'),
    Email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    Address: Yup.string().required("Address is required"),
    F_StateMaster: Yup.string().required("State is required"),
    F_CityMaster: Yup.string().required("City is required"),
  });

   
  const handleSubmit = async (values) => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    console.log(values);

    let vformData = new FormData();
    vformData.append("F_UserType", values.F_UserType);
    vformData.append("ProfileIMG", values.ProfileIMG);
    vformData.append("Name", values.Name);
    vformData.append("UserPass", values.UserPass);
    vformData.append("Phone", values.Phone);
    vformData.append("Email", values.Email);
    vformData.append("Address", values.Address);
    vformData.append("F_StateMaster", values.F_StateMaster);
    vformData.append("F_CityMaster", values.F_CityMaster);
    vformData.append("UserId", obj.Id);

    try {
        const response = await Fn_AddEditData(
            dispatch,
            setState,
            { arguList: { id: state.id, formData: vformData } },
            API_URL_SAVE,
            true,
            "memberid",
            navigate,
            "/UserMaster"
        );

    } catch (error) {
        console.error("Error submitting data:", error);
        alert("Duplicate Phone Number! Please enter a different phone number.");
    }

    // window.location.reload();
};

  const handleStateChange = (e, setFieldValue) => {
    const value = e.target.value;
    // Clear city selection when state changes
    setFieldValue("F_CityMaster", "");
    // Fetch cities for the selected state
    Fn_FillListData(dispatch, setState, "FillArray2", API_URL2 + "/Id/" + value);
  };

  return (
    <div className="page-content">
      <Container boxed={true}>
        <Formik
          initialValues={state.formData}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}

        >
          {({ setFieldValue, values}) => (
            <Form className="form-horizontal">
              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="F_UserType" className="form-label">
                    UserType
                  </label>
                  <Field className="form-control" as="select" name="F_UserType">
                    <option value="">Select UserType</option>
                    {state.FillArray.map((UserType) => (
                      <option key={UserType.Id} value={UserType.Id}>
                        {UserType.Name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="F_UserType"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="Name" className="form-label">
                    Name
                  </label>
                  <Field className="form-control" type="text" name="Name" />
                  <ErrorMessage
                    name="Name"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>
               
              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="UserPass" className="form-label">
                    User Password
                  </label>
                  <Field
                    className="form-control"
                    type="password"
                    name="UserPass"
                  />
                  <ErrorMessage
                    name="UserPass"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="Phone" className="form-label">
                    Phone
                  </label>
                  <Field className="form-control" type="text" name="Phone" />
                  <ErrorMessage
                    name="Phone"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>

              <Row>
                <Col lg="6" className="mb-3">
                  <label>Photo</label>
                  <input
                    className="form-control"
                    type="file"
                    name="ProfileIMG"
                    accept="image/jpeg, image/png"
                    onChange={(event) =>
                      setFieldValue("ProfileIMG", event.currentTarget.files[0])
                    }
                  />
                  {/* <ErrorMessage
                    name="ProfileIMG"
                    component="div"
                    className="text-danger"
                  /> */}
                </Col>

                <Col lg="6" className="mb-3">
  {state.formData.ProfileIMG && (
    <img
      src={`${API_WEB_URLS.IMAGEURL}${state.formData.ProfileIMG}`}
      alt="Profile"
      style={{ width: "50px", height: "50px", borderRadius: "5px" }}
    />
  )}
</Col>
              </Row>

              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="Email" className="form-label">
                    Email
                  </label>
                  <Field className="form-control" type="email" name="Email" />
                  <ErrorMessage
                    name="Email"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>

              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="Address" className="form-label">
                    Address
                  </label>
                  <Field className="form-control" type="text" name="Address" />
                  <ErrorMessage
                    name="Address"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="F_StateMaster" className="form-label">
                    State
                  </label>
                  <Field
                    className="form-control"
                    as="select"
                    name="F_StateMaster"
                    onChange={(e) => {
                      setFieldValue("F_StateMaster", e.target.value);
                      handleStateChange(e, setFieldValue);
                    }}
                  >
                    <option value="">Select State</option>
                    {state.FillArray1.map((state) => (
                      <option key={state.Id} value={state.Id}>
                        {state.Name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="F_StateMaster"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg="6" className="mb-3">
                  <label htmlFor="F_CityMaster" className="form-label">
                    City
                  </label>
                  <Field className="form-control" as="select" name="F_CityMaster">
                    <option value="">Select City</option>
                    {state.FillArray2.map((city) => (
                      <option key={city.Id} value={city.Id}>
                        {city.Name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="F_CityMaster"
                    component="div"
                    className="text-danger"
                  />
                </Col>
              </Row>

              <button type="submit" className="btn btn-primary btn-block">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}

export default AddEdit_UserMaster;
