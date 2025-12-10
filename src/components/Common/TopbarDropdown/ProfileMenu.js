import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

import withRouter from "../../../components/Common/withRouter";

// users
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item user text-start d-flex align-items-center"
          id="page-header-user-dropdown"
          tag="button"
          data-bs-toggle="dropdown"
          aria-haspopup={true}
          aria-expanded={false}
        >
          <img
            className="rounded-circle header-profile-user"
            src={avatar1}
            alt="Header Avatar"
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end pt-0">
          {/* <DropdownItem tag="a" href="/userprofile">
            {" "}
            <i className="bx bx-user-circle text-muted font-size-18 align-middle me-1" />
            <span className="align-middle">{props.t("My Account")} </span>
          </DropdownItem> */}
          
          {/* <DropdownItem tag="a" href="#">
            <i className="bx bx-chat text-muted font-size-18 align-middle me-1" />
            <span className="align-middle">{props.t("Chat")}</span>
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <i className="bx bx-buoy text-muted font-size-18 align-middle me-1" />
            <span className="align-middle">{props.t("Support")}</span>
          </DropdownItem>
          <div className="dropdown-divider"></div>
          <DropdownItem tag="a" href="#">
            <i className="bx bx-lock text-muted font-size-18 align-middle me-1" />
            <span className="align-middle">{props.t("Lock screen")}</span>
          </DropdownItem> */}
          <DropdownItem tag="a" href="/logout">
            <i className="bx bx-log-out text-muted font-size-18 align-middle me-1" />
            <span className="align-middle">{props.t("Logout")}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(ProfileMenu));
