import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, FormControl, Table, Spinner, Modal, Form } from "react-bootstrap";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { API_WEB_URLS } from "../../constants/constAPI";
import { useDispatch } from "react-redux";
import { Fn_FillListData, Fn_AddEditData } from "../../store/Functions";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const EMDForm = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, setState] = useState({
    id: 0,
    IsBidAward: false,
    formData: {},
    isProgress: true,
  });

  const [showMainModal, setShowMainModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSecondToggle, setShowSecondToggle] = useState(false);
  const breadCrumbTitle = "EMD Master";
  const breadcrumbItem = "EMD Master";
 
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/EMDFormMasterr`;
  const API_URL_SAVE1 = `${API_WEB_URLS.EMDMaster}/0/token`;
  const API_URL_SAVE = `${API_WEB_URLS.EMDForm}/0/token`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Fn_FillListData(dispatch, setGridData, "gridData", `${API_URL}/Id/0`);
      setLoading(false);
    };
    fetchData();
  }, [dispatch, API_URL]);

  const handleProceedClick = (rowData) => {
    setState((prevState) => ({
      ...prevState,
      id: rowData.Id || 0,
      formData: { ...rowData },
    }));
    setShowMainModal(true);
    setShowSecondToggle(false);
  };

  const handleFirstToggle = (e) => {
    const value = e.target.value;
    if (value === "yes") {
      setShowFormModal(true);
      setShowMainModal(false);
    } else {
      setShowSecondToggle(true);
    }
  };


  

  // const handleSecondToggle = (e) => {
  //   const value = e.target.value;
  //   if (value === "yes") {
  //     navigate("/TenderMasterReport");
  //   } else {
  //     navigate("/dashboard");
  //   }
  // };

  const handleSecondToggle = (e) => {
    const value = e.target.value; // get selected yes/no first
  
    const obj = JSON.parse(localStorage.getItem("authUser"));
    const formData = new FormData();
    formData.append("UserId", obj.Id);
    formData.append("IsBidAward", false);
    //formData.append("F_TenderMaster", false);
    formData.append("IsEMDReceived", value === "yes" ? true : false); // set true/false properly
  
    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid",
      navigate,
      "/WorkStartReport"
    );
  
    // After saving, navigate based on selected value
    if (value === "yes") {
      navigate("/TenderMasterReport");
    } else {
      navigate("/dashboard");
    }
  };
  


  const handleSave = () => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    const formData = new FormData();

    // First append all form data
    Object.keys(state.formData).forEach((key) => {
      formData.append(key, state.formData[key] || "");
    });

    // Then append additional required fields
    formData.append("UserId", obj.Id);
    formData.append("IsBidAward", true);  // Explicitly set IsBidAward to true
    formData.append("F_TenderMaster", state.id);

    // Log the form data for debugging
    console.log("Form Data:", {
      UserId: obj.Id,
      IsBidAward: true,
      F_TenderMaster: state.id,
      ...state.formData
    });

    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid",
      navigate,
      "/WorkStartReport"
    );

    setShowFormModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  const data = useMemo(() => (Array.isArray(gridData) ? gridData : []), [gridData]);

  

  const columns = useMemo(
    () => [
      { Header: "Sr No", accessor: (_, i) => i + 1, disableSortBy: true },
      { Header: "EMD GRN No", accessor: "EMD_GRN_No" },
      { Header: "Date", accessor: "Date" },
      { Header: "Office", accessor: "Office" },
      { Header: "Location", accessor: "Location" },
      {
        Header: "Proceed",
        Cell: ({ row }) => (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleProceedClick(row.original)}
          >
            Proceed
          </Button>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={breadCrumbTitle} breadcrumbItem={breadcrumbItem} />
        <Row className="mb-2">
          <Col md="4">
            <FormControl type="text" placeholder="Search" />
          </Col>
        </Row>

        <Table {...getTableProps()} responsive bordered striped>
          <thead>
            {headerGroups.map((headerGroup, idx) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                {headerGroup.headers.map((column, colIdx) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={colIdx}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, idx) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={idx}>
                  {row.cells.map((cell, cellIdx) => (
                    <td {...cell.getCellProps()} key={cellIdx}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showMainModal} onHide={() => setShowMainModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to proceed?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type="radio"
            name="firstToggle"
            value="yes"
            label="Bid Award"
            onChange={handleFirstToggle}
          />
          <Form.Check
            type="radio"
            name="firstToggle"
            value="no"
            label="Not Award"
            onChange={handleFirstToggle}
          />
          <br />
          {showSecondToggle && (
  <>
    <Form.Label>EMD RECEIVED?</Form.Label>
    <Form.Check
      type="radio"
      name="secondToggle"
      value="yes"
      label="Yes"
      onChange={handleSecondToggle}
    />
    <Form.Check
      type="radio"
      name="secondToggle"
      value="no"
      label="No"
      onChange={handleSecondToggle}
    />
  </>
)}

        </Modal.Body>
      </Modal>

      {/* Form Modal */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Fill EMD Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Work Start Date</Form.Label>
            <Form.Control
              type="date"
              name="WorkStartDate"
              value={state.formData.WorkStartDate || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Time Period</Form.Label>
            <Form.Control
              type="number"
              name="TimePeriod"
              value={state.formData.TimePeriod || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Percentage</Form.Label>
            <Form.Control
              type="number"
              name="Percentage"
              value={state.formData.Percentage || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tender Amount</Form.Label>
            <Form.Control
              type="number"
              name="TenderAmount"
              value={state.formData.TenderAmount || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setShowFormModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EMDForm;
