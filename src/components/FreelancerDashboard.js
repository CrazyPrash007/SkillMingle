import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import JobCard from './JobCard';
import ProfileFreelancer from './ProfileFreelancer';
import RatingForm from './RatingForm';
import '../styles/FreelancerDashboard.css';
import profileImage from '../Elements/profile.jpg';

function FreelancerDashboard() {
  const { freelancerId } = useParams(); // Retrieve freelancerId from URL
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    clientCountry: '',
    skills: '',
    ratingMin: '',
    rateMin: '',
  });
  const [showProfile, setShowProfile] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Freelancer ID:", freelancerId);
    fetch(`http://127.0.0.1:5000/freelancer_details/${freelancerId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Ensure the response is parsed as JSON.
      })
      .then((freelancerDetails) => {
        // Fetch recommended jobs using freelancerDetails.
        fetch('http://127.0.0.1:5000/recommend_jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(freelancerDetails),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            setJobs(data);
            setFilteredJobs(data);
          })
          .catch((error) => {
            console.error('Error fetching jobs:', error);
            setError(error.message);
          });
      })
      .catch((error) => {
        console.error('Error fetching job details:', error);
        setError(error.message);
      });
  }, [freelancerId]);

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const limits = {
      ratingMin: 5,
    };
  
    // Check limits
    if (limits[name] !== undefined && value > limits[name]) {
      alert(`The limit for ${name} is ${limits[name]}.`);
      return;
    }
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const { clientCountry, skills, ratingMin, rateMin } = filters;
    const skillSet = skills.split(',').map((skill) => skill.trim().toLowerCase());

    const filtered = jobs.filter(({ job }) => {
      const matchesCountry = clientCountry ? job.clientCountry.toLowerCase().includes(clientCountry.toLowerCase()) : true;
      const matchesSkills = skills
        ? skillSet.every((skill) => job.skills.map((s) => s.toLowerCase()).includes(skill))
        : true;
      const matchesRating =
        (ratingMin ? job.rating >= parseFloat(ratingMin) : true);
      const matchesRate = (rateMin ? job.endRate >= parseFloat(rateMin) : true);

      return matchesCountry && matchesSkills && matchesRating && matchesRate;
    });

    setFilteredJobs(filtered);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="job-dashboard">
      <h1>Recommended Jobs</h1>

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
          <label>
            Min hourly rate:
            <input
              type="number"
              name="rateMin"
              placeholder="Min hourly rate"
              value={filters.rateMin}
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
          src={profileImage} // Replace with your profile icon
          alt="Profile Icon"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      </div>

      {/* Show Profile */}
      {showProfile && <ProfileFreelancer freelancerId={freelancerId} />}

      <div className="freelancer-cards-container">
        {filteredJobs.map((recommendation) => (
          <JobCard key={recommendation.job.id} job={recommendation.job} score={recommendation.score} />
        ))}
      </div>

      <RatingForm />

    </div>
  );
}

export default FreelancerDashboard;