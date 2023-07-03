import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
const LoginComponent = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div>
      <a
        href="#login"
        className="header-button"
        onClick={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
      >
        Login
      </a>
      {showModal && (
        <div className="modal" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#5A5857',
            padding: '20px',
            borderRadius: '4px'
          }}>
            <span className="close-btn" style={{
              color: '#EA4717',
              float: 'right',
              fontSize: '28px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }} onClick={() => setShowModal(false)}>&times;</span>
            <form>
              <label htmlFor="username" style={{ color: '#EA4717' }}>Username:</label><br />
              <input type="text" id="username" name="username" onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', margin: '8px 0' }} /><br />
              <label htmlFor="password" style={{ color: '#EA4717' }}>Password:</label><br />
              <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', margin: '8px 0' }} /><br />
              <input type="button" value="Submit" onClick={() => console.log(username, password)} style={{ width: '100%', padding: '12px', backgroundColor: '#EA4717', color: 'white', cursor: 'pointer' }} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderLink = (props) => {
  const [hover, setHover] = React.useState(false);

  const styles = {
    base: {
      float: 'left',
      color: '#EA4717',
      textAlign: 'center',
      padding: '12px',
      textDecoration: 'none',
      fontSize: '18px',
      lineHeight: '25px',
      borderRadius: '4px',
    },
    hover: {
      backgroundColor: '#ddd',
      color: 'grey',
    },
  };

  return (
    <a
      className={props.className}
      href={props.href}
      style={
        hover
          ? { ...styles.base, ...styles.hover }
          : styles.base
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {props.children}
    </a>
  );
};

const Header = () => {
  const styles = {
    header: {
      overflow: 'hidden',
      backgroundColor: '#5A5857',
      padding: '20px 10px',
    },
    logo: {
      float: 'left',
      fontSize: '25px',
      fontWeight: 'bold',
      color:'#EA4717',
    },
    headerRight: {
      float: 'right',
    },
  };

  return (
    <div style={styles.header}>
      <a href="https://github.com/adityaj2003/chessisveryhard" className="logo" style={styles.logo}>ChessIsVeryHard</a>
      <div className="header-right" style={styles.headerRight}>
        <HeaderLink className="active" href="both-colorboard.html">Analysis Board</HeaderLink>
        <HeaderLink href="multiplayer.html">Multiplayer</HeaderLink>
        <HeaderLink href="puzzles.html">Puzzles</HeaderLink>
        <HeaderLink>
          <LoginComponent />
        </HeaderLink>
      </div>
    </div>
  );
}
const root = createRoot(document.getElementById('header'))
root.render(<Header />);
export default Header;

