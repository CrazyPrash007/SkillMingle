import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import bcrypt
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React frontend

# Disable caching for static files and dynamic responses
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

# Middleware to prevent caching
@app.after_request
def add_no_cache_headers(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "-1"
    return response

# Reload data to ensure fresh data after adding new jobs
def reload_jobs():
    if not os.path.exists("job.json"):
        return []
    with open("job.json", "r") as file:
        return json.load(file)
    
# Reload freelancer data as well
def reload_freelancers():
    if not os.path.exists("freelancer.json"):
        return []
    with open("freelancer.json", "r") as file:
        return json.load(file)


@app.route('/job_details/<int:job_id>', methods=['GET'])
def get_job_details(job_id):
    # Find job by ID
    with open('job.json', 'r') as file:
        job_data = json.load(file)
    job = next((job for job in job_data if job["id"] == job_id), None)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job), 200

@app.route('/freelancer_details/<int:freelancer_id>', methods=['GET'])
def get_freelancer_details(freelancer_id):
    # Find freelancer by ID
    with open('freelancer.json', 'r') as file:
        freelancer_data = json.load(file)
    freelancer = next((freelancer for freelancer in freelancer_data if freelancer["id"] == freelancer_id), None)
    if not freelancer:
        return jsonify({"error": "Freelancer not found"}), 404
    return jsonify(freelancer), 200



def calculate_recommendation_score(job, freelancer):

    # 1. Skill Matching
    job_skills = set(job["skills"])
    freelancer_skills = set(freelancer["skills"])
    matched_skills = job_skills.intersection(freelancer_skills)

    # Exclude freelancer if no skills match
    if not matched_skills:
        return None  # Return None to indicate this freelancer should be excluded
    
    score = 0


    skill_score = len(matched_skills) / len(job_skills) * 70  # Weighted 50
    score += skill_score

    # 2. Budget Compliance
    start_rate = job["startRate"]
    end_rate = job["endRate"]
    if freelancer["hourlyRate"] <= end_rate:
        score += 20  # Weighted 20
    else:
        score -= 10  # Penalize if out of budget

    # 3. Experience
    experience_score = (
        (freelancer["jobSuccess"] * 0.4) +
        (freelancer["totalHours"] * 0.08) +
        (freelancer["totalJobs"] * 0.1  )
    )
    score += experience_score

    # 4. Location Match
    if job["clientCountry"] == freelancer["country"]:
        score += 5  # Small bonus for location match

    return score


def calculate_job_recommendation_score(freelancer, job):
    score = 0

    # 1. Skill Matching
    job_skills = set(job["skills"])
    freelancer_skills = set(freelancer["skills"])
    matched_skills = job_skills.intersection(freelancer_skills)
    if len(matched_skills) == 0:
        return None  # Skip this job if no skills match
    
    skill_score = len(matched_skills) / len(job_skills) * 70 
    score += skill_score

    # 2. Budget Compliance (Freelancer's hourlyRate should be within job's startRate and endRate)
    start_rate = job["startRate"]
    end_rate = job["endRate"]
    if freelancer["hourlyRate"] <= end_rate:
        score += 20  # Weighted 20
    else:
        score -= 10  # Penalize if out of budget

    # 3. Experience Level Demand (Penalize if job demands more experience than freelancer has)
    if job["exLevelDemand"] > freelancer["jobSuccess"]:
        score -= 10  # Penalize if the freelancer doesn't meet the experience demand

    # 4. Location Match (Small bonus for location match)
    if job["clientCountry"] == freelancer["country"]:
        score += 10  # Small bonus for location match

    # 5. Ratings and feedback
    rating_score = (
        (job["rating"] * 0.6) +
        (job["feedbackNum"] * 0.05) 
    )
    score += rating_score

    return score


@app.route('/store_job', methods=['POST'])
def store_job():
    try:
        # Get the new job data from the request
        new_job = request.json

        # Ensure proper types for numeric fields
        new_job['exLevelDemand'] = int(new_job.get('exLevelDemand', 0))
        new_job['rating'] = float(new_job.get('rating', 0.0))
        new_job['feedbackNum'] = int(new_job.get('feedbackNum', 0))
        new_job['startRate'] = int(new_job.get('startRate', 0))
        new_job['endRate'] = int(new_job.get('endRate', 0))

        # Load existing jobs
        jobs = reload_jobs()

         # Assign a new ID
        new_job['id'] = jobs[-1]['id'] + 1 if jobs else 1

        # Append the job and save
        jobs.append(new_job)
        with open("job.json", 'w') as file:
            json.dump(jobs, file, indent=4)

        # Immediately reload data after saving job
        reload_data()

        return jsonify({"message": "Job stored successfully!", "id": new_job['id']}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Endpoint for reloading data
@app.route("/reload_data", methods=["POST"])
def reload_data():
    try:
        jobs = reload_jobs()
        freelancers = reload_freelancers()

        return jsonify({"message": "Data reloaded successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/store_freelancer', methods=['POST'])
def store_freelancer():
    try:
        new_freelancer = request.json

        # Ensure proper types for numeric fields
        new_freelancer['hourlyRate'] = float(new_freelancer.get('hourlyRate', 0.0))
        new_freelancer['jobSuccess'] = float(new_freelancer.get('jobSuccess', 0.0))
        new_freelancer['totalHours'] = int(new_freelancer.get('totalHours', 0))
        new_freelancer['totalJobs'] = int(new_freelancer.get('totalJobs', 0))

        # Check if the job file exists
        if not os.path.exists('freelancer.json'):
            with open('freelancer.json', 'w') as file:
                json.dump([], file)

        # Load existing jobs
        with open('freelancer.json', 'r') as file:
            freelancers = json.load(file)

        # Assign a new ID
        new_freelancer['id'] = freelancers[-1]['id'] + 1 if freelancers else 1

        # Append the job and save
        freelancers.append(new_freelancer)
        with open('freelancer.json', 'w') as file:
            json.dump(freelancers, file, indent=4)

        return jsonify({"message": "Freelancer stored successfully!", "id": new_freelancer['id']}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/freelancers', methods=['GET'])
def freelancers():
    try:
        with open('freelancer.json', 'r') as file:
            freelancers = json.load(file)
        return jsonify(freelancers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        with open('job.json', 'r') as file:
            jobs = json.load(file)
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



@app.route("/recommend_freelancers", methods=["POST"])
def recommend_freelancers():
    try:
        job = request.json
        freelancers = reload_freelancers()  # Ensure we are fetching fresh freelancer data
        
        recommendations = []
        for freelancer in freelancers:
            score = calculate_recommendation_score(job, freelancer)
            if score is not None:  # Only include freelancers with matching skills
                recommendations.append({
                    "freelancer": freelancer,
                    "score": score
                })

        # Sort freelancers by recommendation score (high to low)
        sorted_recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)

        return jsonify(sorted_recommendations), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


    
@app.route("/recommend_jobs", methods=["POST"])
def recommend_jobs():
    try:
        # Load freelancer and job data
        freelancer = request.json
        with open("job.json", "r") as file:
            jobs = json.load(file)

        # Calculate recommendation scores for each job
        job_recommendations = []
        for job in jobs:
            score = calculate_job_recommendation_score(freelancer, job)
            if score is not None:  # Only include jobs with a valid score
                job_recommendations.append({
                    "job": job,
                    "score": score
                })

        # Sort jobs by recommendation score (high to low)
        sorted_job_recommendations = sorted(job_recommendations, key=lambda x: x["score"], reverse=True)

        # Return the sorted list of jobs
        return jsonify(sorted_job_recommendations), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_job_id', methods=['POST'])
def get_job_id():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    with open("job.json", "r") as file:
        job_data = json.load(file)
    
    job = next((job for job in job_data if job["email"] == email), None)
    if not job:
        return jsonify({"error": "Email not found"}), 404

    # Verify password
    if not bcrypt.checkpw(password.encode('utf-8'), job["password"].encode('utf-8')):
        return jsonify({"error": "Incorrect password"}), 403

    return jsonify({"id": job["id"]}), 200


@app.route('/get_freelancer_id', methods=['POST'])
def get_freelancer_id():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    with open("freelancer.json", "r") as file:
        freelancer_data = json.load(file)
    
    freelancer = next((freelancer for freelancer in freelancer_data if freelancer["email"] == email), None)
    if not freelancer:
        return jsonify({"error": "Email not found"}), 404

    # Verify password
    if not bcrypt.checkpw(password.encode('utf-8'), freelancer["password"].encode('utf-8')):
        return jsonify({"error": "Incorrect password"}), 403

    return jsonify({"id": freelancer["id"]}), 200

@app.route('/delete_job/<int:job_id>', methods=['DELETE'])
def delete_job_profile(job_id):
    try:
        # Load the current job data from job.json
        with open('job.json', 'r') as file:
            jobs = json.load(file)

        # Filter out the job with the specified job_id
        updated_jobs = [job for job in jobs if job['id'] != job_id]

        # Check if a job was deleted
        if len(jobs) == len(updated_jobs):
            return jsonify({"message": "Job profile not found."}), 404

        # Write the updated data back to job.json
        with open('job.json', 'w') as file:
            json.dump(updated_jobs, file, indent=4)  # Pretty-print for readability

        return jsonify({"message": f"Job profile with jobId {job_id} deleted successfully."}), 200
    except FileNotFoundError:
        return jsonify({"message": "job.json file not found."}), 500
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
    
@app.route('/delete_freelancer/<int:freelancer_id>', methods=['DELETE'])
def delete_freelancer_profile(freelancer_id):
    try:
        # Load the current freelancer data from freelancer.json
        with open('freelancer.json', 'r') as file:
            freelancers = json.load(file)

        # Filter out the freelancer with the specified freelancer_id
        updated_freelancers = [freelancer for freelancer in freelancers if freelancer['id'] != freelancer_id]

        # Check if a freelancer was deleted
        if len(freelancers) == len(updated_freelancers):
            return jsonify({"message": "Freelancer profile not found."}), 404

        # Write the updated data back to freelancer.json
        with open('freelancer.json', 'w') as file:
            json.dump(updated_freelancers, file, indent=4)  # Pretty-print for readability

        return jsonify({"message": f"Freelancer profile with jobId {freelancer_id} deleted successfully."}), 200
    except FileNotFoundError:
        return jsonify({"message": "freelancer.json file not found."}), 500
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Load existing feedback data
def load_feedback():
    try:
        with open("feedback.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Save feedback data to the file
def save_feedback(feedback_data):
    with open("feedback.json", "w") as file:
        json.dump(feedback_data, file, indent=4)

@app.route("/submit_rating", methods=["POST"])
def submit_rating():
    feedback_data = load_feedback()
    new_feedback = request.get_json()

    # Validate data
    if not new_feedback.get("rating") or not (1 <= new_feedback["rating"] <= 5):
        return jsonify({"message": "Invalid rating. Must be between 1 and 5."}), 400
    if not new_feedback.get("jobId") and not new_feedback.get("freelancerId"):
        return jsonify({"message": "Either jobId or freelancerId is required."}), 400

    # Create a new feedback entry
    feedback_entry = {
        "feedbackId": len(feedback_data) + 1,  # Auto-increment feedback ID
        "jobId": new_feedback.get("jobId"),
        "freelancerId": new_feedback.get("freelancerId"),
        "rating": new_feedback["rating"],
        "feedback": new_feedback.get("feedback", ""),
        "timestamp": datetime.now().isoformat(),
    }

    # Add the new feedback and save it
    feedback_data.append(feedback_entry)
    save_feedback(feedback_data)

    return jsonify({"message": "Feedback submitted successfully!"}), 200

    

if __name__ == '__main__':
    app.run(debug=True)