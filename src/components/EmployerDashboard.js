import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FreelancerCard from './FreelancerCard';
import Profile from './Profile';
import RatingForm from './RatingForm';
import '../styles/EmployerDashboard.css';
import profileImage from '../Elements/profile.jpg';

function EmployerDashboard() {
  const { jobId } = useParams();
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    skills: '',
    hourlyRateMin: '',
    hourlyRateMax: '',
    jobSuccessMin: '',
  });
  const [showProfile, setShowProfile] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Job ID:", jobId);

    fetch(`http://127.0.0.1:5000/job_details/${jobId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jobDetails) => {
        console.log("Job Details:", jobDetails);

        fetch("http://127.0.0.1:5000/recommend_freelancers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobDetails),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Recommendations:", data);
            setFreelancers(data);
            setFilteredFreelancers(data);
          })
          .catch((error) => {
            console.error("Error fetching freelancers:", error);
            setError(error.message);
          });
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
        setError(error.message);
      });
  }, [jobId]);

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const { country, skills, hourlyRateMin, hourlyRateMax, jobSuccessMin } = filters;
    const skillSet = skills.split(',').map((skill) => skill.trim().toLowerCase());

    const filtered = freelancers.filter(({ freelancer }) => {
      const matchesCountry = country ? freelancer.country.toLowerCase().includes(country.toLowerCase()) : true;
      const matchesSkills = skills
        ? skillSet.every((skill) => freelancer.skills.map((s) => s.toLowerCase()).includes(skill))
        : true;
      const matchesHourlyRate =
        (hourlyRateMin ? freelancer.hourlyRate >= parseFloat(hourlyRateMin) : true) &&
        (hourlyRateMax ? freelancer.hourlyRate <= parseFloat(hourlyRateMax) : true);
      const matchesJobSuccess = (jobSuccessMin ? freelancer.jobSuccess >= parseFloat(jobSuccessMin) : true);

      return matchesCountry && matchesSkills && matchesHourlyRate && matchesJobSuccess;
    });

    setFilteredFreelancers(filtered);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="employer-dashboard">
      <h1>Recommended Freelancers</h1>

      <div className="filter-container">
        <div className="filter">
          <label>
            Location:
            <input
              type="text"
              name="country"
              placeholder="Filter by location"
              value={filters.country}
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
            Min hourly rate:
            <input
              type="number"
              name="hourlyRateMin"
              placeholder="Min hourly rate"
              value={filters.hourlyRateMin}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Max hourly rate:
            <input
              type="number"
              name="hourlyRateMax"
              placeholder="Max hourly rate"
              value={filters.hourlyRateMax}
              onChange={handleFilterChange}
            />
          </label>
          {/* <label>
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


      {/* Profile Icon */}
      <div className="profile-icon" onClick={handleProfileClick}>
        <img
          src={profileImage}
          alt="Profile Icon"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      </div>


      {/* Show Profile */}
      {showProfile && <Profile jobId={jobId} />}

      <div className="freelancer-cards-container">
        {filteredFreelancers.map((recommendation) => (
          <FreelancerCard key={recommendation.freelancer.id} freelancer={recommendation.freelancer} score={recommendation.score} />
        ))}
      </div>

      <RatingForm />

    </div>
    
  );
}

export default EmployerDashboard;
