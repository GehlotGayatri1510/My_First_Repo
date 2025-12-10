import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, FormControl, Table, Spinner, Modal, Form } from "react-bootstrap";
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
  Fn_AddEditData,
} from "../../store/Functions";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const VendorReport = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [F_VendorMaster, setF_VendorMaster] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const [state, setState] = useState({
    id: 0,
    Amount: 0,
    VoucherDate: "",
    FillArray: [],
    F_VendorMaster: null,
    formData: {},
    isProgress: true,
    LedgerArray: [],
    LedgerGroupArray: [],
  });

  const API_URL = `${API_WEB_URLS.MASTER}/0/token/VendorMaster`;
  const API_URL_SAVE = `${API_WEB_URLS.VoucherH}/0/token`;

  const breadCrumbTitle = "Vendor Report";
  const breadcrumbItem = "Vendor Report";

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

  const data = useMemo(
    () => (Array.isArray(gridData) ? gridData : []),
    [gridData]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: name === "Amount" ? Number(value) : value, // if Amt, convert to number
    }));
  };

  const handleSave = async ( ) => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    const formData = new FormData();

    formData.append("UserId", obj.Id);
    formData.append("Amount", state.Amount || 0);
    formData.append("VoucherDate", state.VoucherDate || "");
    formData.append("F_VoucherTypeMaster", 9);
    formData.append("F_LedgerMaster", 2);
    formData.append("F_LedgerMasterDr", state.id);
    formData.append("F_LedgerMasterCr", 2);
    formData.append("Narration", 'Vendor');
     formData.append("F_VendorMaster", state.id);

    await Fn_AddEditData(
      dispatch,
      setState,
      { arguList: { id: state.id, formData } },
      API_URL_SAVE,
      true,
      "memberid",
      navigate,
      "/VendorPaymentReport"
    );

    setShowModal(false);
  };

  
  const btnProceedOnClick = (rowId) => {
    setState((prev) => ({
      ...prev,
      id: rowId, // Save the Id when opening modal
      Amount: 0,
      VoucherDate: "",
    }));
    setShowModal(true);
  };
  

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, i) => i + 1,
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Status",
        accessor: "Status",
        Cell: ({ value }) => (
          <span style={{ color: value ? "green" : "red", fontWeight: "bold" }}>
            {value ? "Active" : "Non-Active"}
          </span>
        ),
      },
      {
        Header: "Company Name",
        accessor: "CompanyName",
      },
      {
        Header: "Vendor Type",
        accessor: "VendorType",
      },
      {
        Header: "State",
        accessor: "State",
      },
      {
        Header: "City",
        accessor: "City",
      },
      {
        Header: "Add",
        Cell: ({ row }) => (
          <Button
            variant="primary"
            size="sm"
            onClick={() => btnProceedOnClick(row.original.Id)}
          >
            Add
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
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
        </Row>

        <Table {...getTableProps()} responsive bordered striped>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
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
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
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
            <Button onClick={previousPage} disabled={!canPreviousPage}>
              {"<"}
            </Button>{" "}
            <Button onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>{" "}
            <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
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
          <Modal.Title>Add Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="VoucherDate"
                value={state.VoucherDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="Amount"
                value={state.Amount}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
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

export default VendorReport;
