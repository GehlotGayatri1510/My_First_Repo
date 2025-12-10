import React from "react";

import { Container } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableComponent from "./TableComponent";

const Dashboard = () => {
  document.title = "Dashboard";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* <Breadcrumbs title="WELCOME TO SHIVARK INFRA ENGINEERING Pvt Ltd!" breadcrumbItem="WELCOME TO SHIVARK INFRA ENGINEERING Pvt Ltd!" /> */}
          <h4>WELCOME TO SHIVARK INFRA ENGINEERING Pvt Ltd!</h4>
          <TableComponent/>
          
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
