import { useState } from "react";
import { useMessage } from "../contexts/MessageContext";
import { submitContactForm } from "../utils/api";
import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await submitContactForm(formData);
      showMessage(response.message, "success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      showMessage(
        error.response?.data?.message || "An error occurred. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section id="contact" className="contact-section">
        <h2>Get in Touch</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
