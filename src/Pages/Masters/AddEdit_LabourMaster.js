import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row, Container, Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fn_AddEditData, Fn_DisplayData, Fn_FillListData } from '../../store/Functions';
import { API_WEB_URLS } from '../../constants/constAPI';
import ReactToggle from 'react-toggle'; 
import 'react-toggle/style.css'; 

function AddEdit_LabourMaster() {
  const API_URL_SAVE = `${API_WEB_URLS.LabourMaster}/0/token`;  
  const API_URL_EDIT = `${API_WEB_URLS.MASTER}/0/token/LabourMasterEdit/Id`;  
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/LabourMaster`;

  const [state, setState] = useState({
    id: 0,
    FillArray: [],
    formData: {
      Name: null,
      Phone:  0,
      Address: null,
      ProjectName: null,
      AadhaarNo:  0,
      Status: false,
      Photo: null,
    },
    isProgress: true,
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const Id = location.state?.Id || 0;
    Fn_FillListData(dispatch, setState, 'FillArray', `${API_URL}/Id/0`);
    if (Id > 0) {
      setState(prevState => ({ ...prevState, id: Id }));
      console.log('id', Id)
      Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
    }
  }, [location.state, dispatch]);

  
   
  const handleSubmit = (values) => {
    const obj = JSON.parse(localStorage.getItem('authUser'));
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'Photo' && values[key]) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });
    formData.append('UserId', obj?.Id || '');

    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      'memberid',
      navigate,
      '/LabourMaster'
    );
  };

  return (
    <Container className='page-content' style={{ marginBottom: '50px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', marginTop: '80px' }}>
      <h2>LABOUR FORM</h2>
      <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <Formik
          initialValues={state.formData}
          enableReinitialize={true} 
           
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Row>
                <Col lg='6'>
                  <label>Name</label>
                  <Field className='form-control' type='text' name='Name' placeholder='Enter Labour Name' />
              
                </Col>
                <Col lg='6'>
                  <label>Phone</label>
                  <Field className='form-control' type='text' name='Phone' placeholder='e.g. 9876543210' />
                  
                </Col>
              </Row>
              <Row>
                <Col lg='6'>
                  <label>Address</label>
                  <Field className='form-control' type='text' name='Address' placeholder='Enter Complete Address' />
                  
                </Col>
                <Col lg='6'>
                  <label>Labour Work</label>
                  <Field className='form-control' type='text' name='ProjectName' placeholder='Enter Type of Work' />
                  
                </Col>
              </Row>
              <Row>
                <Col lg='6'>
                  <label>Aadhaar No</label>
                  <Field className='form-control' type='text' name='AadhaarNo' placeholder='e.g. 123456789012' />
                  
                </Col>

                <Col lg='6'>
                  <label>Photo</label>
                  <input
                    className='form-control'
                    type='file'
                    name='Photo'
                    accept='image/jpeg, image/png'
                    placeholder='Upload Labour Photo'
                    onChange={(event) => setFieldValue('Photo', event.currentTarget.files[0])}
                  />
                  
                </Col>

                 <Col lg="6" className="mb-3">
                  {state.formData.Photo && (
                    <img
                      src={`${API_WEB_URLS.IMAGEURL}${state.formData.Photo}`}
                      alt="Profile"
                      style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                    />
                  )}
                </Col>

              </Row>

              
              <Button type='submit' color='primary' style={{ marginTop: '20px', width: '100%' }}>Submit</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

export default AddEdit_LabourMaster;
