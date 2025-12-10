import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { Row, Col, CardBody, Card, Alert, Container, Form, Input, FormFeedback, Label } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import logo from "../../assets/images/logo-sm.svg";

//Import config
import { facebook, google } from "../../config";
import { createSelector } from "reselect";

const Login = props => {

  document.title = "Login";

  useEffect(() => {
    if (localStorage.getItem('authUser')) {
      localStorage.removeItem('authUser');
    }
  }, []);

  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      phone: "" || '',
      password: "" || '',
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("Please Enter Your Phone Number"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    }
  });

  // const { error } = useSelector(state => ({
  //   error: state.login.error,
  // }));
  const loginData = createSelector(
    (state) => state.login,
    (state) => ({
      error: state.error,
    })
  );

// Inside your component
const {error} = useSelector(loginData);

  const signIn = (res, type) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        phone: res.profileObj.phone,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.router.navigate, type));
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        phone: res.phone,
        token: res.accessToken,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.router.navigate, type));
    }
  };

  //handleGoogleLoginResponse
  const googleResponse = response => {
    signIn(response, "google");
  };

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  const facebookResponse = response => {
    signIn(response, "facebook");
  };

  return (
    <React.Fragment>
      <div className="authentication-bg min-vh-100">
        <div className="bg-overlay"></div>
        <Container>
          <div className="d-flex flex-column min-vh-100 px-3 pt-4">
            <Row className="justify-content-center my-auto">
              <Col md={8} lg={6} xl={5}>
                <div className="text-center mb-4">
                  <Link to="/">
                    <img src={logo} alt="" height="50" /> <span className="logo-txt">SHIVARK INFRA ENGINEERING PVT. LTD.</span>
                  </Link>
                </div>
                <Card>
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p className="text-muted">Sign in to continue to Shivark Infra.</p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form className="form-horizontal"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}>
                        {error ? <Alert color="danger"><div>{error}</div></Alert> : null}
                        <div className="mb-3">
                          <Label className="form-label">Phone No</Label>
                          <Input
                            name="phone"
                            className="form-control"
                            placeholder="Enter Phone"
                            type="number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phone || ""}
                            invalid={
                              validation.touched.phone && validation.errors.phone ? true : false
                            }
                          />
                          {validation.touched.phone && validation.errors.phone ? (
                            <FormFeedback type="invalid"><div>{validation.errors.phone}</div></FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label className="form-label">Password</Label>
                          <Input
                            name="password"
                            className="form-control"
                            placeholder="Enter Password"
                            type="password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                          ) : null}
                        </div>

                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="auth-remember-check" />
                          <label className="form-check-label" htmlFor="auth-remember-check">Remember me</label>
                        </div>

                        <div className="mt-3 text-end">
                          <button className="btn btn-primary w-sm waves-effect waves-light" type="submit">Log In</button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="font-size-14 mb-3 title">Sign in with</h5>
                          </div>
                          <ul className="list-inline">
                            <li className="list-inline-item">
                              <FacebookLogin
                                appId={facebook.APP_ID}
                                autoLoad={false}
                                callback={facebookResponse}
                                render={renderProps => (
                                  <Link
                                    to="#"
                                    className="social-list-item bg-primary text-white border-primary"
                                    onClick={renderProps.onClick}
                                  >
                                    <i className="mdi mdi-facebook" />
                                  </Link>
                                )}
                              />
                            </li>
                            <li className="list-inline-item">
                              <Link to="#" className="social-list-item bg-info text-white border-info">
                                <i className="mdi mdi-twitter"></i>
                              </Link>
                            </li>
                            <li className="list-inline-item">
                              <GoogleLogin
                                clientId={google.CLIENT_ID}
                                render={renderProps => (
                                  <Link
                                    to="#"
                                    className="social-list-item bg-danger text-white border-danger"
                                    onClick={renderProps.onClick}
                                  >
                                    <i className="mdi mdi-google" />
                                  </Link>
                                )}
                                onSuccess={googleResponse}
                                onFailure={() => { }}
                              />
                            </li>
                          </ul>
                        </div>
                        {/* <div className="mt-4 text-center">
                          <p className="mb-0">Don't have an account ? <Link to="/Register" className="fw-medium text-primary"> Signup now </Link>
                          </p>
                        </div> */}
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="text-center text-muted p-4">
                  <p className="text-white-50">© {new Date().getFullYear()} Shinewell SoftTech. Crafted with <i className="mdi mdi-heart text-danger"></i> by Shinewell SoftTech</p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div >
    </React.Fragment >
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
