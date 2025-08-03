// Main JavaScript for Pima Diabetes Prediction System

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize form validations
    initializeFormValidations();
    
    // Initialize API request handlers
    initializeAPIHandlers();
    
    // Add loading states to buttons
    initializeLoadingStates();
    
    // Initialize file upload handlers
    initializeFileUpload();
});

// Initialize Bootstrap tooltips
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Form validation functions
function initializeFormValidations() {
    // Add real-time validation to prediction form
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        const inputs = predictionForm.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }
}

// Validate individual form field
function validateField(field) {
    const value = parseFloat(field.value);
    const min = parseFloat(field.min);
    const max = parseFloat(field.max);
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is empty
    if (!field.value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Check range validation
    else if (!isNaN(min) && value < min) {
        isValid = false;
        errorMessage = `Value must be at least ${min}`;
    }
    else if (!isNaN(max) && value > max) {
        isValid = false;
        errorMessage = `Value must be at most ${max}`;
    }
    // Special validations for specific fields
    else if (field.name === 'BMI' && (value < 10 || value > 70)) {
        isValid = false;
        errorMessage = 'BMI must be between 10 and 70';
    }
    else if (field.name === 'Age' && (value < 18 || value > 120)) {
        isValid = false;
        errorMessage = 'Age must be between 18 and 120';
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        hideFieldError(field);
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error message
function showFieldError(field, message) {
    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

// Hide field error message
function hideFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Initialize API request handlers
function initializeAPIHandlers() {
    // Handle prediction form submission via AJAX (optional enhancement)
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            // Validate all fields before submission
            const inputs = this.querySelectorAll('input[required]');
            let allValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    allValid = false;
                }
            });
            
            if (!allValid) {
                e.preventDefault();
                showAlert('Please correct the errors in the form', 'danger');
            }
        });
    }
}

// Initialize loading states for buttons
function initializeLoadingStates() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalHTML = submitBtn.innerHTML;
                const loadingText = submitBtn.dataset.loadingText || 'Processing...';
                
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${loadingText}`;
                submitBtn.disabled = true;
                
                // Store original HTML for potential restoration
                submitBtn.dataset.originalHtml = originalHTML;
            }
        });
    });
}

// Initialize file upload enhancements
function initializeFileUpload() {
    const fileInput = document.getElementById('file');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            handleFileSelection(file, this);
        });
        
        // Add drag and drop functionality
        const fileContainer = fileInput.closest('.mb-4');
        if (fileContainer) {
            setupDragAndDrop(fileContainer, fileInput);
        }
    }
}

// Handle file selection and validation
function handleFileSelection(file, input) {
    if (!file) return;
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showAlert('Please select a CSV file', 'danger');
        input.value = '';
        return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showAlert('File size should be less than 10MB', 'danger');
        input.value = '';
        return;
    }
    
    // Show file info
    showFileInfo(file);
    
    // Optional: Preview CSV content
    if (file.size < 1024 * 1024) { // Only for files smaller than 1MB
        previewCSV(file);
    }
}

// Setup drag and drop for file upload
function setupDragAndDrop(container, input) {
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        container.classList.add('border-primary', 'bg-light');
    });
    
    container.addEventListener('dragleave', function(e) {
        e.preventDefault();
        container.classList.remove('border-primary', 'bg-light');
    });
    
    container.addEventListener('drop', function(e) {
        e.preventDefault();
        container.classList.remove('border-primary', 'bg-light');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            handleFileSelection(files[0], input);
        }
    });
}

// Show file information
function showFileInfo(file) {
    let fileInfoDiv = document.getElementById('fileInfo');
    if (!fileInfoDiv) {
        fileInfoDiv = document.createElement('div');
        fileInfoDiv.id = 'fileInfo';
        fileInfoDiv.className = 'mt-2 text-muted';
        document.getElementById('file').parentNode.appendChild(fileInfoDiv);
    }
    
    const fileSize = (file.size / 1024).toFixed(2);
    fileInfoDiv.innerHTML = `
        <i class="fas fa-file-csv me-2"></i>
        <strong>${file.name}</strong> (${fileSize} KB)
        <button type="button" class="btn btn-sm btn-outline-secondary ms-2" onclick="clearFile()">
            <i class="fas fa-times"></i>
        </button>
    `;
}

// Clear selected file
function clearFile() {
    const fileInput = document.getElementById('file');
    if (fileInput) {
        fileInput.value = '';
        const fileInfoDiv = document.getElementById('fileInfo');
        if (fileInfoDiv) {
            fileInfoDiv.remove();
        }
    }
}

// Preview CSV content (for small files)
function previewCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n').slice(0, 6); // First 5 rows + header
        
        if (lines.length > 1) {
            const previewHTML = createCSVPreview(lines);
            showCSVPreview(previewHTML);
        }
    };
    reader.readAsText(file);
}

// Create CSV preview HTML
function createCSVPreview(lines) {
    const headers = lines[0].split(',');
    let html = '<div class="mt-3"><h6>CSV Preview:</h6><div class="table-responsive"><table class="table table-sm table-bordered">';
    
    // Headers
    html += '<thead class="table-light"><tr>';
    headers.forEach(header => {
        html += `<th>${header.trim()}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Data rows
    for (let i = 1; i < lines.length && i <= 5; i++) {
        if (lines[i].trim()) {
            const cells = lines[i].split(',');
            html += '<tr>';
            cells.forEach(cell => {
                html += `<td>${cell.trim()}</td>`;
            });
            html += '</tr>';
        }
    }
    
    html += '</tbody></table></div></div>';
    return html;
}

// Show CSV preview
function showCSVPreview(html) {
    let previewDiv = document.getElementById('csvPreview');
    if (!previewDiv) {
        previewDiv = document.createElement('div');
        previewDiv.id = 'csvPreview';
        previewDiv.className = 'mt-3';
        document.getElementById('file').closest('.card').appendChild(previewDiv);
    }
    previewDiv.innerHTML = html;
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the main container
    const container = document.querySelector('main.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Utility function to format numbers
function formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
}

// Utility function to validate all required fields in a form
function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Sample data functions for testing
function fillSampleData1() {
    const sampleData = {
        'Pregnancies': 6,
        'Glucose': 148,
        'BloodPressure': 72,
        'SkinThickness': 35,
        'Insulin': 0,
        'BMI': 33.6,
        'DiabetesPedigreeFunction': 0.627,
        'Age': 50
    };
    
    fillFormData(sampleData);
}

function fillSampleData2() {
    const sampleData = {
        'Pregnancies': 1,
        'Glucose': 85,
        'BloodPressure': 66,
        'SkinThickness': 29,
        'Insulin': 0,
        'BMI': 26.6,
        'DiabetesPedigreeFunction': 0.351,
        'Age': 31
    };
    
    fillFormData(sampleData);
}

// Fill form with sample data
function fillFormData(data) {
    Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = data[key];
            validateField(field);
        }
    });
}

// API call functions (for future AJAX implementations)
async function makePrediction(data) {
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error making prediction:', error);
        throw error;
    }
}

// Export functions for use in other scripts
window.DiabetesPredictor = {
    validateField,
    showAlert,
    fillSampleData1,
    fillSampleData2,
    makePrediction,
    formatNumber
};
