
# StudyNest – Student Study Planner

## 1. Introduction
StudyNest is a simple web-based study planner that helps students organize their tasks, track completed work, and manage their study activities efficiently.

## 2. Objectives
- Organize daily study tasks.
- Track completed and pending tasks.
- Filter tasks by status.
- Save tasks even after refreshing the page.
- Demonstrate Git, GitHub, and Continuous Integration using GitHub Actions.

## 3. Technologies Used
- HTML – Website structure
- CSS – Styling and responsive layout
- JavaScript – Task management and interactivity
- Local Storage – Saving tasks in the browser
- Git – Version control
- GitHub – Source code hosting
- GitHub Actions – Automated CI workflow

## 4. Features
- Add new study tasks.
- Mark tasks as completed.
- Delete tasks.
- Filter all, pending, and completed tasks.
- View total, completed, and remaining task counts.
- Preserve tasks after refreshing the browser.

## 5. How to Run the Project
1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Add and manage your study tasks.

No additional software installation is required to run the website.

## 6. Git and GitHub Workflow
1. Initialize Git in the project folder.
2. Track changes using `git add`.
3. Save changes using `git commit`.
4. Push commits to GitHub using `git push`.
5. Maintain the project on the `main` branch.

## 7. DevOps Integration – Continuous Integration
StudyNest uses GitHub Actions to automatically check essential project files whenever code is pushed to the `main` branch or a pull request targets `main`.

The workflow is defined in `.github/workflows/ci.yml`.

### CI Workflow Steps
1. Check out the repository.
2. Verify that `index.html` exists.
3. Verify that `style.css` exists.
4. Verify that `script.js` exists.
5. Report success if all required files are present.

### CI Result
The GitHub Actions workflow executed successfully. The `check-website` job completed with a successful status.

## 8. Development History
- Initial StudyNest website setup.
- Added task filters for pending and completed tasks.
- Added GitHub Actions CI workflow.

## 9. Conclusion
StudyNest demonstrates basic web development, version control, collaborative code hosting, and automated Continuous Integration. The project shows how GitHub Actions can automatically validate essential files after code changes.
