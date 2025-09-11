// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    preferences: {
      favoriteCakeType: "",
      dietaryRestrictions: "",
      specialOccasions: "",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("preferences.")) {
      const prefField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    setLoading(true);

    try {
      // Prepare data for API (remove confirmPassword)
      const submitData = { ...formData };
      delete submitData.confirmPassword;

      const result = await register(submitData);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to create an account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form enhanced-form">
        <h2>Create an Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="additional-fields-toggle">
            <button
              type="button"
              className="btn-link"
              onClick={() => setShowAdditionalFields(!showAdditionalFields)}
            >
              {showAdditionalFields ? "Hide" : "Show"} Additional Information
              (Optional)
            </button>
          </div>

          {showAdditionalFields && (
            <div className="additional-fields">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="For order updates and delivery"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Your default delivery address"
                ></textarea>
              </div>

              <h4>Preferences</h4>
              <div className="form-group">
                <label htmlFor="favoriteCakeType">Favorite Cake Type</label>
                <select
                  id="favoriteCakeType"
                  name="preferences.favoriteCakeType"
                  value={formData.preferences.favoriteCakeType}
                  onChange={handleChange}
                >
                  <option value="">Select your favorite</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="vanilla">Vanilla</option>
                  <option value="red-velvet">Red Velvet</option>
                  <option value="lemon">Lemon</option>
                  <option value="carrot">Carrot</option>
                  <option value="cheesecake">Cheesecake</option>
                  <option value="fruit">Fruit Cake</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dietaryRestrictions">
                  Dietary Restrictions
                </label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.dietaryRestrictions"
                      value="gluten-free"
                      checked={formData.preferences.dietaryRestrictions.includes(
                        "gluten-free"
                      )}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            dietaryRestrictions: e.target.checked
                              ? [
                                  ...prev.preferences.dietaryRestrictions
                                    .split(",")
                                    .filter(Boolean),
                                  value,
                                ].join(",")
                              : prev.preferences.dietaryRestrictions
                                  .split(",")
                                  .filter((item) => item !== value)
                                  .join(","),
                          },
                        }));
                      }}
                    />
                    Gluten Free
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.dietaryRestrictions"
                      value="dairy-free"
                      checked={formData.preferences.dietaryRestrictions.includes(
                        "dairy-free"
                      )}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            dietaryRestrictions: e.target.checked
                              ? [
                                  ...prev.preferences.dietaryRestrictions
                                    .split(",")
                                    .filter(Boolean),
                                  value,
                                ].join(",")
                              : prev.preferences.dietaryRestrictions
                                  .split(",")
                                  .filter((item) => item !== value)
                                  .join(","),
                          },
                        }));
                      }}
                    />
                    Dairy Free
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.dietaryRestrictions"
                      value="nut-free"
                      checked={formData.preferences.dietaryRestrictions.includes(
                        "nut-free"
                      )}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            dietaryRestrictions: e.target.checked
                              ? [
                                  ...prev.preferences.dietaryRestrictions
                                    .split(",")
                                    .filter(Boolean),
                                  value,
                                ].join(",")
                              : prev.preferences.dietaryRestrictions
                                  .split(",")
                                  .filter((item) => item !== value)
                                  .join(","),
                          },
                        }));
                      }}
                    />
                    Nut Free
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.dietaryRestrictions"
                      value="vegan"
                      checked={formData.preferences.dietaryRestrictions.includes(
                        "vegan"
                      )}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            dietaryRestrictions: e.target.checked
                              ? [
                                  ...prev.preferences.dietaryRestrictions
                                    .split(",")
                                    .filter(Boolean),
                                  value,
                                ].join(",")
                              : prev.preferences.dietaryRestrictions
                                  .split(",")
                                  .filter((item) => item !== value)
                                  .join(","),
                          },
                        }));
                      }}
                    />
                    Vegan
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="specialOccasions">
                  Special Occasions You Often Celebrate
                </label>
                <input
                  type="text"
                  id="specialOccasions"
                  name="preferences.specialOccasions"
                  value={formData.preferences.specialOccasions}
                  onChange={handleChange}
                  placeholder="e.g., Birthday, Anniversary, Wedding"
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
