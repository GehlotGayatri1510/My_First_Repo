import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { useEffect } from 'react';
import { API_WEB_URLS } from '../../constants/constAPI';
import { Fn_FillListData } from '../../store/Functions';

import LanguageDropdown from '../../components/Common/TopbarDropdown/LanguageDropdown';
import NotificationDropdown from '../../components/Common/TopbarDropdown/VerticalNotificationDropdown';

//redux
import { useDispatch } from "react-redux";
import { changeTheme, changeSidebarType, changeTopbarTheme } from '../../store/actions';
import { themeModeTypes, leftSidebarTypes } from '../../constants/layout';

// import Img
import logo from "../../assets/images/logo-sm.svg";
import ProfileMenu from '../../components/Common/TopbarDropdown/ProfileMenu';


const Header = ({ themeMode }) => {
    const mode = themeMode === themeModeTypes['DARK'] ? themeModeTypes['LIGHT'] : themeModeTypes['DARK'];
    const dispatch = useDispatch();
    const [userName, setUserName] = useState("");
    const[state, setState] = useState({
         
        id:0,
        UserArray: [],
    });

    
    const API_URL14 = API_WEB_URLS.MASTER + "/0/token/GetUserMaster";

   
    useEffect(() => {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setUserName(obj.Name || obj.UserName || obj.Id);
        Fn_FillListData(dispatch, setState, "UserArray", API_URL14 + "/Id/" + obj.Id);
      }, [dispatch]);

      //const obj = JSON.parse(localStorage.getItem("authUser"));

    

    function tToggle() {
        var body = document.body;
        if (window.screen.width <= 998) {
            body.classList.toggle("sidebar-enable");
        } else {
            body.classList.toggle("sidebar-enable");
            body.classList.toggle("vertical-collpsed");
            dispatch(changeSidebarType(leftSidebarTypes.DEFAULT))
        }
    }

    return (
        <React.Fragment>
            <header id="page-topbar" className="isvertical-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">

                            <Link to="/" className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src={logo} alt="" height="22" />
                                </span>
                                <span className="logo-lg" style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={logo} alt="" height="40" />
                                    <span style={{ 
                                        color: 'black', 
                                        marginLeft: '10px', 
                                        fontSize: '18px', 
                                        fontWeight: 'bold',
                                        lineHeight: '1.2'
                                    }}>
                                        SHIVARK INFRA ENGINEERING PVT. LTD.
                                    </span>
                                </span>
                            </Link>

                            <Link to="/" className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={logo} alt="" height="22" />
                                </span>
                                <span className="logo-lg" style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={logo} alt="" height="40" />
                                    <span style={{ 
                                        color: 'black', 
                                        marginLeft: '10px', 
                                        fontSize: '18px', 
                                        fontWeight: 'bold',
                                        lineHeight: '1.2'
                                    }}>
                                        SHIVARK INFRA ENGINEERING PVT. LTD.
                                    </span>
                                </span>
                            </Link>

                        </div>

                        <button type="button" className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
                            onClick={() => {
                                tToggle()
                            }}
                        >
                            <i className="fa fa-fw fa-bars"></i>
                        </button>

                        <form className="app-search d-none d-lg-block">
                            <div className="position-relative">
                                {/* <input type="text" className="form-control" placeholder="Search..." />
                                <span className="bx bx-search"></span> */}
                                {/* <h3 style={{ margin: '0' }}>{obj.Name}</h3> */}

                                <h3 style={{ margin: '0' }}>
                                    {state.UserArray && state.UserArray.length > 0 
                                        ? state.UserArray[0].Name 
                                        : userName}
                                </h3>
                            </div>
                        </form>

                    </div>

                    <div className="d-flex">
                        <div className="dropdown d-inline-block d-lg-none">
                            <button type="button" className="btn header-item"
                                aria-haspopup={true} aria-expanded={false}>
                                <i className="icon-sm" data-feather="search"></i>
                                <FeatherIcon icon="search" />
                            </button>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
                                <form className="p-2">
                                    <div className="search-box">
                                        <div className="position-relative">
                                            <input type="text" className="form-control rounded bg-light border-0" placeholder="Search..." />
                                            <i className="mdi mdi-magnify search-icon"></i>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* <LanguageDropdown />
                        <NotificationDropdown /> */}

                          <div className="dropdown d-none d-sm-inline-block">
                            <button onClick={() => {
                                dispatch(changeTheme(mode));
                                dispatch(changeTopbarTheme(mode))
                                
                            }}
                                type="button" className="btn header-item">

                                {themeMode === themeModeTypes['DARK'] ?
                                    <FeatherIcon
                                        icon="moon"
                                        className="icon-sm layout-mode-dark"
                                    />
                                    :
                                    <FeatherIcon
                                        icon="sun"
                                        className="icon-sm layout-mode-light"
                                    />
                                }
                            </button>
                        </div>  
                        <ProfileMenu />
                    </div>
                </div>
            </header>
        </React.Fragment>
    )
}

export default Header;




