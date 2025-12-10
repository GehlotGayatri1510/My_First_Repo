import React from "react";
import PropTypes from "prop-types";


import SidebarContent from "./SidebarContent";

// import Img
import logo from "../../assets/images/logo-sm.svg";

// MetisMenu
import withRouter from "../../components/Common/withRouter";
import { Link } from "react-router-dom";

//redux
import { useDispatch } from "react-redux";
import { changeSidebarType } from '../../store/actions';
import { leftSidebarTypes } from '../../constants/layout';

//i18n
import { withTranslation } from "react-i18next";

const Sidebar = (props) => {

    const dispatch = useDispatch();

    function tToggle() {
        var body = document.body;
        if (window.screen.width <= 998) {
          body.classList.toggle("sidebar-enable");
        } else {
          body.classList.toggle("vertical-collpsed");
          body.classList.toggle("sidebar-enable");
          dispatch(changeSidebarType(leftSidebarTypes.ICON ))
        }
      }

    return (
        <React.Fragment>
            <div className="vertical-menu">
                <div className="navbar-brand-box">
                    <Link to="/dashboard" className="logo logo-dark">
                        {/* <span className="logo-sm">
                            <img src={logo} alt="" height="50" />
                        </span> */}
                        <span className="logo-lg" style={{ display: 'flex', alignItems: 'center',  marginLeft: '-20px', marginTop: '10px' }}>
                            <img src={logo} alt="Logo" height="40" />
                            <span style={{ 
                                color: 'black', 
                                marginLeft: '10px', 
                                fontSize: '16px', 
                                fontWeight: 'bold',
                                lineHeight: '1.2'
                            }}>
                                SHIVARK INFRA ENGINEERING PVT. LTD.
                            </span>
                        </span>
                    </Link>
                    <Link to="/" className="logo logo-light">
                        {/* <span className="logo-sm">
                            <img src={logo} alt="Logo" height="50" />
                        </span> */}
                        <span className="logo-lg" style={{ display: 'flex', alignItems: 'center',  marginLeft: '-20px', marginTop: '10px' }}>
                            <img src={logo} alt="Logo" height="40" />
                            <span style={{ 
                                color: 'black', 
                                marginLeft: '10px', 
                                fontSize: '16px', 
                                fontWeight: 'bold',
                                lineHeight: '1.2'
                            }}>
                                SHIVARK INFRA ENGINEERING PVT. LTD.
                            </span>
                        </span>
                    </Link>
                </div>
                <button
                    type="button"
                    className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
                    onClick={() => {
                        tToggle();
                      }}
                >
                    <i className="fa fa-fw fa-bars"></i>
                </button>
                    {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
            </div>
        </React.Fragment>
    )
}

Sidebar.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default (withRouter(withTranslation()(Sidebar)));