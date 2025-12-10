import React from 'react';
import { Navigate } from "react-router-dom";

// DashBoard
import Dashboard from '../Pages/Dashboard/Index';

// Import Authentication pages
import Login from "../Pages/Authentication/Login";
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";
import UserProfile from "../Pages/Authentication/user-profile";
import OtpScreen from '../Pages/Authentication/OtpScreen'
import PageList_CityMaster from '../Pages/Masters/PageList_CItyMaster';
import AddEdit_CityMaster from '../Pages/Masters/AddEdit_CityMaster';
import AddEdit_EMDMaster from '../Pages/Masters/AddEdit_EMDMaster';
import PageList_EMDMaster from '../Pages/Masters/PageList_EMDMaster';
import AddEdit_LabourMaster from '../Pages/Masters/AddEdit_LabourMaster';
import PageList_LabourMaster from '../Pages/Masters/PageList_LabourMaster';
import AddEdit_TenderMaster from '../Pages/Masters/AddEdit_TenderMaster';
import AddEdit_VendorMaster from '../Pages/Masters/AddEdit_VendorMaster';
import PageList_TenderMaster from '../Pages/Masters/PageList_TenderMaster';
import PageList_VendorMaster from '../Pages/Masters/PageList_VendorMaster';
import AddEdit_UserMaster from '../Pages/Masters/AddEdit_UserMaster';
import PageList_UserMaster from '../Pages/Masters/PageList_UserMaster';
import AddEdit_StateMaster from '../Pages/Masters/AddEdit_StateMaster';
import PageList_StateMaster from '../Pages/Masters/PageList_StateMaster';
import AddEdit_DealsMaster from '../Pages/Masters/AddEdit_DealsMaster';
import PageList_DealsMaster from '../Pages/Masters/PageList_DealsMaster';
import PaymentStatusSearch from '../Pages/Payment/PaymentStatusSearch';
import EMDForm from '../Pages/Masters/EMDForm';
import WorkStartReport from '../Pages/Report/WorkStartReport';
import TenderMasterReport from '../Pages/Report/TenderMasterReport';
import PaymentReport from '../Pages/Report/PaymentReport';
import PageList_Uploads from '../Pages/Masters/PageList_Uploads';
import AddEdit_Uploads from '../Pages/Masters/AddEdit_Uploads';
import VendorReport from '../Pages/Report/VendorReport';
import LabourReport from '../Pages/Report/LabourReport';
import EMDReport from '../Pages/Report/EMDReport';
import ReceivedEMDReport from '../Pages/Report/ReceivedEMDReport';
import LabourPaymentReport from '../Pages/Report/LabourPaymentReport';
import VendorPaymentReport from '../Pages/Report/VendorPaymentReport';
import Header from '../Pages/header/header';

 
const authProtectedRoutes = [

  // dashboard
  { path: "/dashboard", component: <Dashboard /> },
 
  // Profile
  { path: "/userprofile", component: <UserProfile /> },
  { path: "/header", component: <Header /> },
   
  { path: "/AddEMD", component: <AddEdit_EMDMaster/> },
  { path: "/EditEMD", component: <AddEdit_EMDMaster/> },
  { path: "/EMDMaster", component: <PageList_EMDMaster/> },
   
  { path: "/AddCity", component: <AddEdit_CityMaster/> },
  { path: "/EditCity", component: <AddEdit_CityMaster/> },
  { path: "/CityMaster", component: <PageList_CityMaster/> },

  { path: "/AddVendor", component: <AddEdit_VendorMaster/> },
  { path: "/EditVendor", component: <AddEdit_VendorMaster/> },
  { path: "/VendorMaster", component: <PageList_VendorMaster/> },

  { path: "/EditLabour", component: <AddEdit_LabourMaster/> },
  { path: "/AddLabour", component: <AddEdit_LabourMaster/> },
  { path: "/LabourMaster", component: <PageList_LabourMaster /> },

  { path: "/EditTender", component: <AddEdit_TenderMaster/> },
  { path: "/AddTender", component: <AddEdit_TenderMaster/> },
  { path: "/TenderMaster", component: <PageList_TenderMaster /> },

  { path: "/EditUser", component: <AddEdit_UserMaster/> },
  { path: "/AddUser", component: <AddEdit_UserMaster/> },
  { path: "/UserMaster", component: <PageList_UserMaster /> },

  { path: "/EditState", component: <AddEdit_StateMaster/> },
  { path: "/AddState", component: <AddEdit_StateMaster/> },
  { path: "/StateMaster", component: <PageList_StateMaster /> },

  { path: "/EditDeals", component: <AddEdit_DealsMaster/> },
  { path: "/AddDeals", component: <AddEdit_DealsMaster/> },
  { path: "/DealsMaster", component: <PageList_DealsMaster /> },

  { path: "/PaymentSearch", component: <PaymentStatusSearch /> },
  { path: "/EMDForm", component: <EMDForm/> },
  { path: "/WorkStartReport", component: <WorkStartReport/> },
  { path: "/TenderMasterReport", component: <TenderMasterReport/> },
  { path: "/PaymentReport", component: <PaymentReport/> },
  { path: "/VendorReport", component: <VendorReport/> },

  { path: "/UploadsMaster", component: <PageList_Uploads/> },
  { path: "/AddFiles", component: <AddEdit_Uploads/> },
  { path: "/TenderMasterReport", component: <TenderMasterReport/> },
  { path: "/VendorReport", component: <VendorReport/> },
  { path: "/LabourReport", component: <LabourReport/> },
  { path: "/EMDReport", component: <EMDReport/> },
  { path: "/ReceivedEMDReport", component: <ReceivedEMDReport/> },
  { path: "/LabourPaymentReport", component: <LabourPaymentReport/> },
  { path: "/VendorPaymentReport", component: <VendorPaymentReport/> },
  
  
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },

];

const publicRoutes = [

  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/OTP", component: <OtpScreen/> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
