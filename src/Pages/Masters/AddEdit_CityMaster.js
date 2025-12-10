import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Container, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fn_AddEditData, Fn_DisplayData, Fn_FillListData } from '../../store/Functions';
import { API_WEB_URLS } from '../../constants/constAPI';

function AddEdit_CityMaster() {
  const API_URL_SAVE = `${API_WEB_URLS.CityMaster}/0/token`;
  const API_URL_EDIT = `${API_WEB_URLS.MASTER}/0/token/CityMasterEdit/Id`; 
  const API_URL_EDIT1 = `${API_WEB_URLS.MASTER}/0/token/StateMasterEdit/Id`;     
  const API_URL = API_WEB_URLS.MASTER + "/0/token/CityMaster" ;
  const API_URL1 = API_WEB_URLS.MASTER + "/0/token/StateMaster"
  const [state, setState] = useState({
    id: 0,
    FillArray: [],
    FillArray1: [],
    formData: {},
    OtherDataScore: [], 
    isProgress: true,
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const Id = (location.state && location.state.Id) || 0;
    Fn_FillListData(dispatch, setState, "FillArray1", API_URL + "/Id/0")
    Fn_FillListData(dispatch, setState, "FillArray", API_URL1 + "/Id/0")
    if (Id > 0) {
      setState(prevState => ({
        ...prevState,
        id: Id
      }));
      Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
      Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT1);
    }
  }, [location.state, dispatch]);

  const validationSchema = Yup.object({
    
    F_StateMaster : Yup.string().required('State is required'),
    Name: Yup.string().required('Cityr is required'),
  });

  const handleSubmit = (values) => {
    const formData = new FormData();
     
    formData.append("F_StateMaster", values.F_StateMaster);
    formData.append("Name", values.Name);

    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid",
      navigate,
      '#'
    );
  };

  return (
    <div className='page-content'>
      <h5 style={{color:'black', alignItems:'center'}}>City Master</h5>
      <Container boxed={true}>
      <Formik
        initialValues={state.formData}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        <Form className="form-horizontal">
        <Row>
              <Col lg="6" className="mb-3">
                <label htmlFor="F_StateMaster" className="form-label">
                  State
                </label>
                <Field
                  className="form-control"
                  as="select"
                  name="F_StateMaster"
                >
                  <option value="">Select State</option>
                  {state.FillArray.map(type => (
                    <option key={type.Id} value={type.Id}>
                      {type.Name}
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
                 
                {/* <Field
                  className="form-control"
                  as="select"
                  name="Name"
                >
                  <option value="">Select City</option>
                  {state.FillArray1.map(type => (
                    <option key={type.Id} value={type.Id}>
                      {type.Name}
                    </option>
                  ))}
                </Field> */}

            <label htmlFor="Name" className="form-label">City Name</label>
                <Field className="form-control" type="text" name="Name" />
              <ErrorMessage name="Name" component="div" className="text-danger"/>
              </Col>
            </Row>
          
          <button type="submit" className="btn btn-primary btn-block">Submit</button>
        </Form>
      </Formik>
      </Container>
    </div>
  );
}

export default AddEdit_CityMaster;

