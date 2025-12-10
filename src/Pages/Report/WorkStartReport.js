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
import { Fn_FillListData, Fn_DeleteData } from "../../store/Functions";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";


//EMD 1 Report
const WorkStartReport = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const breadCrumbTitle = "BID AWARDED REPORT";
  const breadcrumbItem = "BID AWARDED REPORT";
  const API_URL = API_WEB_URLS.MASTER + "/0/token/BidAwardedMaster";

  const [state, setState] = useState({
      id: 0,
      FillArray: [],
      formData: {},
      OtherDataScore: [],
      isProgress: true,
    })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
       Fn_FillListData(dispatch, setGridData, "gridData", API_URL + "/Id/0");
      setLoading(false);
    };

    fetchData();
  }, [dispatch, API_URL]);

    const data = useMemo(() => gridData || [], [gridData]);

  const columns = useMemo(
     () => [
       {
         Header: "Sr No",
         accessor: (row, i) => i + 1,
         disableSortBy: true,
       },
       {
        Header: "EMD GRN No",
        accessor: "EMD_GRN_No",

      }, 
       {
        Header: "Date",
        accessor: "Date",
      },
      {
        Header: "WorkStartDate",
        accessor: "WorkStartDate",
      }, 
       {
         Header: "TimePeriod",
         accessor: "TimePeriod",
       },
        
      //  {
      //   Header: "TimePeriod",
      //   accessor: "TimePeriod",
      //   Cell: ({ value }) => {
      //     if (!value || isNaN(value)) return "N/A";
      
      //     const hours = Math.floor(value / 3600);
      //     const minutes = Math.floor((value % 3600) / 60);
      //     const seconds = value % 60;
      
      //     return `${hours}h ${minutes}m ${seconds}s`;
      //   },
      // },
      
       {
         Header: "EMDAmt",
         accessor: "EMDAmt",
       },
       {
         Header: "TenderAmount",
         accessor: "TenderAmount",
       },
       {
         Header: "ProcessingFees",
         accessor: "ProcessingFees",
       },
       {
         Header: "TenderFees",
         accessor: "TenderFees",
       },
       {
        Header: "EMDReceipt",
              accessor: "EMDReceipt",
              Cell: ({ value }) => (
                value ? <a href={`${API_WEB_URLS.IMAGEURL}${value}`} target="_blank" rel="noopener noreferrer">Download</a> : "No File"
              ),
            },
       {
         Header: "Office",
         accessor: "Office",
       },{
         Header: "Location",
         accessor: "Location",
       },{
        Header: "Percentage",
        accessor: "Percentage",
        Cell: ({ value }) => (value ? `${value}%` : "N/A"), 
      }, 
      
       {
         Header: "IsBidAward",
         accessor: "IsBidAward",
         Cell: ({ value }) => (
           <span style={{ color: value === 1 ? "green" : "red", fontWeight: "bold" }}>
             {value === 1 ? "Bid Award(Yes)" : "Not Award"}
           </span>
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
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="page-content">
    <Container fluid={true}>
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
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
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
          <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {">>"}
          </Button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
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
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default WorkStartReport;
