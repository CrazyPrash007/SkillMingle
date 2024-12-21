import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import '../styles/Profile.css';

function ProfileFreelancer({ freelancerId }) {
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleted, setDeleted] = useState(false);
    const history = useHistory();

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

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this freelancer profile?")) {
            fetch(`http://127.0.0.1:5000/delete_freelancer/${freelancerId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete the freelancer account.');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data.message);
                    alert("Account deleted successfully!");
                    setDeleted(true);
                    history.push(`/freelancerapp`);
                })
                .catch((error) => {
                    console.error("Error deleting account:", error);
                    alert("An error occurred while deleting the account.");
                });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (deleted) {
        return <div>The job profile has been deleted successfully.</div>;
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
            <button className="delete-button" onClick={handleDelete}>
                Delete my account
            </button>
        </div>
    );
}

export default ProfileFreelancer;
