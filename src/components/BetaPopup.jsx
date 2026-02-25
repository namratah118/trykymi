import { useState, useEffect } from "react";

export default function BetaPopup() {

  const [show, setShow] = useState(false);

  useEffect(() => {

    const seen = localStorage.getItem("trykymi_beta_seen");

    if (!seen) {
      setShow(true);
    }

  }, []);

  const closePopup = () => {

    localStorage.setItem("trykymi_beta_seen", "true");

    setShow(false);

  };

  if (!show) return null;

  return (

    <div style={overlayStyle}>

      <div style={popupStyle}>

        <h3 style={{marginBottom:"10px"}}>Welcome to TryKymi Beta</h3>

        <p style={{fontSize:"14px", marginBottom:"20px"}}>

          TryKymi is currently in Beta. Some features may improve soon.

          Your feedback helps shape the future.

        </p>

        <button style={buttonStyle} onClick={closePopup}>

          Continue

        </button>

      </div>

    </div>

  );

}

const overlayStyle = {

  position: "fixed",

  top: 0,

  left: 0,

  width: "100%",

  height: "100%",

  background: "rgba(0,0,0,0.4)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  zIndex: 9999

};

const popupStyle = {

  background: "#F7F4D5",

  padding: "30px",

  borderRadius: "12px",

  textAlign: "center",

  maxWidth: "300px",

  color: "#0A3323"

};

const buttonStyle = {

  background: "#0A3323",

  color: "#fff",

  border: "none",

  padding: "10px 20px",

  borderRadius: "6px",

  cursor: "pointer"

};
