// // frontend/src/components/Footer.jsx
// import React from "react";
// import "./Footer.css"; // We’ll use minimal CSS here since most colors come from variables

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="footer-links">
//         {/* <a href="#home">Home</a> */}
//         <a href="#products">Cakes</a>
//         <a href="#about">About</a>
//         <a href="ContactPage.jsx">Contact</a>
//       </div>
//       <div className="footer-social">
//         <a
//           href="https://instagram.com"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Instagram
//         </a>
//         <a
//           href="https://facebook.com"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Facebook
//         </a>
//         <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
//           Twitter
//         </a>
//       </div>
//       <p>
//         &copy; {new Date().getFullYear()} Velvet Bloom. All rights reserved.
//       </p>
//     </footer>
//   );
// };

// export default Footer;

import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/#products">Cakes</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="footer-social">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </div>

      <p>
        &copy; {new Date().getFullYear()} Velvet Bloom. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
