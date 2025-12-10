import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Fn_AddEditData, Fn_DisplayData } from '../../store/Functions';
import { API_WEB_URLS } from '../../constants/constAPI';
import { useNavigate } from 'react-router-dom';

function AddEdit_DealsMaster() {
  const API_URL_SAVE = `${API_WEB_URLS.DealsMaster}/0/token`;  
  const API_URL_EDIT = `${API_WEB_URLS.MASTER}/0/token/DealsMasterId/Id`;  
  
  const [state, setState] = useState({
    id: 0,
    formData: {
      Name: '',
    },
    isProgress: true,
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const Id = (location.state && location.state.Id) || 0;
    
    if (Id > 0) {
      setState(prevState => ({
        ...prevState,
        id: Id
      }));
      Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
    }
  }, [location.state, dispatch]);

  const validationSchema = Yup.object({
    Name: Yup.string().required('Name is required'),
     
  });

   
  const handleSubmit = (values) => {
    const obj = JSON.parse(localStorage.getItem('authUser'));
    const formData = new FormData();
    formData.append("Name", values.Name);
    formData.append('UserId', obj?.Id || 0);
    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid",
       navigate,
        "/DealsMaster"
    );
  };

  return (
    <div className='page-content'>
      <Formik
        initialValues={state.formData}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ setFieldValue }) => (
          <Form className="form-horizontal">
            <Row>
              <Col lg='6' className="mb-3">
                <label htmlFor="Name" className="form-label">Name</label>
                <Field className="form-control" type="text" name="Name" />
                <ErrorMessage name="Name" component="div" className="text-danger" />
              </Col>
            </Row>
             
            <button type="submit" className="btn btn-primary btn-block">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddEdit_DealsMaster;
