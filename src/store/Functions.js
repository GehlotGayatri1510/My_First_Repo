// functions.js
import toastr from "toastr";
import "toastr/build/toastr.css";
import { callAdd_Data_Multipart,  callAdd_Data, callEdit_Data, callDelete_Data, callEdit_Data_Multipart, callFill_GridData, callGet_Data } from './common-actions';

export const Fn_FillListData = async (dispatch, setState, gridName, apiURL, setKey, setSearchKeyArray) => {
    return new Promise((resolve, reject) => {
        const request = {
            apiURL: apiURL,
            callback: (response) => {
                if (response && response.status === 200 && response.data) {
                    const dataList = response.data.dataList;
                    if (gridName == "gridDataSearch") {
                        const firstObject = response.data.dataList[0];
                        const keysArray = Object.keys(firstObject).filter((item) => item !== 'Id');
                        setSearchKeyArray(keysArray);
                        setState(response.data.dataList);
                        setKey(keysArray[0]);
                    } else if (gridName === "productData" || gridName === "OtherDataScore") {
                        setState(prevState => ({
                            ...prevState,
                            [gridName]: dataList,
                            rows: [Object.keys(dataList[0])],
                            isProgress: false
                        }));
                    } else if (gridName === 'gridData') {
                        setState(dataList);
                    } else if (gridName === 'FileNo') {
                        setState(prevState => ({
                            ...prevState,
                            ['FileNo']: response.data.dataList[0].FileNo
                        }));
                    } else {
                        setState(prevState => ({
                            ...prevState,
                            [gridName]: dataList,
                            isProgress: false
                        }));
                    }
                    showToastWithCloseButton("success", "Data loaded successfully");
                    resolve(response.data.dataList); // Resolve the promise with the data
                } else {
                    showToastWithCloseButton("error", "Error loading data");
                    reject(new Error("Error loading data")); // Reject the promise with an error
                }
            }
        };
        dispatch(callFill_GridData(request));
    });
};

export const Fn_DeleteData = (dispatch, setState, id, apiURL, apiURL_Display) => {
    return new Promise((resolve, reject) => {
      const request = {
        id: id,
        apiURL: apiURL,
        callback: response => {
          if (response && response.status === 200) {
            setState(prevState => ({
              ...prevState,
              confirm_alert: false,
              success_dlg: true,
              dynamic_title: "Deleted",
              dynamic_description: "Selected data has been deleted.",
            }));
            showToastWithCloseButton("success", "Data deleted successfully");
  
            // If apiURL_Display is provided, refresh the list
            if (apiURL_Display) {
            //   Fn_FillListData(dispatch, setState, "gridData", apiURL_Display);
            
            window.location.reload();
            }
  
            resolve(response); // Resolve the Promise with the response
          } else {
            setState(prevState => ({
              ...prevState,
              confirm_alert: false,
              dynamic_title: "Error",
              dynamic_description: "Some error occurred while deleting data.",
            }));
            showToastWithCloseButton(
              "error",
              "Some error occurred while deleting data"
            );
            reject(new Error("Error deleting data")); // Reject the Promise with an error
          }
        },
      };
  
      // Dispatch the delete action
      dispatch(callDelete_Data(request));
    });
  };


  export const Fn_DisplayData = (dispatch, setState, id, apiURL, gridname) => {
    return new Promise((resolve, reject) => {
        const request = {
            id: id,
            apiURL: apiURL,
            callback: response => {
                if (response && response.status === 200 && response.data) {
                    setState(prevState => ({
                        ...prevState,
                        formData: response.data.dataList[0],
                    }));
                    showToastWithCloseButton("success", "Data displayed successfully");
                    resolve(response.data.dataList[0]); // Resolve with data
                } else {
                    showToastWithCloseButton("error", "Error displaying data");
                    reject(new Error("Error displaying data")); // Reject on error
                }
            },
        };

        dispatch(callGet_Data(request));
    });
};


export const Fn_AddEditData = (
    dispatch,
    setState,
    data,
    apiURL,
    isMultiPart = false,
    getid,
    navigate,
    forward
) => {
    console.log('in function')
    return new Promise((resolve, reject) => {
        const { arguList } = data;
        const request = {
            arguList: arguList,
            apiURL: apiURL,
            callback: response => {
                if (response && response.status === 200) {
                    console.log('arguList',arguList);
                    if (getid === 'certificate') {
                        if (response.data.response[0].Id > 0) {
                            setState(response.data.response[0].RegNo);
                            showToastWithCloseButton("success", "File downloaded successfully");
                        } else {
                            showToastWithCloseButton("error", "Duplicate mobile number");
                        }
                    }else if(response.data.response && response.data.response[0].Id>0){
                       setState(true);
                        localStorage.setItem("authUser", JSON.stringify(response.data.response[0]));
                        
                    }else if(getid=='TenderH'){
                    
                        
                        setState(prevState => ({
                            ...prevState,
                            F_TenderFileMasterH : response.data.data.id
                        }));
                        
                    }
                    
                    if (arguList.id === 0 ) {
                        
                        showToastWithCloseButton("success", "Data added successfully");
                        resolve('Data added successfully');
                        navigate(forward, { state: { Id: 0 } });
                    }  else {
                        navigate(forward, { state: { Id: 0 } });
                        showToastWithCloseButton("success", "Data updated successfully");
                        resolve('Data updated successfully');
                    }
                } else {
                    if (arguList.id === 0) {
                        showToastWithCloseButton("error", "Error adding data");
                        reject('Some error occurred while adding data');
                    } else {
                        showToastWithCloseButton("error", "Error updating data");
                        reject('Some error occurred while updating data');
                    }
                }
            },
        };

        if (arguList.id === 0) {
            if (isMultiPart) dispatch(callAdd_Data_Multipart(request));
            else callAdd_Data(request);
        } else {
            if (isMultiPart) dispatch(callEdit_Data_Multipart(request));
            else callEdit_Data(request);
        }
    });
};

export const Fn_GetReport = (dispatch, setState, gridName, apiURL, data, isMultiPart = false) => {
    const { arguList } = data;
    const request = {
        arguList: arguList,
        apiURL: apiURL,
        callback: (response) => {
            if (response && response.status === 200 && response.data) {
                const responseData = response.data.response;
                if (gridName === "productData" || gridName === "productDataAssest") {
                    setState(prevState => ({
                        ...prevState,
                        [gridName]: responseData,
                        rows: [Object.keys(responseData[0])],
                        isProgress: false
                    }));
                } else if(gridName=='tenderData'){
                    setState(responseData);
                }
                else {
                   
                    setState(prevState => ({
                        ...prevState,
                        [gridName]: responseData,
                        isProgress: false
                    }));
                }
               
                showToastWithCloseButton("success", "Report generated successfully");
            } else {
                showToastWithCloseButton("warning", "Data not found");
            }
        }
    };
    dispatch(callAdd_Data_Multipart(request));
};

export function showToastWithCloseButton(toastType, message) {
    toastr.options = {
        closeButton: true,
        preventDuplicates: true,
        newestOnTop: true,
        progressBar: true,
        timeOut: 2000,
    };

    if (toastType === "success") {
        toastr.success(message);
    } else if (toastType === "error") {
        toastr.error(message);
    } else if (toastType === "warning") {
        toastr.warning(message);
    }
}
