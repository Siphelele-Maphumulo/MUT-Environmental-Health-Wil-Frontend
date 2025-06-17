# 🌱 Environmental Health WIL System

The **Environmental Health Work-Integrated Learning (WIL) System** is a comprehensive web platform designed to support Environmental Health students, supervisors, and institutions in managing practical work placements, daily logs, and reflective learning efficiently.

🎥 **Demo Preview:** *(Add your video or GIF here)*  


---

## 🧩 Key Features

- ✅ **Role-based Login & Registration** for Students and Personnel
- 📋 **Student Application Form** with file uploads for CV, ID, and Signatures
- 📅 **WIL Logsheet System** – capture daily activities, food control, waste management, etc.
- 🧠 **Student Reflection Module** – description, evaluation, interpretation of practical experiences
- 📌 **Supervisor Section** – Sign logs, verify data, and approve reflections
- 📁 **Document Uploads** – images, scanned signatures, and supporting files
- 📊 **Dashboard Analytics** – overview of student submissions and status

---

## 🛠️ Tech Stack

- **Frontend:** Angular 13 (HTML, SCSS, TypeScript)
- **Backend:** Spring Boot (Java)
- **Database:** MySQL (via phpMyAdmin)
- **Server Environment:** Apache (XAMPP)
- **Deployment:** Localhost or institution intranet

---

## 📁 Folder Structure

environmental-health-wil-frontend/ # Angular Frontend
│
├── src/app/
│ ├── auth/ # Login & Sign-up
│ ├── components/ # Dashboard, Forms, Pages
│ └── services/ # HTTP communication
│
└── backend/environmental-health-wil-api/ # Spring Boot Backend
├── controller/
├── model/
├── repository/
└── service/


## 🚀 Setup Instructions

### 🔹 Backend (Spring Boot)

1. **Create the database**
   ```sql
   CREATE DATABASE environmental_health_wil_db;
Configure application.properties

spring.datasource.url=jdbc:mysql://localhost:3360/environmental_health_wil_db
spring.datasource.username=root
spring.datasource.password=
Run the Spring Boot App


./mvnw spring-boot:run
🔹 Frontend (Angular)
Navigate to the frontend folder

cd environmental-health-wil-frontend
Install dependencies

npm install
Run the Angular app

http://localhost:4200
🧪 How It Works
Students fill out the full application form with province selection, personal details, and documents.

Daily logs are recorded per activity (e.g., waste audits, water quality checks).

Reflections are saved and can be signed off by supervisors.

Admins and supervisors can review, approve, or return entries.

🎯 Use Cases
🏥 Municipal Health Practicals

📚 WIL Portfolio Management

🧾 Document Submission & Auditing

🤝 Supervisor-Student Collaboration

📌 Screenshots
![Environmental Health](https://github.com/user-attachments/assets/cfa9ab0b-0b03-4d79-bf0b-3d856ce2d8a7)




💡 Planned Features
⏳ Supervisor feedback comments

📑 PDF export of logs and reflections

✉️ Email notifications on submissions

🔒 JWT-based authentication

🌐 Deployable to university cloud platforms

🙌 Contributing
Want to help? Submit a pull request or open an issue for bugs, improvements, or new features.

📫 Contact
Siphelele Maphumulo
📧 Siphelelemaphumulo@gmail.com
🔗 LinkedIn

📝 License
This project is licensed under the MIT License.



# WilSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
