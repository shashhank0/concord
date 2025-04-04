// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
        });
    });
    
    // Tab functionality for Programs page
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Province selector functionality
    const provinceSelect = document.getElementById('province-select');
    const provinceInfo = document.getElementById('province-info');
    
    if (provinceSelect && provinceInfo) {
        provinceSelect.addEventListener('change', function() {
            const province = this.value;
            let provinceData = '';
            
            switch(province) {
                case 'ab':
                    provinceData = `<h3>Alberta Immigrant Nominee Program (AINP)</h3>
                                    <p>Alberta offers several immigration streams including:</p>
                                    <ul>
                                        <li>Alberta Opportunity Stream</li>
                                        <li>Alberta Express Entry Stream</li>
                                        <li>Alberta Accelerated Tech Pathway</li>
                                        <li>Self-Employed Farmer Stream</li>
                                    </ul>
                                    <a href="#" class="btn btn-small">Visit AINP Website</a>`;
                    break;
                case 'bc':
                    provinceData = `<h3>BC Provincial Nominee Program</h3>
                                    <p>British Columbia offers several immigration streams including:</p>
                                    <ul>
                                        <li>Skills Immigration</li>
                                        <li>Express Entry BC</li>
                                        <li>Tech Pilot Program</li>
                                        <li>Entrepreneur Immigration</li>
                                    </ul>
                                    <a href="#" class="btn btn-small">Visit BC PNP Website</a>`;
                    break;
                // Add cases for other provinces...
                default:
                    provinceData = `<p>Select a province or territory to view its specific immigration programs.</p>`;
            }
            
            provinceInfo.innerHTML = provinceData;
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real implementation, you would send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});