
import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, FormControl, Table, Spinner } from "react-bootstrap";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { API_WEB_URLS } from "../../constants/constAPI";
import { useDispatch } from "react-redux";
import { Fn_FillListData, Fn_DeleteData } from "../../store/Functions";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PageList_UserMaster = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({
    id: 0,
    FillArray: [],
    formData: {},
    OtherDataScore: [],
    isProgress: true,
  })

  const breadCrumbTitle = "User Master";
  const breadcrumbItem = "User Master";
  const rtPage_Add = "/AddUser";
  const rtPage_Edit = "/EditUser";
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/UserMaster`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Fn_FillListData(dispatch, setGridData, "gridData", `${API_URL}/Id/0`);
      setLoading(false);
    };
    fetchData();
  }, [dispatch, API_URL]);

  const btnAddOnClick = () => navigate(rtPage_Add, { state: { Id: 0 } });
  const btnEditOnClick = (Id) => navigate(rtPage_Edit, { state: { Id } });
  // const btnDeleteOnClick = (Id) => {
  //   Fn_DeleteData(dispatch, setState, Id, `${API_URL}`, true)
  // };

  const data = useMemo(() => (Array.isArray(gridData) ? gridData : []), [gridData]);

  const columns = useMemo(
    () => [
      { Header: "Sr No", accessor: (row, i) => i + 1 || 0, disableSortBy: true },
      { Header: "Name", accessor: "Name" },
      { Header: "UserName", accessor: "UserName" },
      { Header: "UserPass", accessor: "UserPass" },
      { Header: "UserType", accessor: "UserType" },
     
       {
        Header: "Profile",
        accessor: "ProfileIMG",
        Cell: ({ value }) => (
                  value ? <img src= {`${API_WEB_URLS.IMAGEURL}${value}`} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "5px" }} /> : "No Photo"
                ),
      },
      { Header: "Phone", accessor: "Phone" },
      { Header: "Address", accessor: "Address" },
      { Header: "Email", accessor: "Email" },
      { Header: "State", accessor: "State" },
      { Header: "City", accessor: "City" },
       
      // {
      //   Header: "Edit",
      //   Cell: ({ row }) => (
      //     <Button variant="primary" size="sm" onClick={() => btnEditOnClick(row.original.Id)}>
      //       Edit
      //     </Button>
      //   ),
      // },
      // {
      //         Header: "Delete",
      //         Cell: ({ row }) => (
      //           <Button
      //             variant="danger"
      //             size="sm"
      //             onClick={() => btnDeleteOnClick(row.original.Id)}
      //           >
      //             Delete
      //           </Button>
      //         ),
      //  },
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
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
            <FormControl type="text" placeholder="Search" value={globalFilter || ""} onChange={(e) => setGlobalFilter(e.target.value)} className="mb-2" />
          </Col>
          <Col md="4">
            <Button type="button" onClick={btnAddOnClick} variant="success" className="mb-2">
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
                    {column.render("Header")} {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
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
                  {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render("Cell")}</td>)}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Row className="mt-2">
          <Col>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</Button>{" "}
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"}</Button>{" "}
            <Button onClick={() => nextPage()} disabled={!canNextPage}>{">"}</Button>{" "}
            <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"}</Button>{" "}
            <span>Page <strong>{pageIndex + 1} of {pageOptions.length}</strong></span>
            <span>| Go to page: <input type="number" defaultValue={pageIndex + 1} onChange={(e) => gotoPage(Math.max(0, Number(e.target.value) - 1))} style={{ width: "100px" }} /></span>{" "}
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[10, 20, 30, 40, 50].map((size) => <option key={size} value={size}>Show {size}</option>)}
            </select>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageList_UserMaster;

