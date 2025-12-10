import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { API_WEB_URLS } from '../../constants/constAPI';
import { Fn_FillListData } from '../../store/Functions';

const TableComponent = () => {
  const dispatch = useDispatch();

  const [GridData, setGridData] = useState([]);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  };

  const thStyle = {
    backgroundColor: '#e6f3ff', // Light blue background
    color: '#0066cc', // Dark blue text
    padding: '12px 15px',
    border: 'none',
    textAlign: 'left',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontSize: '13px',
    borderBottom: '2px solid #cce6ff', // Lighter blue border
  };

  const tdStyle = {
    padding: '12px 15px',
    border: 'none',
    textAlign: 'left',
    borderBottom: '1px solid #e6f3ff', // Light blue border
    color: '#333333', // Dark text for better readability
  };

  const trStyle = {
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
  };

  const trHoverStyle = {
    backgroundColor: '#f0f7ff', // Very light blue hover
  };

  const containerStyle = {
    overflowX: 'auto',
    margin: '20px 0',
    padding: '0 15px',
  };

  const API_URL = `${API_WEB_URLS.MASTER}/0/token/ActiveTenderMaster`;

  useEffect(() => {
    Fn_FillListData(
      dispatch,
      setGridData,
      "gridData",
      `${API_URL}/Id/0`
    );
  }, [dispatch, API_URL]);

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>S. No</th>
            <th style={thStyle}>Tender Name</th>
          </tr>
        </thead>
        <tbody>
          {GridData.length > 0 ? (
            GridData.map((row, index) => (
              <tr 
                key={index} 
                style={trStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, trHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, trStyle)}
              >
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{row.Tender}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={{...tdStyle, textAlign: 'center', color: '#6c757d'}} colSpan="2">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
