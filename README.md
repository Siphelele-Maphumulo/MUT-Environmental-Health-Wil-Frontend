# Environmental Health WIL Management System

[![Angular](https://img.shields.io/badge/Angular-18+-red.svg)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4+-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-blue.svg)](https://www.mysql.com/)

> **A comprehensive web application for managing Work-Integrated Learning (WIL) programs in Environmental Health, connecting students, mentors, and administrators.**

---

## 📊 Business Context

The Environmental Health sector requires students to complete a Work-Integrated Learning (WIL) program to gain practical experience. Managing this process can be challenging, with difficulties in tracking student progress, facilitating communication between students and mentors, and ensuring compliance with HPCSA (Health Professions Council of South Africa) regulations.

**This project solves these challenges by providing a centralized platform for:**
- ✅ Streamlining the application and placement process for students.
- ✅ Facilitating communication and mentorship between students and mentors.
- ✅ Providing administrators with a comprehensive overview of the WIL program.
- ✅ Ensuring compliance with HPCSA regulations.

---

## 🏗️ Architecture

This project follows a modern client-server architecture, with an Angular frontend and a Node.js/Express backend.

### Frontend (Angular)
-   **Component-Based UI**: The application is built using a modular, component-based architecture, making it easy to maintain and scale.
-   **Role-Based Access Control**: The frontend implements role-based access control to ensure that users only have access to the features and data relevant to their role (Admin, Mentor, Student).
-   **Server-Side Rendering (SSR)**: The application uses Angular Universal for server-side rendering, which improves performance and SEO.

### Backend (Node.js/Express)
-   **RESTful API**: The backend exposes a RESTful API for the frontend to consume.
-   **Authentication & Authorization**: The backend uses JSON Web Tokens (JWT) for authentication and authorization.
-   **Database**: The application uses a MySQL database to store data.

### Data Model
The database schema is designed to support the application's key features, with tables for users, students, mentors, applications, and more.

---

## 🚀 Features

### 1. Student Portal
- ✅ **User Registration & Login**: Students can create an account and log in to the system.
- ✅ **Profile Management**: Students can create and update their profiles with personal and academic information.
- ✅ **Application Management**: Students can apply for WIL programs and track the status of their applications.
- ✅ **Document Upload**: Students can upload necessary documents, such as resumes and academic transcripts.
- ✅ **Communication**: Students can communicate with mentors through the platform.

### 2. Mentor Portal
- ✅ **User Registration & Login**: Mentors can create an account and log in to the system.
- ✅ **Profile Management**: Mentors can create and update their profiles with professional information.
- ✅ **Student Management**: Mentors can view and manage the students they are mentoring.
- ✅ **Progress Tracking**: Mentors can track the progress of their students and provide feedback.
- ✅ **Communication**: Mentors can communicate with students through the platform.

### 3. Admin Dashboard
- ✅ **User Management**: Admins can manage all users in the system (students, mentors, and other admins).
- ✅ **Application Management**: Admins can view and manage all WIL program applications.
- ✅ **Analytics & Reporting**: Admins can view analytics and generate reports on the WIL program.
- ✅ **HPCSA Compliance**: Admins can ensure that the WIL program is compliant with HPCSA regulations.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Angular CLI 18+
- MySQL 8+

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/environmental-health-wil-frontend.git

# 2. Navigate to the project directory
cd environmental-health-wil-frontend

# 3. Install dependencies
npm install

# 4. Set up the database
# - Create a new MySQL database
# - Import the environmental_health_wil_db.sql file

# 5. Configure the application
# - Create a .env file in the root directory
# - Add the following environment variables:
#   - DB_HOST=your-database-host
#   - DB_USER=your-database-user
#   - DB_PASSWORD=your-database-password
#   - DB_NAME=your-database-name
#   - JWT_SECRET=your-jwt-secret

# 6. Run the application
ng serve
```

---

## 🛠️ Technology Stack

| Layer | Technology | Why? |
|---|---|---|
| **Frontend** | Angular | A powerful and popular framework for building complex single-page applications. |
| **Backend** | Node.js + Express | A lightweight and efficient combination for building RESTful APIs. |
| **Database** | MySQL | A reliable and widely-used relational database. |
| **Authentication** | JWT | A secure and stateless method for authenticating users. |
| **UI** | Angular Material + Bootstrap | A combination of a comprehensive UI component library and a popular CSS framework for building responsive and visually appealing UIs. |
| **Visualizations** | Chart.js | A simple yet flexible charting library for creating data visualizations. |

---

## 📁 Project Structure

```
environmental-health-wil-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── mentor/
│   │   │   └── student/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   ├── assets/
│   ├── environments/
│   └── ...
├── .gitignore
├── angular.json
├── package.json
└── README.md
```

---

## 📊 Key Performance Indicators (KPIs)

### Student KPIs
| KPI | Description |
|---|---|
| **Application Success Rate** | % of students who successfully apply for a WIL program |
| **Placement Rate** | % of students who are successfully placed in a WIL program |
| **Completion Rate** | % of students who successfully complete their WIL program |

### Mentor KPIs
| KPI | Description |
|---|---|
| **Student-to-Mentor Ratio** | The number of students assigned to each mentor |
| **Student Performance** | The average performance of students under a mentor's guidance |
| **Student Satisfaction** | The satisfaction level of students with their mentors |

### Program KPIs
| KPI | Description |
|---|---|
| **Number of Placements** | The total number of students placed in WIL programs |
| **Number of Partnerships** | The total number of companies partnering with the institution for WIL programs |
| **HPCSA Compliance Rate** | The % of WIL programs that are compliant with HPCSA regulations |

---

## 🎯 Business Questions Answered

This system answers critical questions for each user group:

### For Students:
- "What WIL programs are available and how do I apply?"
- "What is the status of my application?"
- "How can I communicate with my mentor?"

### For Mentors:
- "Which students am I mentoring and how are they progressing?"
- "How can I provide feedback to my students?"
- "How can I communicate with my students?"

### For Administrators:
- "How many students are currently in WIL programs?"
- "Which companies are we partnered with?"
- "Are we compliant with HPCSA regulations?"

---

## 💼 Why This Project Stands Out

### For Recruiters:
✅ **Real-World Problem Solving** - Addresses a genuine need in the education and environmental health sectors.
✅ **Full-Stack Development** - Demonstrates proficiency in both frontend and backend technologies.
✅ **Role-Based Access Control** - Implements a critical security feature for multi-user applications.
✅ **Data-Driven Insights** - Provides a dashboard with analytics and reporting capabilities.
✅ **Clean Code & Architecture** - Follows best practices for building scalable and maintainable applications.

### Skills Demonstrated:
- Full-Stack Web Development (Angular, Node.js, Express, MySQL)
- UI/UX Design (Angular Material, Bootstrap)
- API Design & Development (RESTful APIs)
- Authentication & Authorization (JWT)
- Database Design & Management (MySQL)
- Data Visualization (Chart.js)
- Software Engineering (modular design, configuration, documentation)

---

## 🎓 Learning Outcomes

By building this project, you demonstrate understanding of:

1.  **Full-Stack Development**: How to build a complete web application from the ground up.
2.  **Modern Frontend Frameworks**: How to use Angular to build a complex single-page application.
3.  **Backend Development**: How to use Node.js and Express to build a RESTful API.
4.  **Database Management**: How to design and manage a relational database.
5.  **Authentication & Authorization**: How to implement a secure authentication and authorization system.
6.  **Software Architecture**: How to design a scalable and maintainable application.

---

## 🚀 Next Steps / Enhancements

- [ ] **Real-Time Notifications**: Implement real-time notifications for application status updates and messages.
- [ ] **Advanced Analytics**: Add more advanced analytics and reporting features.
- [ ] **Integration with other systems**: Integrate with other systems, such as the university's student information system.
- [ ] **Mobile App**: Develop a mobile app for students and mentors.
- [ ] **CI/CD Pipeline**: Implement a CI/CD pipeline for automated testing and deployment.

---

## 📧 Contact

**Built by**: [Your Name]
**LinkedIn**: [Your LinkedIn Profile]
**GitHub**: [Your GitHub Profile]

---

## 📄 License

This project is open source and available for educational and portfolio purposes.
