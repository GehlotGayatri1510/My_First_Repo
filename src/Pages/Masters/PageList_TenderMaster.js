import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, FormControl, Table, Spinner } from "react-bootstrap";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import { API_WEB_URLS } from "../../constants/constAPI";
import { useDispatch } from "react-redux";
import {
  Fn_FillListData,
  Fn_DeleteData,
  Fn_AddEditData,
} from "../../store/Functions";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";

const PageList_TenderMaster = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({
    id: 0,
    FillArray: [],
    FillArray1: [],
    formData: {},
    OtherDataScore: [],
    isProgress: true,
  });

  const breadCrumbTitle = "Tender Master";
  const breadcrumbItem = "Tender Master";
  const rtPage_Add = "/AddTender";
  const rtPage_Edit = "/EditTender";
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/TenderMaster`;
 
  const API_URL_SAVE = `${API_WEB_URLS.EMDMaster}/0/token`;

  const [errors, setErrors] = useState({});

  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Fn_FillListData(
        dispatch,
        setGridData,
        "gridData",
        `${API_URL}/Id/0`
      );
      setLoading(false);
    };
    fetchData();
  }, [dispatch, API_URL]);

   

  const btnAddOnClick = () => navigate(rtPage_Add, { state: { Id: 0 } });
  const btnEditOnClick = (Id) => navigate(rtPage_Edit, { state: { Id } });
  const btnDeleteOnClick = (Id) => {
    Fn_DeleteData(dispatch, setState, Id, `${API_URL}`, true);
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const btnProceedOnClick = (rowId) => {
    const selectedRow = gridData.find((row) => row.Id === rowId);
    setSelectedData({
      ...(selectedRow || {}),
      id: rowId, //  
    });
    setShowModal(true);
  };
 
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSelectedData((prevData) => ({
      ...prevData,
      [name]: files[0] || null, // Ensure file is properly assigned
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // clear error on input
    }));
  };
  
  const handleSave = () => {

    console.log("Saved Data:", selectedData);

    if (!selectedData) {
      console.error("No data selected!");
      return;
    }

    const newErrors = {};

    // Check EMD_GRN_No is not empty
    if (!selectedData.EMD_GRN_No || selectedData.EMD_GRN_No.trim() === "") {
      newErrors.EMD_GRN_No = "EMD GRN No. is required.";
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) return;

    const obj = JSON.parse(localStorage.getItem("authUser"));
    const formData = new FormData();

    // Append all selectedData values to formData
    Object.keys(selectedData).forEach((key) => {
      if (selectedData[key] instanceof File) {
        formData.append(key, selectedData[key]); // Handle file input
      } else {
        formData.append(key, selectedData[key] || ""); // Handle text inputs
      }
    });

    formData.append("UserId", obj.Id);
    formData.append("F_TenderMaster", selectedData.id  || 0);
    // Ensure TenderMaster ID is set
   console.log('tenderid',  selectedData.id);
   formData.append("IsBidAward", true);


    Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid",
      navigate,
      "/EMDForm"
    );

    setShowModal(false);
  };

  const data = useMemo(
    () => (Array.isArray(gridData) ? gridData : []),
    [gridData]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, i) => i + 1 || 0,
        disableSortBy: true,
      },
      { Header: "Name", accessor: "Name" },
      { Header: "TenderID", accessor: "TenderID" },
      { Header: "Amount", accessor: "Amount" },
      { Header: "Area", accessor: "Area" },
      { Header: "Department", accessor: "Department" },
      { Header: "TenderEndDate", accessor: "TenderEndDate" },
      { Header: "TenderStartDate", accessor: "TenderStartDate" },
      {
        Header: "Document",
        accessor: "Document",
        Cell: ({ value }) =>
          value ? (
            <a
              href={`${API_WEB_URLS.IMAGEURL}${value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          ) : (
            "No File"
          ),
      },
      {
        Header: "Status",
        accessor: "Status",
        Cell: ({ value }) => (
          <span
            style={{
              color: value === true ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {value === true ? "Active" : "Non-Active"}
          </span>
        ),
      },
      {
        Header: "Edit",
        Cell: ({ row }) => (
          <Button
            variant="primary"
            size="sm"
            onClick={() => btnEditOnClick(row.original.Id)}
          >
            Edit
          </Button>
        ),
      },
      {
        Header: "Delete",
        Cell: ({ row }) => (
          <Button
            variant="danger"
            size="sm"
            onClick={() => btnDeleteOnClick(row.original.Id)}
          >
            Delete
          </Button>
        ),
      },

      {
        Header: "Proceed",
        Cell: ({ row }) => (
          <Button
            variant="success"
            size="sm"
            onClick={() => btnProceedOnClick(row.original.Id)}
          >
            Proceed
          </Button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={breadCrumbTitle} breadcrumbItem={breadcrumbItem} />
        <Row className="mb-2">
          <Col md="4">
            <FormControl
              type="text"
              placeholder="Search"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="mb-2"
            />
          </Col>
          <Col md="4">
            <Button
              type="button"
              onClick={btnAddOnClick}
              variant="success"
              className="mb-2"
            >
              Add New
            </Button>
          </Col>
        </Row>
        <Table {...getTableProps()} responsive bordered striped>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}{" "}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Row className="mt-2">
          <Col>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </Button>{" "}
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </Button>{" "}
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </Button>{" "}
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>{" "}
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <span>
              | Go to page:{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) =>
                  gotoPage(Math.max(0, Number(e.target.value) - 1))
                }
                style={{ width: "100px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Fill EMD Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedData && (
            <Form>
              <Form.Group>
                <Form.Label>Fill EMD Receipt</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  name="EMDReceipt"
                />
              </Form.Group>

              <Form.Group>
  <Form.Label>EMD GRN No.</Form.Label>
  <Form.Control
    type="text"
    value={selectedData.EMD_GRN_No || ""}
    onChange={handleChange}
    name="EMD_GRN_No"
    isInvalid={!!errors.EMD_GRN_No}
  />
  <Form.Control.Feedback type="invalid">
    {errors.EMD_GRN_No}
  </Form.Control.Feedback>
</Form.Group>


              <Form.Group>
                <Form.Label>Office</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedData.Office ||  ""}
                  onChange={handleChange}
                  name="Office"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Place</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedData.Location ||  ""}
                  onChange={handleChange}
                  name="Location"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedData.Date || ""}
                  onChange={handleChange}
                  name="Date"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>EMD AMOUNT</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedData.EmdAmt || 0}
                  onChange={handleChange}
                  name="EmdAmt"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>TENDER FEES</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedData.TenderFees || 0}
                  onChange={handleChange}
                  name="TenderFees"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>PROCESSING FEES</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedData.ProcessingFees || 0}
                  onChange={handleChange}
                  name="ProcessingFees"
                />
              </Form.Group>

            
            </Form>
          )}
        </Modal.Body>
        

        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>

          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PageList_TenderMaster;
