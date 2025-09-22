// Viglet Search JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Form validation enhancement
    const forms = document.querySelectorAll('form[novalidate]');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
    
    // Add loading state to buttons on form submit
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const form = button.closest('form');
            if (form && form.checkValidity()) {
                button.classList.add('loading');
                button.disabled = true;
                
                // Re-enable button after 10 seconds as fallback
                setTimeout(function() {
                    button.classList.remove('loading');
                    button.disabled = false;
                }, 10000);
            }
        });
    });
    
    // Search form enhancements
    const searchForms = document.querySelectorAll('form[action*="/search"]');
    searchForms.forEach(function(form) {
        const queryInput = form.querySelector('input[name="query"]');
        const categoryInput = form.querySelector('input[name="category"]');
        const authorInput = form.querySelector('input[name="author"]');
        
        // Clear empty fields before submit to clean up URL
        form.addEventListener('submit', function() {
            if (queryInput && !queryInput.value.trim()) {
                queryInput.disabled = true;
            }
            if (categoryInput && !categoryInput.value.trim()) {
                categoryInput.disabled = true;
            }
            if (authorInput && !authorInput.value.trim()) {
                authorInput.disabled = true;
            }
        });
    });
    
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(function(textarea) {
        function resizeTextarea() {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }
        
        textarea.addEventListener('input', resizeTextarea);
        // Initial resize
        resizeTextarea();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl+/ or Cmd+/ to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            const searchInput = document.querySelector('input[name="query"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl+N or Cmd+N to add new content (when not in input)
        if ((event.ctrlKey || event.metaKey) && event.key === 'n' && 
            !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
            event.preventDefault();
            const newContentLink = document.querySelector('a[href="/content/new"]');
            if (newContentLink) {
                window.location.href = newContentLink.href;
            }
        }
    });
    
    // Tooltip initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Toast notifications
    const toastElList = [].slice.call(document.querySelectorAll('.toast'));
    const toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach(toast => toast.show());
    
    // Confirmation dialogs for dangerous actions
    const dangerousButtons = document.querySelectorAll('[data-confirm]');
    dangerousButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            const message = button.getAttribute('data-confirm');
            if (!confirm(message)) {
                event.preventDefault();
                return false;
            }
        });
    });
    
    // Search result highlighting enhancement
    function enhanceSearchHighlighting() {
        const highlights = document.querySelectorAll('mark');
        highlights.forEach(function(highlight) {
            highlight.addEventListener('mouseenter', function() {
                // Add subtle animation or effect
                this.style.backgroundColor = '#ffd700';
            });
            
            highlight.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#fff3cd';
            });
        });
    }
    
    enhanceSearchHighlighting();
    
    // Table row click handlers for better UX
    const tableRows = document.querySelectorAll('.table tbody tr[data-href]');
    tableRows.forEach(function(row) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(event) {
            // Don't navigate if clicking on a button or link
            if (event.target.closest('button, a')) {
                return;
            }
            
            const href = row.getAttribute('data-href');
            if (href) {
                window.location.href = href;
            }
        });
    });
    
    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'btn btn-primary btn-sm position-fixed';
    scrollToTopBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1050; display: none; border-radius: 50%; width: 40px; height: 40px;';
    scrollToTopBtn.title = 'Scroll to top';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Performance: Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(function(img) {
            img.src = img.dataset.src;
        });
    }
    
    console.log('Viglet Search application initialized');
});