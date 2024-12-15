import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import '../styles/Profile.css';

function Profile({ jobId }) {
    // const { jobId } = useParams();
    const [employer, setEmployer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch employer details from job.json or API
        fetch(`http://127.0.0.1:5000/job_details/${jobId}`) // Replace with the correct path or API endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Find employer details by ID
                setEmployer(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [jobId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!employer) {
        return <div>No employer data found.</div>;
    }

    return (
        <div className="profile">
            <h2>Profile</h2>
            <p><strong>Job Title:</strong> {employer.jobTitle}</p>
            <p><strong>Rating:</strong> {employer.rating}</p>
            <p><strong>Location:</strong> {employer.clientCountry}</p>
            <p><strong>Budget:</strong> ${employer.startRate}-${employer.endRate}</p>
            <p><strong>Skills:</strong> </p>
            <div>
              {employer.skills?.map((skill, index) => (
              <span className="skills-badge" key={index}>{skill}</span>
              ))}
            </div>
        </div>
    );
}

export default Profile;
