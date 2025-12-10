import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid ={true}>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © Shinewell SoftTech.</Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Crafted with <i className="mdi mdi-heart text-danger"></i> by
                <Link to="/Themesbrand.com/" target="_blank" className="text-reset"> Shinewell SoftTech</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>

  );
}

export default Footer;