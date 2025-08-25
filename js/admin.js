// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

let carouselItemCount = 6; // Default number of items

function initializeAdmin() {
    // Setup image preview for slider
    setupSliderPreview();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup auto-save (optional)
    setupAutoSave();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Update carousel item count
    updateCarouselItemCount();
    
    console.log('Admin panel initialized successfully');
}

// Slider Image Preview
function setupSliderPreview() {
    const sliderInput = document.getElementById('slider_image');
    const sliderPreview = document.getElementById('slider_preview');
    
    if (sliderInput && sliderPreview) {
        sliderInput.addEventListener('input', function() {
            const imageUrl = this.value.trim();
            if (imageUrl) {
                sliderPreview.src = imageUrl;
            } else {
                sliderPreview.src = 'https://placehold.co/400x200?text=Image+Preview';
            }
        });
    }
}

// Add New Carousel Item
function addCarouselItem() {
    const container = document.getElementById('carousel-items');
    const newIndex = carouselItemCount;
    
    const itemHTML = `
        <div class="carousel-item" data-index="${newIndex}">
            <div class="item-header">
                <h3>Item ${newIndex + 1}</h3>
                <button type="button" class="remove-item" onclick="removeCarouselItem(${newIndex})">Remove</button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Image URL:</label>
                    <input type="url" 
                           name="carousel_items[${newIndex}][image]" 
                           placeholder="https://example.com/image.jpg"
                           onchange="updateItemPreview(${newIndex})"
                           required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Title:</label>
                    <input type="text" 
                           name="carousel_items[${newIndex}][title]" 
                           placeholder="Service Title"
                           required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Description:</label>
                    <textarea name="carousel_items[${newIndex}][description]" 
                              placeholder="Service Description"
                              required></textarea>
                </div>
            </div>
            
            <div class="item-preview">
                <img src="https://placehold.co/200x150?text=Preview" 
                     alt="Preview"
                     id="preview_${newIndex}">
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', itemHTML);
    carouselItemCount++;
    
    // Animate the new item
    const newItem = container.lastElementChild;
    newItem.style.opacity = '0';
    newItem.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        newItem.style.transition = 'all 0.3s ease';
        newItem.style.opacity = '1';
        newItem.style.transform = 'translateY(0)';
    }, 10);
    
    // Scroll to new item
    newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Remove Carousel Item
function removeCarouselItem(index) {
    const item = document.querySelector(`[data-index="${index}"]`);
    if (item) {
        // Confirm deletion
        if (confirm('Are you sure you want to remove this item?')) {
            // Animate removal
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                item.remove();
                updateItemNumbers();
            }, 300);
        }
    }
}

// Update Item Numbers after removal
function updateItemNumbers() {
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
        const header = item.querySelector('.item-header h3');
        if (header) {
            header.textContent = `Item ${index + 1}`;
        }
        item.setAttribute('data-index', index);
    });
}

// Update Item Preview
function updateItemPreview(index) {
    const imageInput = document.querySelector(`input[name="carousel_items[${index}][image]"]`);
    const preview = document.getElementById(`preview_${index}`);
    
    if (imageInput && preview) {
        const imageUrl = imageInput.value.trim();
        if (imageUrl) {
            preview.src = imageUrl;
            preview.alt = 'Item Preview';
        } else {
            preview.src = 'https://placehold.co/200x150?text=Preview';
            preview.alt = 'Preview';
        }
    }
}

// Update Carousel Item Count
function updateCarouselItemCount() {
    const items = document.querySelectorAll('.carousel-item');
    carouselItemCount = items.length;
}

// Form Validation
function setupFormValidation() {
    const form = document.querySelector('.admin-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                showMessage('Please fill in all required fields correctly.', 'error');
            } else {
                showLoadingState();
            }
        });
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--admin-gray-300)';
        }
        
        // Validate URLs
        if (field.type === 'url' && field.value.trim()) {
            try {
                new URL(field.value);
                field.style.borderColor = 'var(--admin-gray-300)';
            } catch {
                field.style.borderColor = 'var(--error-color)';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Show Loading State
function showLoadingState() {
    const submitBtn = document.querySelector('.update-btn');
    if (submitBtn) {
        submitBtn.textContent = 'Updating...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    }
}

// Show Message
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert after admin header
    const adminHeader = document.querySelector('.admin-header');
    if (adminHeader) {
        adminHeader.insertAdjacentElement('afterend', messageDiv);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 5000);
    }
}

// Auto-save functionality (optional)
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea');
    let autoSaveTimeout;
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                saveToLocalStorage();
            }, 2000); // Save after 2 seconds of inactivity
        });
    });
    
    // Load from localStorage on page load
    loadFromLocalStorage();
}

function saveToLocalStorage() {
    const formData = new FormData(document.querySelector('.admin-form'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('grow_admin_draft', JSON.stringify(data));
    console.log('Draft saved to localStorage');
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('grow_admin_draft');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Only load if form is empty (new session)
            const sliderInput = document.getElementById('slider_image');
            if (sliderInput && !sliderInput.value) {
                Object.keys(data).forEach(key => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                });
                
                showMessage('Draft loaded from previous session', 'info');
            }
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

// Clear draft after successful submission
function clearDraft() {
    localStorage.removeItem('grow_admin_draft');
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const form = document.querySelector('.admin-form');
            if (form) {
                form.requestSubmit();
            }
        }
        
        // Ctrl/Cmd + N to add new item
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            addCarouselItem();
        }
        
        // Escape to cancel any ongoing action
        if (e.key === 'Escape') {
            const loadingBtn = document.querySelector('.update-btn:disabled');
            if (loadingBtn) {
                loadingBtn.disabled = false;
                loadingBtn.textContent = 'Update Content';
                loadingBtn.style.opacity = '1';
            }
        }
    });
}

// Image Upload Handler (if you want to add file upload functionality)
function handleImageUpload(inputElement, previewElement) {
    const file = inputElement.files[0];
    if (file) {
        // Check file type
        if (!file.type.startsWith('image/')) {
            showMessage('Please select a valid image file.', 'error');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showMessage('Image file size should be less than 5MB.', 'error');
            return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export data functionality
function exportData() {
    const formData = new FormData(document.querySelector('.admin-form'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'grow-content-backup.json';
    link.click();
}

// Import data functionality
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // Populate form with imported data
                Object.keys(data).forEach(key => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                });
                
                showMessage('Data imported successfully!', 'success');
            } catch (error) {
                showMessage('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Real-time character counter for textareas
function setupCharacterCounters() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        if (maxLength) {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.fontSize = '0.8rem';
            counter.style.color = 'var(--admin-gray-500)';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '5px';
            
            textarea.parentNode.appendChild(counter);
            
            const updateCounter = () => {
                const remaining = maxLength - textarea.value.length;
                counter.textContent = `${remaining} characters remaining`;
                
                if (remaining < 20) {
                    counter.style.color = 'var(--error-color)';
                } else {
                    counter.style.color = 'var(--admin-gray-500)';
                }
            };
            
            textarea.addEventListener('input', updateCounter);
            updateCounter(); // Initial count
        }
    });
}

// Initialize character counters when DOM is ready
document.addEventListener('DOMContentLoaded', setupCharacterCounters);

// Confirmation before leaving page with unsaved changes
let hasUnsavedChanges = false;

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            hasUnsavedChanges = true;
        });
    });
    
    const form = document.querySelector('.admin-form');
    if (form) {
        form.addEventListener('submit', () => {
            hasUnsavedChanges = false;
        });
    }
});

window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Console welcome message
console.log(`
🔧 GROW Admin Panel
📊 Content Management System
🎨 Built with PHP, JavaScript, and CSS
⚡ Ready to manage your content!

Keyboard Shortcuts:
- Ctrl/Cmd + S: Save form
- Ctrl/Cmd + N: Add new carousel item
- Escape: Cancel current action
`);
