# Ajacus

# Overview
A responsive employee directory web interface built with HTML, CSS, and JavaScript that simulates Freemarker template rendering. The application allows viewing, searching, filtering, sorting, adding, editing, and deleting employee records with all data stored in memory.

# Features
----> View employees in card or grid layout

----> Search by name or email

----> Filter by first name, department, or role

----> Sort by first name or department

----> Add new employees

----> Edit existing employees

----> Delete employees with confirmation

----> Responsive design for all screen sizes

# Set up and Run Instructions

1. Clone or download the repository

2. The application consists of three files:

    ----> index.html (main HTML file)

    ----> index..css (all styling)

    ----> index.js (all functionality)

3. No build step or dependencies required


**We can Run this application by following simple step**

Simply open index.html in your web browser. All functionality works client-side with no server required.

**Project Structure**

Ajacus-directory/
│
├── index.html          # Main HTML file with structure and simulated Freemarker template
├── index.css           # All CSS styles for the application
└── index.js            # All JavaScript functionality including:
                        # - Data handling
                        # - Rendering
                        # - Event handlers
                        # - Form validation
                        # - Filtering/sorting logic

**Challenges Faced**                 

1. State Management: Handling multiple interdependent states (filters, sorting, pagination) and ensuring the UI updates correctly.

2. Responsive Design: Creating a layout that works well across all device sizes while maintaining usability.

3. Form Validation: Implementing comprehensive validation that provides clear user feedback without being intrusive.

