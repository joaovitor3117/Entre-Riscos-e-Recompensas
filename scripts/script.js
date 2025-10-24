// Optimized JavaScript for Entre Riscos e Recompensas
(function() {
    'use strict';

    // Cache DOM elements
    const elements = {
        currentDate: document.getElementById('current-date'),
        mobileMenuButton: document.getElementById('mobile-menu-button'),
        closeMobileMenuButton: document.getElementById('close-mobile-menu'),
        mobileMenu: document.getElementById('mobile-menu'),
        mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
        header: document.querySelector('header'),
        shareButtons: document.querySelectorAll('.share-button'),
        anchorLinks: document.querySelectorAll('a[href^="#"]'),
        newsletterForm: document.querySelector('#newsletter form')
    };

    // Update current date
    function updateCurrentDate() {
        if (elements.currentDate) {
            const now = new Date();
            const options = {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            };
            elements.currentDate.textContent = now.toLocaleDateString('pt-BR', options);
        }
    }

    // Mobile menu functionality
    function initMobileMenu() {
        if (!elements.mobileMenuButton || !elements.closeMobileMenuButton || 
            !elements.mobileMenu || !elements.mobileMenuOverlay) {
            return;
        }

        function openMobileMenu() {
            elements.mobileMenu.classList.add('active');
            elements.mobileMenuOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            elements.mobileMenu.classList.remove('active');
            elements.mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }

        // Event listeners
        elements.mobileMenuButton.addEventListener('click', openMobileMenu);
        elements.closeMobileMenuButton.addEventListener('click', closeMobileMenu);
        elements.mobileMenuOverlay.addEventListener('click', closeMobileMenu);

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        elements.anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (elements.mobileMenu && elements.mobileMenu.classList.contains('active')) {
                        elements.mobileMenu.classList.remove('active');
                        elements.mobileMenuOverlay.classList.add('hidden');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
    }

    // Header shadow on scroll
    function initHeaderShadow() {
        if (!elements.header) return;

        let ticking = false;
        
        function updateHeader() {
            if (window.scrollY > 0) {
                elements.header.classList.add('shadow-md');
            } else {
                elements.header.classList.remove('shadow-md');
            }
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Share functionality
    function initShareButtons() {
        elements.shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const url = this.getAttribute('data-share-url') || window.location.href;
                const title = this.getAttribute('data-share-title') || document.title;
                
                const platform = this.classList.contains('facebook') ? 'facebook' :
                               this.classList.contains('twitter') ? 'twitter' :
                               this.classList.contains('whatsapp') ? 'whatsapp' :
                               this.classList.contains('email') ? 'email' : '';

                let shareUrl = '';
                
                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
                        break;
                    default:
                        return;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
                }
            });
        });
    }

    // Newsletter form handling
    function initNewsletterForm() {
        if (!elements.newsletterForm) return;

        elements.newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email || !isValidEmail(email)) {
                showMessage('Por favor, insira um e-mail válido.', 'error');
                return;
            }

            // Simulate form submission
            showMessage('Obrigado! Você foi inscrito com sucesso.', 'success');
            emailInput.value = '';
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show message function
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 p-4 rounded-sm z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Initialize all functionality
    function init() {
        updateCurrentDate();
        initMobileMenu();
        initSmoothScroll();
        initHeaderShadow();
        initShareButtons();
        initNewsletterForm();
    }

    // DOM ready check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

