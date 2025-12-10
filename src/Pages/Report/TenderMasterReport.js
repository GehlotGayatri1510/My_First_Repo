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


//EMD 2 REPORT(Yes)
const TenderMasterReport = () => {
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

  const breadCrumbTitle = "Tender Master Report";
  const breadcrumbItem = "Tender Master Report";
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/TenderReport`;
  
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

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, i) => i + 1 || 0,
        disableSortBy: true,
      },
      
      { Header: "TenderID", accessor: "TenderID" },
      { Header: "tenderName", accessor: "TenderName" },
      { Header: "EmdAmt", accessor: "EmdAmt" },
      { Header: "ProcessingFees", accessor: "ProcessingFees" },
      { Header: "TenderFees", accessor: "TenderFees" },
      { Header: "TotalAmount", accessor: "TotalAmount" },
      
       
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

      
    </div>
  );
};

export default TenderMasterReport;
