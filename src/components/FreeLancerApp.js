import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import bcrypt from 'bcryptjs';
import '../styles/Form.css';

function FreelancerApp() {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' }); // For login form
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    hourlyRate: 0,
    jobSuccess: 0,
    title: "",
    totalHours: 0,
    totalJobs: 0,
    skills: "",
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Define limits
    const limits = {
      jobSuccess: { min: 0, max: 100 },
      totalHours: { min: 0, max: undefined },
      totalJobs: { min: 0, max: undefined },
      hourlyRate: { min: 0, max: undefined },
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const freelancerData = {
      name: formData.name,
      country: formData.country,
      hourlyRate: parseFloat(formData.hourlyRate), // Convert to float
      jobSuccess: parseFloat(formData.jobSuccess), // Convert to float
      title: formData.title,
      totalHours: parseInt(formData.totalHours, 10), // Convert to integer
      totalJobs: parseInt(formData.totalJobs, 10), // Convert to integer
      skills: formData.skills.split(",").map(skill => skill.trim()),
      email: formData.email,
      password: hashedPassword,
    };

    fetch("https://backend-flask-z3kj.onrender.com/store_freelancer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(freelancerData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to store freelancer details.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Freelancer stored successfully with ID:", data.id);
        alert("Registration successful! Now you can log in.");

        setFormData({
          name: "",
          country: "",
          hourlyRate: 0,
          jobSuccess: 0,
          title: "",
          totalHours: 0,
          totalJobs: 0,
          skills: "",
          email: '',
          password: '',
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  // Handle job ID login
  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      email: loginDetails.email,
      password: loginDetails.password, // Store the hashed password
    };

    fetch("https://backend-flask-z3kj.onrender.com/get_freelancer_id", {
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
          history.push(`/jobsdashboard/${data.id}`);
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
    history.push('/showalljob');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  return (
    <div className="container">
      <div className="text">Freelancer Details</div>
      <form onSubmit={handleSubmit}>
        <h3>Register : </h3>
        <div className="form-row">
          <div className="input-data">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Name</label>
          </div>
          <div className="input-data">
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Location</label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} min="0" required />
            <div className="underline"></div>
            <label>Hourly Rate</label>
          </div>
          <div className="input-data">
            <input type="number" name="jobSuccess" value={formData.jobSuccess} onChange={handleChange} min="0" max="100" required />
            <div className="underline"></div>
            <label>Job Success Rate (%)</label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Title</label>
          </div>
          <div className="input-data">
            <input type="number" name="totalHours" value={formData.totalHours} onChange={handleChange} min="0" required />
            <div className="underline"></div>
            <label>Total Hours Worked</label>
          </div>
        </div>
        <div className="form-row">
          <div className="input-data">
            <input type="number" name="totalJobs" value={formData.totalJobs} onChange={handleChange} min="0" required />
            <div className="underline"></div>
            <label>Total Jobs Completed</label>
          </div>
          <div className="input-data">
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} required />
            <div className="underline"></div>
            <label>Skills (comma separated)</label>
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

      <h3>Want to search jobs from your own?</h3>
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

export default FreelancerApp;
