// Mock employee data that would come from Freemarker
const mockEmployeeData = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', department: 'Engineering', role: 'Developer' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', department: 'Marketing', role: 'Manager' },
    { id: 3, firstName: 'Robert', lastName: 'Johnson', email: 'robert.j@example.com', department: 'HR', role: 'Manager' },
    { id: 4, firstName: 'Emily', lastName: 'Williams', email: 'emily.w@example.com', department: 'Finance', role: 'Analyst' },
    { id: 5, firstName: 'Michael', lastName: 'Brown', email: 'michael.b@example.com', department: 'Engineering', role: 'Developer' },
    { id: 6, firstName: 'Sarah', lastName: 'Davis', email: 'sarah.d@example.com', department: 'Marketing', role: 'Designer' },
    { id: 7, firstName: 'David', lastName: 'Miller', email: 'david.m@example.com', department: 'Engineering', role: 'Developer' },
    { id: 8, firstName: 'Lisa', lastName: 'Wilson', email: 'lisa.w@example.com', department: 'HR', role: 'Analyst' },
    { id: 9, firstName: 'James', lastName: 'Moore', email: 'james.m@example.com', department: 'Finance', role: 'Manager' },
    { id: 10, firstName: 'Jennifer', lastName: 'Taylor', email: 'jennifer.t@example.com', department: 'Engineering', role: 'Designer' },
    { id: 11, firstName: 'Thomas', lastName: 'Anderson', email: 'thomas.a@example.com', department: 'Marketing', role: 'Analyst' },
    { id: 12, firstName: 'Patricia', lastName: 'Thomas', email: 'patricia.t@example.com', department: 'HR', role: 'Manager' }
];

// Global variables
let employees = [...mockEmployeeData];
let currentPage = 1;
let itemsPerPage = 10;
let sortField = 'firstName';
let sortDirection = 'asc';
let filters = {
    firstName: '',
    department: '',
    role: ''
};
let currentEmployeeId = null;

// DOM Elements
const employeeGrid = document.getElementById('employeeGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtn = document.getElementById('filterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const firstNameFilter = document.getElementById('firstNameFilter');
const departmentFilter = document.getElementById('departmentFilter');
const roleFilter = document.getElementById('roleFilter');
const sortSelect = document.getElementById('sortSelect');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const employeeModal = document.getElementById('employeeModal');
const confirmModal = document.getElementById('confirmModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const employeeIdInput = document.getElementById('employeeId');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const roleInput = document.getElementById('role');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderEmployees();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filter sidebar
    filterBtn.addEventListener('click', () => filterSidebar.classList.add('active'));
    closeFilterBtn.addEventListener('click', () => filterSidebar.classList.remove('active'));
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);

    // Sorting
    sortSelect.addEventListener('change', handleSortChange);

    // Pagination
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        currentPage = 1;
        renderEmployees();
    });
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);

    // Modals
    document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Employee form
    employeeForm.addEventListener('submit', handleFormSubmit);
    addEmployeeBtn.addEventListener('click', openAddEmployeeModal);

    // Event delegation for edit/delete buttons
    employeeGrid.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const employeeId = parseInt(e.target.closest('.edit-btn').dataset.id);
            openEditEmployeeModal(employeeId);
        } else if (e.target.closest('.delete-btn')) {
            const employeeId = parseInt(e.target.closest('.delete-btn').dataset.id);
            openDeleteConfirmationModal(employeeId);
        }
    });

    confirmDeleteBtn.addEventListener('click', deleteEmployee);
}

// Employee rendering
function renderEmployees() {
    // Get filtered, sorted, and paginated employees
    const filteredEmployees = filterEmployees();
    const sortedEmployees = sortEmployees(filteredEmployees);
    const paginatedEmployees = paginateEmployees(sortedEmployees);

    // Clear current grid
    employeeGrid.innerHTML = '';

    // Render employees (simulating Freemarker template)
    if (paginatedEmployees.length === 0) {
        employeeGrid.innerHTML = '<div class="no-results">No employees found matching your criteria.</div>';
        return;
    }

    paginatedEmployees.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'employee-card';
        employeeCard.dataset.id = employee.id;
        employeeCard.innerHTML = `
            <div class="employee-info">
                <div class="employee-id">ID: ${employee.id}</div>
                <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
                <div class="employee-email">${employee.email}</div>
                <div class="employee-department">${employee.department}</div>
                <div class="employee-role">${employee.role}</div>
            </div>
            <div class="employee-actions">
                <button class="edit-btn" data-id="${employee.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" data-id="${employee.id}"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        employeeGrid.appendChild(employeeCard);
    });

    // Update pagination controls
    updatePaginationControls(filteredEmployees.length);
}

// Filtering
function filterEmployees() {
    return employees.filter(employee => {
        const matchesFirstName = employee.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
        const matchesDepartment = filters.department === '' || employee.department === filters.department;
        const matchesRole = filters.role === '' || employee.role === filters.role;
        
        return matchesFirstName && matchesDepartment && matchesRole;
    });
}

function applyFilters() {
    filters = {
        firstName: firstNameFilter.value,
        department: departmentFilter.value,
        role: roleFilter.value
    };
    currentPage = 1;
    renderEmployees();
    filterSidebar.classList.remove('active');
}

function resetFilters() {
    firstNameFilter.value = '';
    departmentFilter.value = '';
    roleFilter.value = '';
    filters = {
        firstName: '',
        department: '',
        role: ''
    };
    currentPage = 1;
    renderEmployees();
}

function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === '') {
        renderEmployees();
        return;
    }

    const filtered = employees.filter(employee => 
        employee.firstName.toLowerCase().includes(searchTerm) || 
        employee.lastName.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm)
    );

    employeeGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        employeeGrid.innerHTML = '<div class="no-results">No employees found matching your search.</div>';
        return;
    }

    filtered.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'employee-card';
        employeeCard.dataset.id = employee.id;
        employeeCard.innerHTML = `
            <div class="employee-info">
                <div class="employee-id">ID: ${employee.id}</div>
                <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
                <div class="employee-email">${employee.email}</div>
                <div class="employee-department">${employee.department}</div>
                <div class="employee-role">${employee.role}</div>
            </div>
            <div class="employee-actions">
                <button class="edit-btn" data-id="${employee.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" data-id="${employee.id}"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        employeeGrid.appendChild(employeeCard);
    });

    // Reset pagination for search results
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    pageInfo.textContent = `Showing all ${filtered.length} results`;
}

// Sorting
function handleSortChange() {
    const [field, direction] = sortSelect.value.split('-');
    sortField = field;
    sortDirection = direction;
    renderEmployees();
}

function sortEmployees(employeeList) {
    return [...employeeList].sort((a, b) => {
        const valueA = a[sortField].toString().toLowerCase();
        const valueB = b[sortField].toString().toLowerCase();
        
        if (sortDirection === 'asc') {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    });
}

// Pagination
function paginateEmployees(employeeList) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return employeeList.slice(startIndex, startIndex + itemsPerPage);
}

function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageInfo.textContent = totalPages > 0 
        ? `Page ${currentPage} of ${totalPages} (${totalItems} total employees)` 
        : 'No employees found';
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderEmployees();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(filterEmployees().length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderEmployees();
    }
}

// Modal functions
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    resetFormErrors();
}

function openAddEmployeeModal() {
    modalTitle.textContent = 'Add New Employee';
    employeeIdInput.value = '';
    employeeForm.reset();
    openModal(employeeModal);
}

function openEditEmployeeModal(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    modalTitle.textContent = 'Edit Employee';
    employeeIdInput.value = employee.id;
    firstNameInput.value = employee.firstName;
    lastNameInput.value = employee.lastName;
    emailInput.value = employee.email;
    departmentInput.value = employee.department;
    roleInput.value = employee.role;
    
    openModal(employeeModal);
}

function openDeleteConfirmationModal(employeeId) {
    currentEmployeeId = employeeId;
    openModal(confirmModal);
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    resetFormErrors();

    const formData = {
        id: employeeIdInput.value ? parseInt(employeeIdInput.value) : null,
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value,
        role: roleInput.value.trim()
    };

    // Validate form
    let isValid = true;

    if (!formData.firstName) {
        document.getElementById('firstNameError').textContent = 'First name is required';
        isValid = false;
    }

    if (!formData.lastName) {
        document.getElementById('lastNameError').textContent = 'Last name is required';
        isValid = false;
    }

    if (!formData.email) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        isValid = false;
    }

    if (!formData.department) {
        document.getElementById('departmentError').textContent = 'Department is required';
        isValid = false;
    }

    if (!formData.role) {
        document.getElementById('roleError').textContent = 'Role is required';
        isValid = false;
    }

    if (!isValid) return;

    // Check if email already exists (for new employees or when email is changed)
    const emailExists = employees.some(emp => 
        emp.email.toLowerCase() === formData.email.toLowerCase() && 
        (!formData.id || emp.id !== formData.id)
    );

    if (emailExists) {
        document.getElementById('emailError').textContent = 'Email already exists';
        return;
    }

    // Save employee
    if (formData.id) {
        // Update existing employee
        const index = employees.findIndex(e => e.id === formData.id);
        if (index !== -1) {
            employees[index] = formData;
        }
    } else {
        // Add new employee
        const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        formData.id = newId;
        employees.push(formData);
    }

    renderEmployees();
    closeModal();
}

function resetFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Employee deletion
function deleteEmployee() {
    employees = employees.filter(e => e.id !== currentEmployeeId);
    renderEmployees();
    closeModal();
    currentEmployeeId = null;
}