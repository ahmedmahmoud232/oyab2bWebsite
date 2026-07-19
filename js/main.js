document.addEventListener('DOMContentLoaded', () => {
    // Theme Manager
    const themeToggleBtn = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        } else {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        }
    }

    // Responsive Mobile Navbar
    const mobileMenuOpenBtn = document.getElementById('mobileMenuOpen');
    const mobileMenuCloseBtn = document.getElementById('mobileMenuClose');
    const mobileNavPanel = document.getElementById('mobileNavPanel');
    const overlay = document.getElementById('overlay');

    if (mobileMenuOpenBtn && mobileNavPanel && overlay) {
        mobileMenuOpenBtn.addEventListener('click', () => {
            mobileNavPanel.classList.add('active');
            overlay.classList.add('active');
        });
    }

    const closeNav = () => {
        if (mobileNavPanel && overlay) {
            mobileNavPanel.classList.remove('active');
            overlay.classList.remove('active');
        }
    };

    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', closeNav);
    }
    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }

    // Live Product Search and Categorization Filter
    const searchInput = document.getElementById('productSearchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card-asymmetric');

    let activeCategory = 'all';
    let searchQuery = '';

    const filterProducts = () => {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.product-card-title').textContent.toLowerCase();
            const cardDesc = card.querySelector('.product-card-desc').textContent.toLowerCase();

            const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
            const matchesSearch = cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                // Trigger animation fade in
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterProducts();
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-filter');
                filterProducts();
            });
        });
    }

    // Contact Form Validation and Success State
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const phoneInput = document.getElementById('contactPhone');
            const messageInput = document.getElementById('contactMessage');
            
            let errors = [];

            if (nameInput.value.trim().length < 3) {
                errors.push(document.body.dir === 'rtl' ? 'الاسم يجب أن يكون 3 أحرف على الأقل.' : 'Name must be at least 3 characters.');
            }
            if (!validateEmail(emailInput.value)) {
                errors.push(document.body.dir === 'rtl' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
            }
            if (phoneInput.value.trim().length < 8) {
                errors.push(document.body.dir === 'rtl' ? 'رقم الهاتف غير صالح.' : 'Phone number is invalid.');
            }
            if (messageInput.value.trim().length < 10) {
                errors.push(document.body.dir === 'rtl' ? 'الرسالة يجب أن تحتوي على 10 أحرف على الأقل.' : 'Message must be at least 10 characters.');
            }

            if (errors.length > 0) {
                showFeedback(errors.join('<br>'), 'danger');
            } else {
                showFeedback(
                    document.body.dir === 'rtl' 
                        ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' 
                        : 'Your message has been sent successfully! We will contact you soon.', 
                    'success'
                );
                contactForm.reset();
            }
        });
    }

    // RFQ Inquiry Modal popup trigger and logic
    const rfqModalOpenBtns = document.querySelectorAll('.open-rfq-modal');
    const rfqModalOverlay = document.getElementById('rfqModalOverlay');
    const rfqModalCloseBtn = document.getElementById('rfqModalClose');
    const rfqForm = document.getElementById('rfqForm');
    const rfqFeedback = document.getElementById('rfqFeedback');

    if (rfqModalOpenBtns.length > 0 && rfqModalOverlay) {
        rfqModalOpenBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                rfqModalOverlay.classList.add('active');
            });
        });
    }

    if (rfqModalCloseBtn && rfqModalOverlay) {
        rfqModalCloseBtn.addEventListener('click', () => {
            rfqModalOverlay.classList.remove('active');
            if (rfqFeedback) rfqFeedback.style.display = 'none';
        });
    }

    if (rfqForm && rfqFeedback) {
        rfqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const buyerName = document.getElementById('rfqName');
            const buyerEmail = document.getElementById('rfqEmail');
            const quantity = document.getElementById('rfqQty');
            
            let rfqErrors = [];
            if (buyerName.value.trim().length < 3) {
                rfqErrors.push(document.body.dir === 'rtl' ? 'الاسم مطلوب.' : 'Name is required.');
            }
            if (!validateEmail(buyerEmail.value)) {
                rfqErrors.push(document.body.dir === 'rtl' ? 'البريد الإلكتروني غير صحيح.' : 'Invalid email.');
            }
            if (quantity.value <= 0) {
                rfqErrors.push(document.body.dir === 'rtl' ? 'يرجى إدخال كمية صحيحة.' : 'Please enter a valid quantity.');
            }

            if (rfqErrors.length > 0) {
                rfqFeedback.className = 'alert-feedback alert-danger';
                rfqFeedback.innerHTML = rfqErrors.join('<br>');
                rfqFeedback.style.display = 'block';
            } else {
                rfqFeedback.className = 'alert-feedback alert-success';
                rfqFeedback.innerHTML = document.body.dir === 'rtl' 
                    ? 'تم إرسال طلب عرض السعر بنجاح! سيقوم المصنع بالرد عليك.' 
                    : 'Quotation request submitted successfully! The manufacturer will reply soon.';
                rfqFeedback.style.display = 'block';
                rfqForm.reset();
                setTimeout(() => {
                    rfqModalOverlay.classList.remove('active');
                    rfqFeedback.style.display = 'none';
                }, 3000);
            }
        });
    }

    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showFeedback(msg, type) {
        if (!formFeedback) return;
        formFeedback.className = `alert-feedback alert-${type}`;
        formFeedback.innerHTML = msg;
        formFeedback.style.display = 'block';
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
