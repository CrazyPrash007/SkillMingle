import React, { useEffect, useState } from 'react';
import '../styles/FreelancerDashboard.css';

function ShowAllJob() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    clientCountry: "",
    skills: "",
    ratingMin: "",
  });

  useEffect(() => {
    // Fetch all jobs from the backend
    fetch('http://127.0.0.1:5000/jobs')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data); // Initialize filtered list with all jobs
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        alert('Error fetching jobs. Please try again.');
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply filters to jobs
  const applyFilters = () => {
    const { clientCountry, skills, ratingMin } = filters;

    // Split skills into an array of trimmed, lowercase values
    const skillFilterArray = skills
      .split(",")
      .map(skill => skill.trim().toLowerCase())
      .filter(skill => skill !== ""); // Remove empty strings

    const filtered = jobs.filter((job) => {
      const matchesCountry = clientCountry
        ? job.clientCountry.toLowerCase().includes(clientCountry.toLowerCase())
        : true;

      const matchesSkills = skillFilterArray.length > 0
        ? skillFilterArray.some(skill =>
            job.skills.map(s => s.toLowerCase()).includes(skill)
          )
        : true;

      const matchesRating =
        (ratingMin ? job.rating >= parseFloat(ratingMin) : true);

      return matchesCountry && matchesSkills && matchesRating;
    });

    setFilteredJobs(filtered);
  };

  return (
    <div className="show-all-container">
      <h1>Job Listings</h1>

      <div className="filter-container">
        <div className="filter">
          <label>
            Location:
            <input
              type="text"
              name="clientCountry"
              placeholder="Filter by location"
              value={filters.clientCountry}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Skills:
            <input
              type="text"
              name="skills"
              placeholder="Filter by skills (comma-separated)"
              value={filters.skills}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Min Rating:
            <input
              type="number"
              name="ratingMin"
              placeholder="Min Rating"
              value={filters.ratingMin}
              onChange={handleFilterChange}
            />
          </label>
          {/* <label>
            Max hourly rate:
            <input
              type="number"
              name="hourlyRateMax"
              placeholder="Max hourly rate"
              value={filters.hourlyRateMax}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Min Job Success:
            <input
              type="number"
              name="jobSuccessMin"
              placeholder="Min Job Success"
              value={filters.jobSuccessMin}
              onChange={handleFilterChange}
            />
          </label> */}
          <button onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>


      {/* Render job cards */}
      <div className="freelancer-cards-container">
        {filteredJobs.map((job) => (
          <div className="freelancer-card" key={job.id}>
            <h3>{job.jobTitle}</h3>
            <p><strong>Experience Level:</strong> {job.exLevelDemand}</p>
            <p><strong>Location:</strong> {job.clientCountry}</p>
            <p><strong>Rating:</strong> {job.rating}/5</p>
            <p><strong>Number of feedbacks:</strong> {job.feedbackNum}</p>
            <p><strong>Payment Type:</strong> {job.paymentType}</p>
            <p><strong>Budget:</strong> ${job.startRate}-${job.endRate}</p>
            <p><strong>Skills:</strong> </p>
            <div>
              {job.skills.map((skill, index) => (
              <span className="skills-badge" key={index}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowAllJob;




