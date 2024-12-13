import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import freelancerImage from '../Elements/freelancer.jpg';
import employerImage from '../Elements/employer.jpg';

function HomePage() {
  return (
    <div className="homepage">
      <h1>Welcome to SkillMingle</h1>
      <div className="card-container">
        <div className="card">
          <h3>Freelancer</h3>
          <img src={freelancerImage} alt="Freelancer" />
          <p>Showcase your skills, find job opportunities, and grow your freelance career.</p>
          <Link to="/freelancerapp">
            <button className="apply-button">Freelancer</button>
          </Link>
        </div>
        <div className="card">
          <h3>Employer</h3>
          <img src={employerImage} alt="Employer" />
          <p>Post job opportunities, find skilled freelancers, and get your projects done efficiently.</p>
          <Link to="/employerapp">
            <button className="apply-button">Employer</button>
          </Link>
        </div>
      </div>
      <div className="features">
        <h3>Why Choose SkillMingle?</h3>
        <ul>
          <li>Wide range of skilled freelancers</li>
          <li>Achieve top-quality results rapidly</li>
          <li>Stay within your budget</li>
          <li>Rely on round-the-clock support</li>
        </ul>
      </div>
      <div className="testimonials">
        <h3>What Our Users Say</h3>
        <div className="testimonial">
          <p>"SkillMingle helped me find the perfect freelancer for my project. The process was smooth and efficient!"</p>
          <strong>- John Doe, Employer</strong>
        </div>
        <div className="testimonial">
          <p>"I've been able to grow my freelance career thanks to SkillMingle. The platform is easy to use and has a lot of job opportunities."</p>
          <strong>- Jane Smith, Freelancer</strong>
        </div>
      </div>
    </div>
  );
}

export default HomePage;