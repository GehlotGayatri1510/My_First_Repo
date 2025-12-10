import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as OTPAuth from "otpauth";
import { API_WEB_URLS } from '../../constants/constAPI';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Fn_AddEditData } from '../../store/Functions';
import { Fn_GetReport } from '../../store/Functions';

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isQrScanned, setIsQrScanned] = useState(true);
  const inputRefs = useRef([]);
  const[state,setState]=useState({
    SecretKey: '',
    IsGoogleQrScanned: false,
    uId: '',
    loading: false
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_URL_Update = `${API_WEB_URLS.OtpMaster}/0/token`; 
   //const API_URL_TenderRun = `${API_WEB_URLS.MoveTenderFileRunToHold_1}/0/token`; 
 

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    setIsQrScanned(!!authUser.IsGoogleQrScanned);

    if (!authUser.IsGoogleQrScanned || !authUser.SecretKey) {
      const secret = new OTPAuth.Secret();
      let totp = new OTPAuth.TOTP({
        issuer: "Shinewell",
        label: authUser.Username || "user@example.com",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret
      });
      
      setQrCodeData(totp.toString());
      
      // Store the base32 secret
      const secretBase32 = secret.base32;
      localStorage.setItem('authUser', JSON.stringify({
        ...authUser,
        SecretKey: secret,
        SecretKeyBase32: secretBase32
      }));
    }
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3rem',
      maxWidth: '500px',
      margin: '2rem auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    },
    title: {
      marginBottom: '1rem',
      color: '#1a1a1a',
      fontSize: '2rem',
      fontWeight: '600',
    },
    subtitle: {
      color: '#666',
      marginBottom: '1.5rem',
      textAlign: 'center',
      lineHeight: '1.5',
    },
    inputGroup: {
      display: 'flex',
      gap: '12px',
      margin: '2rem 0',
    },
    input: {
      width: '50px',
      height: '50px',
      border: '2px solid #e1e1e1',
      borderRadius: '12px',
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: '600',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#f8f9fa',
    },
    button: {
      padding: '12px 32px',
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(79, 70, 229, 0.1)',
    },
    qrContainer: {
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      marginBottom: '2rem',
    },
    secretKeyContainer: {
      marginBottom: '2rem',
      textAlign: 'center',
      padding: '1rem',
    },
    secretKeyBox: {
      display: 'block',
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      fontSize: '1.1rem',
      letterSpacing: '1px',
      userSelect: 'all',
      border: '2px dashed #e1e1e1',
      marginTop: '1rem',
      fontFamily: 'monospace',
    }
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((value, index) => {
        if (index < 6) newOtp[index] = value;
      });
      setOtp(newOtp);
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
      
      // Create a new TOTP using the stored SecretKeyBase32
      let totp;
      try {
        // First try with SecretKeyBase32
        if (authUser.SecretKeyBase32) {
          totp = new OTPAuth.TOTP({
            issuer: "Shinewell",
            label: authUser.Username || "user@example.com",
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: authUser.SecretKeyBase32
          });
        } 
        // Fallback to SecretKey if SecretKeyBase32 is not available
        else if (authUser.SecretKey) {
          totp = new OTPAuth.TOTP({
            issuer: "Shinewell",
            label: authUser.Username || "user@example.com",
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: authUser.SecretKey
          });
        } else {
          throw new Error('No valid secret key found');
        }

        const isValid = totp.validate({ token: otpString, window: 1 }) !== null;

        if (isValid) {
          // Update local storage with IsGoogleQrScanned flag
          const updatedAuthUser = {
            ...authUser,
            IsGoogleQrScanned: true
          };
          localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
          localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
          alert('OTP verified successfully!');
           
          navigate('/dashboard');
        } else {
          alert('Invalid OTP!');
        }
      } catch (error) {
        console.error('Error validating OTP:', error);
        alert('Error validating OTP. Please try again.');
      }
    } else {
      alert('Please enter a complete OTP');
    }
  };

  // const handleQrScanned = () => {
  //   const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  //   const secretKey = authUser.SecretKey;
  //   const secretKeyBase32 = authUser.SecretKeyBase32;
    
  //   localStorage.setItem('authUser', JSON.stringify({
  //     ...authUser,
  //     IsGoogleQrScanned: true,
  //     SecretKey: secretKey,
  //     SecretKeyBase32: secretKeyBase32
  //   }));
  //   setIsQrScanned(true);
  // };


 

  const handleQrScanned = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
      const secretKey = authUser.SecretKey;
      const secretKeyBase32 = authUser.SecretKeyBase32;

      let formData = new FormData();
      formData.append("SecretKey", secretKeyBase32);
      formData.append("IsGoogleQrScanned", true);
      formData.append("uId", authUser.Id);

      const response = await Fn_AddEditData(
        dispatch,
        setState,
        { arguList: { id: 0, formData: formData } },
        API_URL_Update,
        true,
        "OtpMaster",
        navigate,
        "#"
      );

      if (!response || response.error) {
        throw new Error(response?.message || 'Failed to update QR scan status');
      }

      setState(prev => ({
        ...prev,
        SecretKey: secretKey,
        IsGoogleQrScanned: true,
        loading: false
      }));

      localStorage.setItem('authUser', JSON.stringify({
        ...authUser,
        IsGoogleQrScanned: true,
        SecretKey: secretKey,
        SecretKeyBase32: secretKeyBase32
      }));
      
      setIsQrScanned(true);
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      console.error('Error updating QR scan status:', error);
      alert('Failed to update QR scan status. Please try again.');
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Authentication</h2>
      
      {!isQrScanned ? (
        <>
          <p style={styles.subtitle}>Scan this QR code with Google Authenticator</p>
          <div style={styles.qrContainer}>
            <QRCodeSVG value={qrCodeData} size={200} />
          </div>
          <div style={styles.secretKeyContainer}>
            <p style={{ 
              marginBottom: '0.5rem',
              color: '#666',
              fontSize: '0.95rem' 
            }}>
              If you can't scan the QR code, enter this secret key manually:
            </p>
            <code style={styles.secretKeyBox}>
              {JSON.parse(localStorage.getItem('authUser'))?.SecretKeyBase32 || ''}
            </code>
          </div>
          <button 
            style={styles.button} 
            onClick={handleQrScanned}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
          >
            I have scanned the QR code
          </button>
        </>
      ) : (
        <>
          <p style={styles.subtitle}>Enter the 6-digit code from Google Authenticator</p>
          <div style={styles.inputGroup}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(ref) => (inputRefs.current[index] = ref)}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                style={{
                  ...styles.input,
                  borderColor: digit ? '#4f46e5' : '#e1e1e1',
                  backgroundColor: digit ? '#fff' : '#f8f9fa',
                }}
              />
            ))}
          </div>

          <button 
            style={styles.button} 
            onClick={handleVerify}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default OtpScreen;
