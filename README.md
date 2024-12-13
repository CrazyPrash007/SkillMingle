# SkillMingle

SkillMingle is a platform that connects freelancers with employers. It allows freelancers to showcase their skills and employers to post job opportunities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [Python](https://www.python.org/downloads/) (v3.6 or higher)
- [pip](https://pip.pypa.io/en/stable/installation/)

Clone the repository:
    ```
    git clone https://github.com/CrazyPrash007/SkillMingle.git
    ```

### Backend Setup

1. Navigate to the `Backend_Flask` directory:
    ```sh
    cd Backend_Flask
    ```

2. Install the required Python packages:
    ```sh
    pip install Flask Flask-Cors scikit-learn geopy jsonify bcrypt
    ```

3. Start the Flask server:
    ```sh
    python app.py
    ```

### Frontend Setup

1. Navigate to the root directory of the project:
    ```sh
    cd ..
    ```

2. Install the required Node.js packages:
    ```sh
    npm install
    npm install bcryptjs
    ```

3. Install `react-router-dom@5.3.4`:
    ```sh
    npm install react-router-dom@5.3.4
    ```

4. Start the React development server:
    ```sh
    npm start
    ```

## Usage

Once both the frontend and backend servers are running, you can access the application in your web browser at `http://localhost:3000`.

## Project Structure
```
.
├── Backend_Flask/
│   ├── app.py
│   ├── data.json
│   ├── freelancer_details.json
│   ├── freelancer.json
│   ├── job_details.json
│   ├── job.json
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
├── src/
│   ├── components/
│   │   ├── EmployerApp.js
│   │   ├── EmployerDashboard.js
│   │   ├── FreeLancerApp.js
│   │   ├── FreelancerCard.js
│   │   ├── FreelancerDashboard.js
│   │   ├── Header.js
│   │   ├── HomePage.js
│   │   ├── JobCard.js
│   │   ├── Profile.js
│   ├── styles/
│   │   ├── EmployerDashboard.css
│   │   ├── FreelancerCard.css
│   │   ├── FreelancerDashboard.css
│   │   ├── Form.css
│   │   ├── Header.css
│   │   ├── HomePage.css
│   │   ├── Profile.css
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   ├── setupTests.js
├── .gitignore
├── package.json
├── README.md

```

## API Endpoints

### Freelancer Endpoints

- `GET /freelancers`: Retrieve a list of all freelancers.
- `GET /freelancers/:id`: Retrieve details of a specific freelancer.
- `POST /store_freelancer`: Store a new freelancer's details.

### Job Endpoints

- `GET /jobs`: Retrieve a list of all jobs.
- `GET /jobs/:id`: Retrieve details of a specific job.
- `POST /store_job`: Store a new job's details.

### Recommendation Endpoint

- `POST /recommend`: Get job recommendations for a freelancer.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
