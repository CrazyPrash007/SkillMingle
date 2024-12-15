import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import '../styles/Profile.css';

function ProfileFreelancer({ freelancerId }) {
    // const { freelancerId } = useParams();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch freelancer details from job.json or API
        fetch(`http://127.0.0.1:5000/freelancer_details/${freelancerId}`) // Replace with the correct path or API endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Find freelancer details by ID
                setFreelancer(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [freelancerId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!freelancer) {
        return <div>No freelancer data found.</div>;
    }

    return (
        <div className="profile">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {freelancer.name}</p>
            <p><strong>Title:</strong> {freelancer.title}</p>
            <p><strong>Location:</strong> {freelancer.country}</p>
            <p><strong>Job Success:</strong> {freelancer.jobSuccess}%</p>
            <p><strong>Hourly Rate:</strong> ${freelancer.hourlyRate}/hr</p>
            <p><strong>Skills:</strong> </p>
            <div>
              {freelancer.skills?.map((skill, index) => (
              <span className="skills-badge" key={index}>{skill}</span>
              ))}
            </div>
        </div>
    );
}

export default ProfileFreelancer;
