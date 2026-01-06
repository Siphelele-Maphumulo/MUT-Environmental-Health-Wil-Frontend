# 🌱 Environmental Health WIL Management System

[![Angular](https://img.shields.io/badge/Angular-18+-red.svg)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4+-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-blue.svg)](https://www.mysql.com/)

> **A full-stack web-based information system designed to manage Work-Integrated Learning (WIL) programmes in Environmental Health, supporting students, mentors, and administrators while ensuring regulatory compliance.**

---

## 📘 Introduction & Background

Work-Integrated Learning (WIL) is a mandatory component of Environmental Health qualifications in South Africa. Students are required to complete supervised practical training to meet academic and **HPCSA (Health Professions Council of South Africa)** requirements.

This system provides a centralized digital platform to improve oversight, communication, and compliance throughout the WIL lifecycle.

---

## 🎯 Objectives

- Digitally manage WIL applications and placements  
- Improve communication between students, mentors, and administrators  
- Provide real-time progress tracking and analytics  
- Support institutional compliance with HPCSA requirements  
- Reduce administrative overhead through automation  

---

## 🏗️ System Architecture

### Frontend (Angular)
- Component-based architecture
- Role-based access control (Admin, Mentor, Student)
- Server-side rendering (Angular Universal)
- Responsive UI using Angular Material and Bootstrap

### Backend (Node.js & Express)
- RESTful API
- JWT-based authentication and authorization
- Secure role-based endpoint access

### Database
- MySQL relational database
- Normalized schema with referential integrity

---

## ⚙️ Core Functionalities

### Student Module
- Registration and authentication
- Profile management
- WIL application tracking
- Document uploads
- Mentor communication

### Mentor Module
- Profile management
- Student supervision
- Progress monitoring
- Feedback submission

### Administrator Module
- User and role management
- Application oversight
- Analytics and reporting
- HPCSA compliance monitoring

---

## 🔐 Security

- JWT authentication
- Role-Based Access Control (RBAC)
- Protected frontend routes
- Secure environment configuration

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Angular CLI 18+
- MySQL 8+

### Setup

```bash
git clone https://github.com/your-username/environmental-health-wil-frontend.git
cd environmental-health-wil-frontend
npm install
ng serve
```

Access the application at:
```
http://localhost:4200
```

---

## 🛠️ Technology Stack

- Angular
- Node.js
- Express
- MySQL
- JWT
- Chart.js

---

## 📁 Project Structure

```
environmental-health-wil-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   └── assets/
├── angular.json
├── package.json
└── README.md
```

---

## 🚀 Future Enhancements

- Real-time notifications
- Advanced analytics dashboards
- Mobile application
- CI/CD pipeline

---

## 👤 Author

**Siphelele Maphumulo**  
LinkedIn: https://www.linkedin.com/in/siphelele-maphumulo-52a787355/  
GitHub: https://github.com/Siphelele-Maphumulo/

---

## 📄 License

This project is released under the **MIT License** for educational and portfolio use.
