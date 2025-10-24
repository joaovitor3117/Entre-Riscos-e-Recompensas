document.addEventListener('DOMContentLoaded', () => {
    // Atualiza a data exibida nas páginas de notícias, quando disponível
    const dynamicDateElements = [
        document.getElementById('current-date'),
        ...document.querySelectorAll('[data-current-date], [data-dynamic-date]')
    ].filter(Boolean);

    if (dynamicDateElements.length) {
        const formattedDate = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        dynamicDateElements.forEach(element => {
            element.textContent = formattedDate;
        });
    }

    // Controle do menu mobile específico das páginas de notícia
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    function openMobileMenu() {
        mobileMenu?.classList.add('active');
        mobileMenuOverlay?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu?.classList.remove('active');
        mobileMenuOverlay?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (mobileMenuButton && closeMobileMenuButton && mobileMenu && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', openMobileMenu);
        closeMobileMenuButton.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Rolagem suave para âncoras internas presentes nas matérias
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu?.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });

    // Sistema de compartilhamento das páginas de notícia
    const shareButtons = document.querySelectorAll('.share-button');
    if (shareButtons.length) {
        shareButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();

                const shareUrl = button.getAttribute('data-share-url');
                const shareTitle = button.getAttribute('data-share-title');

                const isFacebook = button.classList.contains('facebook');
                const isTwitter = button.classList.contains('twitter');
                const isWhatsapp = button.classList.contains('whatsapp');
                const isEmail = button.classList.contains('email');

                let platformUrl = '';
                if (isFacebook) {
                    platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl ?? '')}`;
                } else if (isTwitter) {
                    platformUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl ?? '')}&text=${encodeURIComponent(shareTitle ?? '')}`;
                } else if (isWhatsapp) {
                    platformUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle ?? ''} ${shareUrl ?? ''}`.trim())}`;
                } else if (isEmail) {
                    platformUrl = `mailto:?subject=${encodeURIComponent(shareTitle ?? '')}&body=${encodeURIComponent(shareUrl ?? '')}`;
                }

                if (platformUrl) {
                    window.open(platformUrl, '_blank', 'noopener,noreferrer');
                }
            });
        });
    }

    // Adiciona sombra ao cabeçalho das matérias após rolagem
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        });
    }

    // Controle do modal do autor
    const authorImage = document.querySelector('img[onclick="openAuthorModal()"]');
    const authorModal = document.getElementById('author-modal');
    const closeAuthorModalButton = document.getElementById('close-author-modal');

    function openAuthorModal() {
        if (authorModal) {
            authorModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAuthorModal() {
        if (authorModal) {
            authorModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (authorImage && authorModal && closeAuthorModalButton) {
        authorImage.addEventListener('click', openAuthorModal);
        closeAuthorModalButton.addEventListener('click', closeAuthorModal);
        authorModal.addEventListener('click', (event) => {
            if (event.target === authorModal) {
                closeAuthorModal();
            }
        });

        // Fechar modal com a tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !authorModal.classList.contains('hidden')) {
                closeAuthorModal();
            }
        });
    }
});