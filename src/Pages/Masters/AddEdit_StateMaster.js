import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Fn_AddEditData, Fn_DisplayData } from '../../store/Functions';
import { API_WEB_URLS } from '../../constants/constAPI';

function AddEdit_StateMaster() {
  const API_URL_SAVE = `${API_WEB_URLS.StateMaster}/0/token`;  
  const API_URL_EDIT = `${API_WEB_URLS.MASTER}/Masters/0/token/StateMasterId/Id/Id`;  
  
  const [state, setState] = useState({
    id: 0,
    formData: {
      Name: '',
    },
    isProgress: true,
  });

  const dispatch = useDispatch();
  const location = useLocation();


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
    const formData = new FormData();
    formData.append("Name", values.Name);
    
    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid"
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

export default AddEdit_StateMaster;
