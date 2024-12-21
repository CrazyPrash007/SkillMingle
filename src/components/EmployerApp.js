import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import bcrypt from 'bcryptjs';
import '../styles/Form.css';

function EmployerApp() {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' }); // For login form
  const history = useHistory();
  const [formData, setFormData] = useState({
    jobTitle: "",
    exLevelDemand: 0,
    clientCountry: "",
    rating: 0,
    feedbackNum: 0,
    email: '',
    password: '',
    startRate: 0,
    endRate: 0,
    skills: "", // Holds comma-separated skills
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Define limits
    const limits = {
      exLevelDemand: { min: 0, max: 100 },
      rating: { min: 0, max: 5 },
      feedbackNum: { min: 0, max: undefined },
      startRate: { min: 0, max: undefined },
      endRate: { min: 0, max: undefined },
    };
  
    // Check limits
    if (limits[name] !== undefined) {
      if (limits[name].max !== undefined && value > limits[name].max) {
        alert(`The limit for ${name} is ${limits[name].max}.`);
        return;
      }
      if (value < limits[name].min) {
        alert(`The limit for ${name} is between ${limits[name].min} and ${limits[name].max !== undefined ? limits[name].max : 'unlimited'}.`);
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const employerData = {
      jobTitle: formData.jobTitle,
      exLevelDemand: parseInt(formData.exLevelDemand, 10), // Convert to integer
      clientCountry: formData.clientCountry,
      rating: parseFloat(formData.rating), // Convert to float
      feedbackNum: parseInt(formData.feedbackNum, 10), // Convert to integer
      email: formData.email,
      password: hashedPassword, // Store the hashed password
      startRate: parseInt(formData.startRate, 10), // Convert to integer
      endRate: parseInt(formData.endRate, 10), // Convert to integer
      skills: formData.skills.split(",").map((skill) => skill.trim()), // Array of strings
    };

    fetch("http://127.0.0.1:5000/store_job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employerData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to store job details.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Job stored successfully with ID:", data.id);
        alert("Registration successful! Now you can log in.");
        // Clear the form fields
        setFormData({
          jobTitle: "",
          exLevelDemand: 0,
          clientCountry: "",
          rating: 0,
          feedbackNum: 0,
          email: '',
          password: '',
          startRate: 0,
          endRate: 0,
          skills: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      email: loginDetails.email,
      password: loginDetails.password, // Store the hashed password
    };

    fetch("http://127.0.0.1:5000/get_job_id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          // Redirect to EmployerDashboard with jobId
          history.push(`/dashboard/${data.id}`);
        } else {
          alert(data.error || "Invalid email or password.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      });
  };

  const handleShow = (e) => {
    e.preventDefault();
    history.push('/showall');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  return (
    <div className="container">
      <div className="text">Employer Job Details</div>
      <form onSubmit={handleRegister}>
        <h3>Register :</h3>
        <div className="form-row">
          <div className="input-data">
            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Job Title</label>
          </div>
          <div className="input-data">
            <input type="number" name="exLevelDemand" value={formData.exLevelDemand} onChange={handleChange} min="0" max="100" required />
            <div className="underline"></div>
            <label>Experience Level Demand</label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <input type="text" name="clientCountry" value={formData.clientCountry} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Location</label>
          </div>
          <div className="input-data">
            <input type="number" name="rating" value={formData.rating} step="0.1" onChange={handleChange} min="0" max="5" required />
            <div className="underline"></div>
            <label>Rating</label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <input type="number" name="feedbackNum" value={formData.feedbackNum} onChange={handleChange} min="0" required />
            <div className="underline"></div>
            <label>Feedback Number</label>
          </div>
          <div className="input-data">
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Skills (comma separated)</label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <input type="number" name="startRate" value={formData.startRate} onChange={handleChange} min="0" required />
            <div className="underline"></div>
            <label>Start Rate</label>
          </div>
          <div className="input-data">
            <input type="number" name="endRate" value={formData.endRate} onChange={handleChange} min="0" required />
            <div className="underline"></div>
            <label>End Rate</label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Contact Email</label>
          </div>
          <div className="input-data">
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Create Password</label>
          </div>
        </div>
        <div className="form-row submit-btn">
          <div className="input-data">
            <div className="inner"></div>
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form>

      <h3>Already Logged In?</h3>
      <form onSubmit={handleLogin}>
        <div className="form-row">
          <div className="input-data">
            <input type="email" name="email" value={loginDetails.email} onChange={handleLoginChange} required />
            <div className="underline"></div>
            <label>Email</label>
          </div>
          <div className="input-data">
            <input type="password" name="password" value={loginDetails.password} onChange={handleLoginChange} required />
            <div className="underline"></div>
            <label>Password</label>
          </div>
        </div>
        <div className="form-row submit-btn">
          <div className="input-data">
            <div className="inner"></div>
            <input type="submit" value="Login" />
          </div>
        </div>
      </form>

      <h3>Want to search freelancers from your own?</h3>
      <form onSubmit={handleShow}>
        <div className="form-row submit-btn">
          <div className="input-data">
            <div className="inner"></div>
            <input type="submit" value="Search" />
          </div>
        </div>
      </form>

    </div>
  );
}

export default EmployerApp;