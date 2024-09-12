import "./index.css";
import config from "../../config";

function Header() {
  const sendMail = () => {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${config.mail}&su=Looking%20to%20buy%20a%20product`;
    window.location.href = url;
  };
  const clearCache = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.log("Error while clearing cache ", error);
      alert("Error while clearing cache,\nCheck console for details");
    }
  };
  return (
    <header>
      <div className="logo"></div>
      <div className="navs">
        <button onClick={sendMail} className="contact-btn">
          Contact Us
        </button>
        <button className="clear-cache-btn" onClick={clearCache}>
          Refetch
        </button>
      </div>
    </header>
  );
}

export { Header };
