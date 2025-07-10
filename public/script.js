// Global variables
let currentEntity = 'departments';
let currentEditId = null;
let isEditMode = false;
let departments = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadDepartments().then(() => {
        loadData(currentEntity);
    });
});

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Modal close events
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

// API helper functions
async function apiCall(endpoint, method = 'GET', data = null) {
    showLoading(true);
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`/api/${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'An error occurred');
        }

        return result;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    } finally {
        showLoading(false);
    }
}

// Tab switching
function switchTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    currentEntity = tabName;
    loadData(tabName);
}

// Load data based on entity type
async function loadData(entity) {
    try {
        const data = await apiCall(entity);
        renderTable(entity, data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load departments for dropdowns
async function loadDepartments() {
    try {
        departments = await apiCall('departments');
        populateDepartmentDropdowns();
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}

// Populate department dropdowns
function populateDepartmentDropdowns() {
    const dropdowns = ['prof-department', 'student-department', 'book-department'];
    dropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            dropdown.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
        });
    });
}

// Render table based on entity type
function renderTable(entity, data) {
    const tableBody = document.querySelector(`#${entity}-table tbody`);
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" style="text-align: center; padding: 40px; color: #6c757d;">
                    <i class="fas fa-inbox" style="font-size: 3em; margin-bottom: 15px; display: block;"></i>
                    No ${entity} found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        const row = createTableRow(entity, item);
        tableBody.appendChild(row);
    });
}

// Create table row based on entity type
function createTableRow(entity, item) {
    const row = document.createElement('tr');
    
    switch (entity) {
        case 'departments':
            row.innerHTML = `
                <td><strong>${item.name}</strong></td>
                <td>${item.description || '-'}</td>
                <td>${item.building || '-'}</td>
                <td>${item.phone || '-'}</td>
                <td class="actions">
                    <button class="btn btn-warning" onclick="editItem('departments', ${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteItem('departments', ${item.id}, '${item.name}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            break;
        case 'professors':
            row.innerHTML = `
                <td><strong>${item.first_name} ${item.last_name}</strong></td>
                <td>${item.email}</td>
                <td>${item.department_name || '-'}</td>
                <td>${item.title || '-'}</td>
                <td>${item.office || '-'}</td>
                <td class="actions">
                    <button class="btn btn-warning" onclick="editItem('professors', ${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteItem('professors', ${item.id}, '${item.first_name} ${item.last_name}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            break;
        case 'students':
            row.innerHTML = `
                <td><strong>${item.student_id}</strong></td>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.email}</td>
                <td>${item.department_name || '-'}</td>
                <td>${item.gpa ? item.gpa.toFixed(2) : '-'}</td>
                <td class="actions">
                    <button class="btn btn-warning" onclick="editItem('students', ${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteItem('students', ${item.id}, '${item.first_name} ${item.last_name}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            break;
        case 'books':
            row.innerHTML = `
                <td><strong>${item.isbn}</strong></td>
                <td>${item.title}</td>
                <td>${item.author}</td>
                <td>${item.department_name || '-'}</td>
                <td>$${item.price ? item.price.toFixed(2) : '0.00'}</td>
                <td>${item.quantity || 0}</td>
                <td class="actions">
                    <button class="btn btn-warning" onclick="editItem('books', ${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteItem('books', ${item.id}, '${item.title}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            break;
    }
    
    return row;
}

// Show add form
function showAddForm(entity) {
    isEditMode = false;
    currentEditId = null;
    currentEntity = entity;
    
    document.getElementById('modal-title').textContent = `Add ${entity.slice(0, -1).charAt(0).toUpperCase() + entity.slice(1, -1)}`;
    
    // Hide all forms
    document.querySelectorAll('.form-content').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show relevant form
    let formId;
    if (entity === 'departments') {
        formId = 'department-form';
    } else if (entity === 'professors') {
        formId = 'professor-form';
    } else if (entity === 'students') {
        formId = 'student-form';
    } else {
        formId = 'book-form';
    }
    
    document.getElementById(formId).style.display = 'block';
    
    // Clear form
    clearForm(formId);
    
    showModal();
}

// Edit item
async function editItem(entity, id) {
    try {
        const item = await apiCall(`${entity}/${id}`);
        
        isEditMode = true;
        currentEditId = id;
        currentEntity = entity;
        
        document.getElementById('modal-title').textContent = `Edit ${entity.slice(0, -1).charAt(0).toUpperCase() + entity.slice(1, -1)}`;
        
        // Hide all forms
        document.querySelectorAll('.form-content').forEach(form => {
            form.style.display = 'none';
        });
        
        // Show relevant form
        let formId;
        if (entity === 'departments') {
            formId = 'department-form';
        } else if (entity === 'professors') {
            formId = 'professor-form';
        } else if (entity === 'students') {
            formId = 'student-form';
        } else {
            formId = 'book-form';
        }
        
        document.getElementById(formId).style.display = 'block';
        
        // Fill form with data
        fillForm(formId, item);
        
        showModal();
    } catch (error) {
        console.error('Error loading item for edit:', error);
    }
}

// Fill form with data
function fillForm(formId, data) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const fieldName = input.name;
        if (data[fieldName] !== undefined) {
            if (input.type === 'date') {
                // Format date for input
                if (data[fieldName]) {
                    const date = new Date(data[fieldName]);
                    input.value = date.toISOString().split('T')[0];
                }
            } else {
                input.value = data[fieldName] || '';
            }
        }
    });
}

// Clear form
function clearForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}

// Submit form
async function submitForm() {
    let formId;
    if (currentEntity === 'departments') {
        formId = 'department-form';
    } else if (currentEntity === 'professors') {
        formId = 'professor-form';
    } else if (currentEntity === 'students') {
        formId = 'student-form';
    } else {
        formId = 'book-form';
    }
    
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '') {
            data[key] = value;
        }
    }
    
    // Validate required fields
    if (!validateForm(currentEntity, data)) {
        return;
    }
    
    try {
        if (isEditMode) {
            await apiCall(`${currentEntity}/${currentEditId}`, 'PUT', data);
            showToast(`${currentEntity.slice(0, -1)} updated successfully!`, 'success');
        } else {
            await apiCall(currentEntity, 'POST', data);
            showToast(`${currentEntity.slice(0, -1)} created successfully!`, 'success');
        }
        
        closeModal();
        loadData(currentEntity);
        
        // Reload departments if we modified departments
        if (currentEntity === 'departments') {
            await loadDepartments();
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

// Validate form
function validateForm(entity, data) {
    const requiredFields = {
        departments: ['name'],
        professors: ['first_name', 'last_name', 'email'],
        students: ['student_id', 'first_name', 'last_name', 'email'],
        books: ['isbn', 'title', 'author']
    };
    
    const required = requiredFields[entity] || [];
    
    for (let field of required) {
        if (!data[field]) {
            showToast(`${field.replace('_', ' ')} is required`, 'error');
            return false;
        }
    }
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Delete item
async function deleteItem(entity, id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
        return;
    }
    
    try {
        await apiCall(`${entity}/${id}`, 'DELETE');
        showToast(`${entity.slice(0, -1)} deleted successfully!`, 'success');
        loadData(entity);
        
        // Reload departments if we deleted a department
        if (entity === 'departments') {
            await loadDepartments();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Modal functions
function showModal() {
    document.getElementById('modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset form state
    isEditMode = false;
    currentEditId = null;
}

// Loading indicator
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatCurrency(amount) {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}