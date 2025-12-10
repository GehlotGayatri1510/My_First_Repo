const SidebarData = [
  {
    label: "Menu",
    isMainMenu: true,
  },
  {
    label: "DASHBOARD",
    icon: "bx bx-home-circle icon nav-icon text-dark",
    issubMenubadge: true,
    url: "/dashboard"
  }, 
   
  {
    label: "Pages", 
    isMainMenu: true,
  },
 
  {
    label: "MASTERS",
    icon: "bx bx-cog icon nav-icon",
    subItem: [ 
      { sublabel: "City Master", link: "/CityMaster" },
      { sublabel: "Labour Master", link: "/LabourMaster" },
      { sublabel: "Tender Master", link: "/TenderMaster" },
      { sublabel: "User Master", link: "/UserMaster" }, 
      { sublabel: "Vendor Master", link: "/VendorMaster" },   
    ],
  },

  {
    label: "OTHER/DOCUMENT",
    icon: "bx bx-file icon nav-icon",
    subItem: [ 
      { sublabel: "Uploads Master", link: "/UploadsMaster" },  
    ],
  },

  {
    label: "PAYMENT REPORT",
    icon: "bx bx-money icon nav-icon",
    subItem: [ 
      { sublabel: "LABOUR PAYMENT REPORT", link: "/LabourPaymentReport" },         
      { sublabel: "NOT-RECEIVED EMD REPORT", link: "/EMDReport" },    
      { sublabel: "PAYMENT REPORT", link: "/PaymentReport" },    
      { sublabel: "RECEIVED EMD REPORT", link: "/ReceivedEMDReport" },        
      { sublabel: "VENDOR PAYMENT REPORT", link: "/VendorPaymentReport" },    
    ],
  },

  {
    label: "REPORT",
    icon: "bx bx-bar-chart-alt-2 icon nav-icon",
    subItem: [ 
      { sublabel: "BID AWARD REPORT", link: "/WorkStartReport" },    
      { sublabel: "EMD FORM", link: "/EMDForm" },    
      { sublabel: "LABOUR REPORT", link: "/LabourReport" },    
      { sublabel: "TENDER REPORT", link: "/TenderMasterReport" },    
      { sublabel: "VENDOR REPORT", link: "/VendorReport" },    
    ],
  },

  

];

export default SidebarData;
