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
import { Fn_FillListData } from "../../store/Functions";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const EMDReport = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const breadCrumbTitle = "EMD Report";
  const breadcrumbItem = "EMD Report";
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/EMDReport`;

  // fetch
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

  // make sure it's always an array
  const data = useMemo(() => (Array.isArray(gridData) ? gridData : []), [
    gridData,
  ]);

  // compute totals for the three columns
  const totalEMDAmount = useMemo(
    () =>
      data.reduce(
        (sum, row) => sum + (parseFloat(row["EMD Amount"]) || 0),
        0
      ),
    [data]
  );
  const totalTenderFees = useMemo(
    () =>
      data.reduce(
        (sum, row) => sum + (parseFloat(row["Tender Fees"]) || 0),
        0
      ),
    [data]
  );
  const totalProcessingFees = useMemo(
    () =>
      data.reduce(
        (sum, row) => sum + (parseFloat(row["Processing Fees"]) || 0),
        0
      ),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (_row, i) => i + 1,
        disableSortBy: true,
      },
      {
        Header: "IsEMDReceived ?",
        accessor: "IsEMDReceived",
        Cell: ({ value }) => (
          <span
            style={{
              color: value === true ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {value === true ? "Received" : "Not Received"}
          </span>
        ),
      },
      { Header: "EMD GRN No.", accessor: "EMD_GRN_No" },
      { Header: "Office Name", accessor: "Office" },
      { Header: "Tender Name", accessor: "Tender Name" },
      { Header: "EMD Amount", accessor: "EMD Amount" },
      { Header: "Tender Fees", accessor: "Tender Fees" },
      { Header: "Processing Fees", accessor: "Processing Fees" },
      { Header: "Date", accessor: "Date" },
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

          <tfoot>
            <tr>
              <td colSpan={5} style={{ fontWeight: "bold" }}>
                Total
              </td>
              <td style={{ fontWeight: "bold" }}>
                {totalEMDAmount.toFixed(2)}
              </td>
              <td style={{ fontWeight: "bold" }}>
                {totalTenderFees.toFixed(2)}
              </td>
              <td style={{ fontWeight: "bold" }}>
                {totalProcessingFees.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
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
            </span>{" "}
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
    </div>
  );
};

export default EMDReport;
