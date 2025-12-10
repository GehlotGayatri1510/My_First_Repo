import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row, Container, Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fn_AddEditData, Fn_DisplayData, Fn_FillListData } from '../../store/Functions';
import { API_WEB_URLS } from '../../constants/constAPI';
 
function AddEdit_Uploads() {
  const API_URL_SAVE = `${API_WEB_URLS.FilesMaster}/0/token`;    
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/FilesMaster`;

  const [state, setState] = useState({
    id: 0,
    FillArray: [],
    formData: {
      Name: '',
      Files: [],
    },
    isProgress: true,
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const Id = location.state?.Id || 0;
    Fn_FillListData(dispatch, setState, 'FillArray', `${API_URL}/Id/0`);
    // if (Id > 0) {
    //   setState(prevState => ({ ...prevState, id: Id }));
    //   Fn_DisplayData(dispatch, setState, Id, API_URL_EDIT);
    // }
  }, [location.state, dispatch]);

  const validationSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Files: Yup.array()
      .min(1, 'At least one file is required')
      .max(5, 'Maximum 5 files allowed')
      .required('Files are required')
  });

  const handleSubmit = (values) => {
    const obj = JSON.parse(localStorage.getItem('authUser'));
    const formData = new FormData();
    
    // Append all form data
    Object.keys(values).forEach((key) => {
      if (key === "Files") {
        // Append each file separately
        values[key].forEach((file, index) => {
          formData.append(`Files[${index}]`, file);
        });
      } else {
        formData.append(key, values[key]);
      }
    });
    
    formData.append('UserId', obj?.Id || '');
    formData.append('TotalFiles', values.Files.length);

    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      'memberid',
      navigate,
      '/UploadsMaster'
    );
  };

  return (
    <Container className='page-content' style={{ marginBottom: '50px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', marginTop: '80px' }}>
      <h2>UPLOAD FILES FORM</h2>
      <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <Formik
          initialValues={state.formData}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Row>
                <Col lg='6'>
                  <label>Name</label>
                  <Field className='form-control' type='text' name='Name' />
                  <ErrorMessage name='Name' component='div' className='text-danger' />
                </Col> 
              </Row>
              <Row>
                <Col lg='6'>
                  <label>Upload Files (Max 5 files)</label>
                  <input
                    className="form-control"
                    type="file"
                    name="Files"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.currentTarget.files);
                      if (files.length > 5) {
                        alert('Maximum 5 files allowed');
                        return;
                      }
                      setFieldValue("Files", files);
                    }}
                  />
                  <ErrorMessage name='Files' component='div' className='text-danger' />
                  {values.Files && values.Files.length > 0 && (
                    <div className="mt-2">
                      <p>Selected files: {values.Files.length}</p>
                      <ul>
                        {values.Files.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
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

export default AddEdit_Uploads;
