// Art Website Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeGallery();
    initializeCart();
    initializeContactForm();
    initializeModals();
    initializeScrollAnimations();
});

// Sample artwork data
const artworkData = {
    1: {
        title: 'Abstract Sunset',
        artist: 'Marina Rodriguez',
        price: 1200,
        category: 'paintings',
        description: 'A vibrant abstract interpretation of a sunset over the ocean, featuring bold brushstrokes and warm colors that evoke feelings of tranquility and wonder.',
        dimensions: '24" x 36"',
        medium: 'Oil on Canvas',
        year: '2023',
        image: '🎨'
    },
    2: {
        title: 'Modern Forms',
        artist: 'David Chen',
        price: 3500,
        category: 'sculptures',
        description: 'A contemporary bronze sculpture exploring the relationship between geometric forms and organic movement, symbolizing the harmony between order and chaos.',
        dimensions: '18" x 12" x 8"',
        medium: 'Bronze',
        year: '2023',
        image: '🗿'
    },
    3: {
        title: 'Cyber Dreams',
        artist: 'Alex Thompson',
        price: 800,
        category: 'digital',
        description: 'A futuristic digital artwork that blends cyberpunk aesthetics with dreamlike imagery, created using advanced AI and traditional digital painting techniques.',
        dimensions: '24" x 16" (Digital Print)',
        medium: 'Digital Art',
        year: '2024',
        image: '💻'
    },
    4: {
        title: 'Urban Reflections',
        artist: 'Sarah Johnson',
        price: 600,
        category: 'photography',
        description: 'A stunning capture of city lights reflected in rain-soaked streets, showcasing the beauty found in everyday urban moments.',
        dimensions: '20" x 30"',
        medium: 'Fine Art Photography',
        year: '2023',
        image: '📸'
    },
    5: {
        title: 'Ocean Waves',
        artist: 'Emma Wilson',
        price: 2200,
        category: 'paintings',
        description: 'A dynamic watercolor painting capturing the power and beauty of ocean waves, with masterful use of blues and whites to create movement and depth.',
        dimensions: '30" x 40"',
        medium: 'Watercolor on Paper',
        year: '2024',
        image: '🎨'
    },
    6: {
        title: 'Eternal Balance',
        artist: 'Michael Lee',
        price: 4200,
        category: 'sculptures',
        description: 'An elegant marble sculpture representing the eternal dance between opposing forces, carved with precision to highlight the natural beauty of the stone.',
        dimensions: '24" x 16" x 20"',
        medium: 'Carrara Marble',
        year: '2023',
        image: '🗿'
    }
};

// Shopping cart
let cart = JSON.parse(localStorage.getItem('artCart')) || [];

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Gallery functionality
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const artworkCards = document.querySelectorAll('.artwork-card');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter artwork cards
            artworkCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const artworkId = this.getAttribute('data-artwork');
            const price = parseInt(this.getAttribute('data-price'));
            
            addToCart(artworkId, price);
            showNotification('Added to cart!', 'success');
        });
    });

    // View details functionality
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const artworkId = this.getAttribute('data-artwork');
            showArtworkDetails(artworkId);
        });
    });
}

// Cart functionality
function initializeCart() {
    updateCartCount();
    
    const cartLink = document.querySelector('.cart-link');
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        showCartModal();
    });
}

function addToCart(artworkId, price) {
    const existingItem = cart.find(item => item.id === artworkId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const artwork = artworkData[artworkId];
        cart.push({
            id: artworkId,
            title: artwork.title,
            artist: artwork.artist,
            price: price,
            quantity: 1,
            image: artwork.image
        });
    }
    
    localStorage.setItem('artCart', JSON.stringify(cart));
    updateCartCount();
}

function removeFromCart(artworkId) {
    cart = cart.filter(item => item.id !== artworkId);
    localStorage.setItem('artCart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e5e5;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2rem;">${item.image}</span>
                    <div>
                        <h4 style="margin: 0; color: #2c1810;">${item.title}</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #666;">by ${item.artist}</p>
                        <p style="margin: 0; font-weight: 600; color: #d4af37;">$${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span>Qty: ${item.quantity}</span>
                    <button onclick="removeFromCart('${item.id}')" style="background: #dc3545; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total.toLocaleString();
}

function showCartModal() {
    updateCartModal();
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.add('active');
    
    // Clear cart functionality
    document.getElementById('clear-cart').onclick = function() {
        cart = [];
        localStorage.removeItem('artCart');
        updateCartCount();
        updateCartModal();
    };
    
    // Checkout functionality
    document.getElementById('checkout').onclick = function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        showNotification('Checkout functionality coming soon!', 'info');
    };
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!validateContactForm(data)) {
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

function validateContactForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name.trim()) {
        showNotification('Please enter your name.', 'error');
        return false;
    }
    
    if (!data.email.trim() || !emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!data.subject.trim()) {
        showNotification('Please enter a subject.', 'error');
        return false;
    }
    
    if (!data.message.trim()) {
        showNotification('Please enter your message.', 'error');
        return false;
    }
    
    return true;
}

// Modal functionality
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Close modal functionality
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
}

function showArtworkDetails(artworkId) {
    const artwork = artworkData[artworkId];
    const modal = document.getElementById('artwork-modal');
    const details = document.getElementById('artwork-details');
    
    const html = `
        <div style="max-width: 600px;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 6rem; margin-bottom: 1rem;">${artwork.image}</div>
                <h2 style="color: #2c1810; margin-bottom: 0.5rem;">${artwork.title}</h2>
                <p style="font-style: italic; font-size: 1.2rem; margin-bottom: 0.5rem;">by ${artwork.artist}</p>
                <p style="font-size: 1.5rem; font-weight: 600; color: #d4af37;">$${artwork.price.toLocaleString()}</p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">${artwork.description}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <strong>Medium:</strong> ${artwork.medium}
                    </div>
                    <div>
                        <strong>Dimensions:</strong> ${artwork.dimensions}
                    </div>
                    <div>
                        <strong>Year:</strong> ${artwork.year}
                    </div>
                    <div>
                        <strong>Category:</strong> ${artwork.category.charAt(0).toUpperCase() + artwork.category.slice(1)}
                    </div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="addToCart('${artworkId}', ${artwork.price}); showNotification('Added to cart!', 'success');" 
                        style="background: linear-gradient(135deg, #2c1810 0%, #8b4513 100%); color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 8px; cursor: pointer; margin-right: 1rem;">
                    Add to Cart - $${artwork.price.toLocaleString()}
                </button>
                <button onclick="showNotification('Wishlist feature coming soon!', 'info');"
                        style="background: transparent; color: #2c1810; border: 2px solid #2c1810; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 8px; cursor: pointer;">
                    Add to Wishlist
                </button>
            </div>
        </div>
    `;
    
    details.innerHTML = html;
    modal.classList.add('active');
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .artwork-card, .about-text, .contact-form');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes to document if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Utility functions
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

// Category card click handlers
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent.toLowerCase();
            const categoryFilter = getCategoryFilter(categoryName);
            
            // Scroll to gallery
            document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
            
            // Apply filter after scroll
            setTimeout(() => {
                const filterBtn = document.querySelector(`[data-filter="${categoryFilter}"]`);
                if (filterBtn) {
                    filterBtn.click();
                }
            }, 800);
        });
    });
});

function getCategoryFilter(categoryName) {
    const mapping = {
        'paintings': 'paintings',
        'sculptures': 'sculptures',
        'digital art': 'digital',
        'photography': 'photography'
    };
    return mapping[categoryName] || 'all';
}

// Performance optimization: Lazy load images when they come into view
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Here you would replace placeholder with real image
                // img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });
    
    const placeholderImages = document.querySelectorAll('.placeholder-image');
    placeholderImages.forEach(img => imageObserver.observe(img));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
});

// Make functions available globally for onclick handlers
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;
window.showNotification = showNotification;