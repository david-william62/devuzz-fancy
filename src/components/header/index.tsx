import "./index.css";
import config from "../../config";

function Header() {
  const sendMail = () => {
    const url = "mail.google.com/mail";
    window.location.href = url;
  };
  return (
    <header>
      <div className="logo"></div>
      <div className="navs">
        <button onClick={sendMail} className="contact-btn">
          Contact Us
        </button>
      </div>
    </header>
  );
}

export { Header };
