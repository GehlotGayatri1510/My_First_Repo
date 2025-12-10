import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

// import Components
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import RightSidebar from '../../components/Common/RightSideBar';

//redux
import { useSelector, useDispatch } from "react-redux";

import {
  changeLayout,
  changeTheme,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../store/actions";
import { createSelector } from 'reselect';

const Layout = props => {
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      layoutWidth: layout.layoutWidth,
      leftSideBarType: layout.leftSideBarType,
      showRightSidebar: layout.showRightSidebar,
      leftSideBarTheme: layout.leftSideBarTheme,
      topbarTheme: layout.topbarTheme,
      themeMode: layout.themeMode,
    })
  );

  const {
    leftSideBarType,
    layoutWidth,
    showRightSidebar,
    leftSideBarTheme,
    topbarTheme,
    themeMode
  } = useSelector(selectLayoutProperties)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(changeLayout("vertical"));
    dispatch(changeTheme(themeMode))
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
  }, [leftSideBarType, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  return (
    <React.Fragment>

      <div id="layout-wrapper">
        <Header toggleMenuCallback={toggleMenuCallback}
          themeMode={themeMode} />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">{props.children}</div>
        <Footer />
      </div>
      {showRightSidebar ? <RightSidebar /> : <RightSidebar />}
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
};

export default withRouter(Layout);
