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
} from "../../store/Functions";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Modal } from "react-bootstrap";


const LabourPaymentReport = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  const breadCrumbTitle = "Labour Payment Report";
  const breadcrumbItem = "Labour Payment Report";
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/LabourNameMaster`;
  const API_URL1 = `${API_WEB_URLS.MASTER}/0/token/LabourPaymentReport`;
  
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

  const btnOpenOnClick = async (rowId) => {
    await Fn_FillListData(
      dispatch,
      setState,
      "FillArray",
      `${API_URL1}/Id/${rowId}`
    );
    setState((prev) => ({
      ...prev,
      id: rowId,
    }));
    setShowModal(true);
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
      
      { Header: "Labour Name", accessor: "Labour" },
      
       {
              Header: "Labour Payment",
              Cell: ({ row }) => (
                  <Button
                  variant="primary"
                  size="sm"
                  onClick={() => btnOpenOnClick(row.original.Id)}
                >
                  Open
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
  <Modal.Title>Labour Details</Modal.Title>
</Modal.Header>
<Modal.Body>
  {state.FillArray.length > 0 ? (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sr No.</th>
            {/* <th>Name</th> */}
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {state.FillArray.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {/* <td>{item.Name || "N/A"}</td> */}
              <td>{item.Amount || "0"}</td>
              <td>{item.Date || "N/A"}</td>
            </tr>
          ))}
          {/* Total Row */}
          <tr>
            <td colSpan="2"><strong>Total</strong></td>
            <td>
              <strong>
                {
                  state.FillArray.reduce(
                    (acc, item) => acc + (parseFloat(item.Amount) || 0),
                    0
                  )
                }
              </strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <p>No Labour Data Found</p>
  )}
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={() => setShowModal(false)}>
    Close
  </Button>
</Modal.Footer>
</Modal>


    </div>
  );
};

export default LabourPaymentReport;
