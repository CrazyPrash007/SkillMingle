import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import '../styles/Profile.css';

function Profile({ jobId }) {
    const [employer, setEmployer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleted, setDeleted] = useState(false);
    const history = useHistory();

    useEffect(() => {
        // Fetch employer details from job.json or API
        fetch(`https://backend-flask-z3kj.onrender.com/job_details/${jobId}`) // Replace with the correct path or API endpoint
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

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this job profile?")) {
            fetch(`https://backend-flask-z3kj.onrender.com/delete_job/${jobId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete the job profile.');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data.message);
                    alert("Job profile deleted successfully!");
                    setDeleted(true);
                    history.push(`/employerapp`);
                })
                .catch((error) => {
                    console.error("Error deleting job profile:", error);
                    alert("An error occurred while deleting the job profile.");
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
            <button className="delete-button" onClick={handleDelete}>
                Delete Job Profile
            </button>
        </div>
    );
}

export default Profile;
