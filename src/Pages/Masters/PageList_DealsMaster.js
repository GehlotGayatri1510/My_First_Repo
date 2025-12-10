import React, { useState, useEffect } from "react";
import { API_WEB_URLS } from "../../constants/constAPI";
import { Fn_FillListData, Fn_DeleteData } from "../../store/Functions";
import RCDisplayPage from "../../common/RCDisplayPage";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const PageList_DealsMaster = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [modal, setModal] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState({});
  const [gridData, setGridData] = useState([]);
  const [confirm_alert, setConfirmAlert] = useState(false);
  const [success_dlg, setSuccessDlg] = useState(false);
  const [dynamic_title, setDynamicTitle] = useState("");
  const [dynamic_description, setDynamicDescription] = useState("");
  const [SearchKeyArray, setSearchKeyArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const obj = JSON.parse(localStorage.getItem("authUser"));
  const modalTitle = "Deals Master";
  const rtPage_Add = "/AddDeals";
  const rtPage_Edit = "/EditDeals";
  const API_URL = `${API_WEB_URLS.MASTER}/0/token/DealsMaster`;
  // const API_URL = `${API_WEB_URLS.MASTER}/0/token/DealsMaster`;

  const [state, setState] = useState({
        id: 0,
        FillArray: [],
        formData: {},
        OtherDataScore: [],
        isProgress: true,
      })

  useEffect(() => {
    Fn_FillListData(dispatch, setGridData, "gridDataSearch", `${API_URL}/Id/0`, setSearchKey, setSearchKeyArray);
  }, [dispatch]);

  useEffect(() => {
    setFilteredData([...gridData]);
  }, [gridData]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filteredData = gridData.filter((item) => {
      const searchKeyValue = item[searchKey]?.toLowerCase();
      return searchKeyValue?.includes(searchValue);
    });
    setFilteredData(filteredData);
    setCurrentPage(1);
  };

  const handleSearchKey = (item) => {
    setSearchKey(item);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const btnAdd_onClick = () => {
    navigate(rtPage_Add, { state: { Id: 0 } });
  };

  const btnEdit_onClick = (e, formData) => {
    e.preventDefault();
    navigate(rtPage_Edit, { state: { Id: formData.Id } });
  };

  

  const btnDelete_onClick = (Id) => {
    //  Fn_DeleteData(obj, formData.Id, API_URL, `${API_URL}/Id/0`);
     Fn_DeleteData(dispatch, setState, Id, `${API_URL}`, true)
  };

  const renderGridHeader = () => (
    <>
      <th>Name</th>
    </>
  );

  const renderGridBody = (formData) => (
    <>
      <td>{formData.Name}</td>
    </>
  );

  const renderModalBody = () => (
    <>
      <p className="mb-4"></p>
    </>
  );

  return (
    <div className="page-content">
      <RCDisplayPage
        SearchKeyArray={SearchKeyArray}
        currentPage={currentPage}
        searchKey={searchKey}
        Isbreadcrumb={true}
        breadCrumbTitle={"Deals Master"}
        breadcrumbItem={"Deals Master"}
        obj={obj}
        isSearchBox={true}
        isSNo={false}
        isCheckBox={false}
        isViewDetails={false}
        gridData={filteredData}
        gridHeader={renderGridHeader}
        gridBody={renderGridBody}
        handleSearchKey={handleSearchKey}
        handleSearchChange={handleSearchChange}
        handlePageChange={handlePageChange}
        btnAdd_onClick={btnAdd_onClick}
        btnEdit_onClick={btnEdit_onClick}
         // toggleDeleteConfirm={toggleDeleteConfirm}
        // toggleDeleteSuccess={toggleDeleteSuccess}
        confirm_alert={confirm_alert}
        success_dlg={success_dlg}
        dynamic_title={dynamic_title}
        dynamic_description={dynamic_description}
        btnDelete_onClick={btnDelete_onClick}
        isOpenModal={modal}
        modalTitle={modalTitle}
        selectedFormData={selectedFormData}
        modalBody={renderModalBody}
        isAdd={true}
       // isDelete = {true}
        isEdit = {true}
        // isEdit={obj?.UserType === "Admin"}
        isPagination={true}
      />
    </div>
  );
};

export default PageList_DealsMaster;