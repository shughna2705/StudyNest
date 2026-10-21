# StudyNest – Student Study Planner

StudyNest is a web-based study planner designed to help students organize study tasks, manage focus sessions, track distractions, and monitor their productivity through a simple dashboard.

## 1. Introduction

StudyNest provides a single place to manage study activities and build better study habits. It combines task management, a Pomodoro-style focus timer, distraction tracking, and study analytics in a clean, user-friendly interface.

The project also demonstrates version control and Continuous Integration (CI) using Git, GitHub, and GitHub Actions.

## 2. Objectives

- Organize daily study tasks efficiently.
- Track completed and pending tasks.
- Manage focused study sessions using a Pomodoro timer.
- Record distractions and estimate time lost.
- Monitor study activity through an analytics dashboard.
- Store data locally in the browser.
- Demonstrate version control and automated CI checks.

## 3. Technologies Used

- **HTML** – Website structure.
- **CSS** – Styling and responsive layout.
- **JavaScript** – Application logic and interactivity.
- **Browser Local Storage** – Persisting tasks, sessions, and distraction records.
- **Git** – Version control.
- **GitHub** – Source code hosting and project management.
- **GitHub Actions** – Automated Continuous Integration workflow.

## 4. Features

### Task Manager
- Add new study tasks.
- Mark tasks as completed or pending.
- Delete tasks.
- Filter tasks by all, pending, and completed status.
- View task counts and retain saved tasks after refreshing the page.

### Focus Lab
- Use a Pomodoro-style timer for focused study sessions.
- Track completed focus sessions.
- Save session information locally for productivity tracking.

### Distraction Tracker
- Record study interruptions and distraction details.
- Track interruption counts and estimated time lost.
- Store distraction records in the browser.

### Study Analytics
- View completed task counts and task completion rate.
- Track completed focus sessions.
- Monitor recorded interruptions and estimated distraction time.
- Explore a seven-day activity chart and productivity insights based on available dated records.

### Data Persistence
- Store supported application data using browser Local Storage.
- Retain saved records across browser refreshes on the same browser and origin.

## 5. How to Run the Project

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code or another editor.
3. Open `index.html` in a web browser.
4. Start adding tasks and exploring the available features.

No additional software installation or backend server is required for the basic application.

## 6. Git and GitHub Workflow

The project uses Git for version control and GitHub for source code hosting.

Typical workflow commands:

```bash
git status
git add .
git commit -m "Describe your changes"
git push origin main
```

Feature development can also be performed on separate branches before merging changes into `main`.

## 7. DevOps Integration – Continuous Integration

StudyNest uses GitHub Actions to automatically validate essential project files when code is pushed to `main` or a pull request targets `main`, according to the workflow configuration.

Workflow file: `.github/workflows/ci.yml`

### CI Workflow Steps

1. Check out the repository.
2. Verify that `index.html` exists.
3. Verify that `style.css` exists.
4. Verify that `script.js` exists.
5. Complete the workflow successfully when the required files are present.

### CI Result

The GitHub Actions workflow completed successfully on the `main` branch.

The current workflow checks essential file presence. It does not replace manual browser testing or automated functional tests.

## 8. Screenshots

Screenshots of the running application will be added below to demonstrate its interface and features.

### Main Dashboard
![StudyNest Main Dashboard](screenshots/dashboard.png)

### Focus Lab
![StudyNest Focus Lab](screenshots/focus-lab.png)

### Distraction Tracker
![StudyNest Distraction Tracker](screenshots/distraction-tracker.png)

### Study Analytics
![StudyNest Study Analytics](screenshots/study-analytics.png)

## 9. Development History

- Created the initial StudyNest website.
- Implemented task creation, completion, deletion, and filtering.
- Added browser-based data persistence.
- Developed the Focus Lab Pomodoro timer.
- Implemented the Distraction Tracker.
- Added the Study Analytics dashboard.
- Integrated GitHub Actions for Continuous Integration.
- Merged the completed feature branch into `main` and verified a successful CI run.

## 10. Conclusion

StudyNest demonstrates the practical application of front-end web development, browser-based data persistence, version control, and Continuous Integration. It combines useful study-management tools with productivity tracking while providing hands-on experience with a basic DevOps workflow.
