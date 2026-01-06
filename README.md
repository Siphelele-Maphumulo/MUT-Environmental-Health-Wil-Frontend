🌱 Environmental Health WIL Management System

A full-stack web-based information system designed to manage Work-Integrated Learning (WIL) programmes in Environmental Health, supporting students, mentors, and administrators while ensuring regulatory compliance.

📘 Introduction & Background

Work-Integrated Learning (WIL) is a mandatory component of Environmental Health qualifications in South Africa. Students are required to complete supervised practical training to meet academic and HPCSA (Health Professions Council of South Africa) requirements.

However, institutions often face challenges related to:

Monitoring student progress

Managing mentor assignments

Tracking applications and placements

Ensuring regulatory compliance

Maintaining clear communication between stakeholders

This system addresses these challenges by providing a centralized, digital platform that improves oversight, efficiency, and accountability throughout the WIL lifecycle.

🎯 Objectives

The primary objectives of this system are to:

Digitally manage the WIL application and placement process

Improve communication between students, mentors, and administrators

Provide real-time visibility into student progress and programme performance

Support institutional compliance with HPCSA requirements

Reduce administrative overhead through automation

🏗️ System Architecture

The application follows a client–server architecture using modern web technologies.

Frontend (Angular)

Component-based architecture for scalability and maintainability

Role-based access control at the UI level (Admin, Mentor, Student)

Angular Universal (SSR) to improve performance and SEO

Responsive UI built with Angular Material and Bootstrap

Backend (Node.js & Express)

RESTful API architecture

JWT-based authentication and authorization

Secure role-based endpoint access

Centralized business logic and validation

Database Layer

MySQL relational database

Normalized schema supporting users, applications, placements, progress logs, and compliance data

Referential integrity enforced via constraints

⚙️ Core Functionalities
Student Module

Account registration and authentication

Profile management (academic & personal data)

WIL programme application and tracking

Secure document uploads

Communication with assigned mentors

Mentor Module

Mentor profile management

Student assignment and supervision

Progress monitoring and feedback submission

Direct communication with students

Administrator Module

System-wide user management

Application and placement oversight

Programme analytics and reporting

HPCSA compliance monitoring

🔐 Security & Access Control

JWT-based authentication

Role-based authorization (RBAC)

Secure API access

Protected routes on frontend and backend

Environment-based configuration management

📦 Installation & Setup
Prerequisites

Node.js 18+

Angular CLI 18+

MySQL 8+

Setup Instructions
# Clone the repository
git clone https://github.com/your-username/environmental-health-wil-frontend.git

# Navigate to the project directory
cd environmental-health-wil-frontend

# Install dependencies
npm install

# Configure the database
# - Create a MySQL database
# - Import environmental_health_wil_db.sql

# Create environment variables
# .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=environmental_health_wil
JWT_SECRET=your_secret_key

# Run the application
ng serve


Access the system at:

http://localhost:4200

🛠️ Technology Stack
Layer	Technology
Frontend	Angular, Angular Material, Bootstrap
Backend	Node.js, Express
Database	MySQL
Authentication	JSON Web Tokens (JWT)
Visualization	Chart.js
📁 Project Structure
environmental-health-wil-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── mentor/
│   │   │   └── student/
│   │   ├── services/
│   │   ├── models/
│   └── assets/
├── environments/
├── angular.json
├── package.json
└── README.md

📊 Performance Indicators
Student Metrics

Application success rate

Placement rate

Programme completion rate

Mentor Metrics

Student-to-mentor ratio

Student performance trends

Student satisfaction indicators

Programme Metrics

Total placements

Industry partnerships

HPCSA compliance rate

📈 Analytical Value

The system enables stakeholders to answer key operational and strategic questions, including:

Student placement progress and completion status

Mentor workload distribution

Programme growth and partnership trends

Regulatory compliance levels

🧠 Educational & Professional Value

This project demonstrates competency in:

Full-stack system development

Secure authentication and authorization

Relational database design

Modular frontend architecture

RESTful API design

Software documentation and system modeling

🚀 Future Enhancements

Real-time notifications

Advanced analytics dashboards

University system integration

Mobile application development

CI/CD automation

👤 Author

Siphelele Maphumulo
🔗 LinkedIn: https://www.linkedin.com/in/siphelele-maphumulo-52a787355/

💻 GitHub: https://github.com/Siphelele-Maphumulo/

📄 License

This project is released under the MIT License and is intended for educational, research, and portfolio use.
