import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Fn_FillListData } from "../../store/Functions";
import { API_WEB_URLS } from "../../constants/constAPI";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Row, Col, Label } from "reactstrap";

const PaymentStatusSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    id:0,
    FillArray: [],
  });

   const API_URL = `${API_WEB_URLS.MASTER}/0/token/PaymentMaster`;

   useEffect(() => {
     Fn_FillListData(dispatch, setState, "FillArray", `${API_URL}/Id/0`);      
     }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  
//   useEffect(() => {
//     if (state.PaymentType) {
//       const vformData = new FormData();
//       vformData.append("PaymentType", state.PaymentType);

//       Fn_GetReport(
//         dispatch,
//         setTenderArray,
//         "tenderData",
//         API_URL_GET,
//         { arguList: { id: 0, formData: vformData } },
//         true
//       );
//     }
//   }, [state.PaymentType,  dispatch]);  

  return (
    <div className="page-content">
      <div
        style={{
          paddingRight: "300px",
          paddingLeft: "300px",
          paddingBottom: "10px",
          backgroundColor: "#EDE8DC",
          marginBottom: "-5px",
        }}
      >
        <Row>
          <Col>
            <Label for="Select_PaymentType">Payment Type</Label>
            <Input
  type="select"
  id="PaymentType"
  name="PaymentType"
  value={state.PaymentType}
  onChange={handleChange}
>
  <option value="">Select Payment Type</option>
  {state.FillArray.map((type) => (
    <option key={type.Id} value={type.Id}>
      {type.Name}
    </option>
  ))}
</Input>    
          </Col> 
        </Row>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Breadcrumbs
          title="PAYMENT TYPE"
          breadcrumbItem="Payment TYPE"
        />

        
      </div>
    </div>
  );
};

export default PaymentStatusSearch;
