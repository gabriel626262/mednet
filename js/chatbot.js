// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    // Chatbot state
    const chatbotState = {
        currentMenu: 'main',
        previousMenus: [],
        isTyping: false
    };

    // Clinic data (sample data)
    const clinicData = {
        name: "Clinica MedLife Exemplu",
        address: "Strada Medicală nr. 10, Oradea",
        phone: "+40 256 123 456",
        email: "contact@medlifeexemplu.ro",
        schedule: {
            weekdays: "08:00 - 20:00",
            saturday: "09:00 - 14:00",
            sunday: "Închis"
        },
        specialties: [
            { id: 'cardio', name: 'Cardiologie' },
            { id: 'dermato', name: 'Dermatologie' },
            { id: 'pediatrie', name: 'Pediatrie' },
            { id: 'chirurgie', name: 'Chirurgie' }
        ],
        doctors: {
            cardio: [
                { id: 'drionescu', name: 'Dr. Ionescu Maria', schedule: 'Luni-Miercuri-Vineri: 09:00-15:00' },
                { id: 'drpopa', name: 'Dr. Popa Andrei', schedule: 'Marți-Joi: 12:00-18:00' }
            ],
            dermato: [
                { id: 'drmihai', name: 'Dr. Mihai Elena', schedule: 'Luni-Vineri: 10:00-16:00' }
            ],
            pediatrie: [
                { id: 'drmarin', name: 'Dr. Marin Ioana', schedule: 'Luni-Duminică: 08:00-14:00' }
            ],
            chirurgie: [
                { id: 'drdan', name: 'Dr. Dan George', schedule: 'Marți-Joi-Sâmbătă: 14:00-20:00' }
            ]
        }
    };

    // DOM Elements
    const chatbotContainer = document.getElementById('chatbotContainer');
    const openChatbotBtn = document.getElementById('openChatbot');
    const minimizeButton = document.getElementById('minimizeButton');
    const closeButton = document.getElementById('closeButton');
    const backButton = document.getElementById('backButton');
    const clearButton = document.getElementById('clearButton');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotOptions = document.querySelector('.chatbot-options');

    // Open chatbot
    openChatbotBtn.addEventListener('click', function() {
        chatbotContainer.classList.add('active');
        if (chatbotMessages.children.length === 0) {
            showWelcomeMessage();
        }
    });

    // Minimize chatbot
    minimizeButton.addEventListener('click', function() {
        chatbotContainer.classList.toggle('minimized');
    });

    // Close chatbot
    closeButton.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });

    // Clear conversation
    clearButton.addEventListener('click', function() {
        chatbotMessages.innerHTML = '';
        chatbotState.currentMenu = 'main';
        chatbotState.previousMenus = [];
        showWelcomeMessage();
    });

    // Go back in conversation
    backButton.addEventListener('click', function() {
        if (chatbotState.previousMenus.length > 0) {
            chatbotState.currentMenu = chatbotState.previousMenus.pop();
            updateChatbotOptions();
        }
    });

    // Show welcome message
    function showWelcomeMessage() {
        if (chatbotState.isTyping) return;
        
        chatbotState.isTyping = true;
        addTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage('Bună ziua! Sunt asistentul virtual al Clinicii MedLife. Cu ce vă pot ajuta astăzi?');
            updateChatbotOptions();
            chatbotState.isTyping = false;
        }, 1500);
    }

    // Add typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Add bot message
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add user message
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Scroll to bottom of messages
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Update chatbot options based on current menu
    function updateChatbotOptions() {
        chatbotOptions.innerHTML = '';
        
        if (chatbotState.currentMenu === 'main') {
            addOptionButton('Contact', showContactInfo);
            addOptionButton('Program', showSchedule);
            addOptionButton('Specialități', () => {
                chatbotState.previousMenus.push('main');
                chatbotState.currentMenu = 'specialties';
                updateChatbotOptions();
            });
            addOptionButton('Program medici', () => {
                chatbotState.previousMenus.push('main');
                chatbotState.currentMenu = 'doctors-specialties';
                updateChatbotOptions();
            });
        } 
        else if (chatbotState.currentMenu === 'specialties') {
            clinicData.specialties.forEach(specialty => {
                addOptionButton(specialty.name, () => {
                    addUserMessage(specialty.name);
                    showSpecialtyInfo(specialty.id);
                }, 'specialty-btn');
            });
        } 
        else if (chatbotState.currentMenu === 'doctors-specialties') {
            clinicData.specialties.forEach(specialty => {
                addOptionButton(specialty.name, () => {
                    chatbotState.previousMenus.push('doctors-specialties');
                    chatbotState.currentMenu = `doctors-${specialty.id}`;
                    updateChatbotOptions();
                }, 'specialty-btn');
            });
        } 
        else if (chatbotState.currentMenu.startsWith('doctors-')) {
            const specialtyId = chatbotState.currentMenu.replace('doctors-', '');
            const doctors = clinicData.doctors[specialtyId] || [];
            
            doctors.forEach(doctor => {
                addOptionButton(doctor.name, () => {
                    addUserMessage(doctor.name);
                    showDoctorSchedule(doctor);
                }, 'doctor-btn');
            });
        }
    }

    // Add option button
    function addOptionButton(text, onClick, className = '') {
        const button = document.createElement('button');
        button.className = `option-btn ${className}`;
        button.textContent = text;
        button.addEventListener('click', function() {
            if (chatbotState.isTyping) return;
            
            addUserMessage(text);
            chatbotState.isTyping = true;
            addTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator();
                onClick();
                chatbotState.isTyping = false;
            }, 1000);
        });
        
        chatbotOptions.appendChild(button);
    }

    // Show contact information
    function showContactInfo() {
        addBotMessage(`Date de contact ale ${clinicData.name}:\n\n` +
                     `📌 Adresă: ${clinicData.address}\n` +
                     `📞 Telefon: ${clinicData.phone}\n` +
                     `✉️ Email: ${clinicData.email}`);
        
        chatbotState.currentMenu = 'main';
        updateChatbotOptions();
    }

    // Show clinic schedule
    function showSchedule() {
        addBotMessage(`Programul ${clinicData.name}:\n\n` +
                     `📅 Zile lucrătoare: ${clinicData.schedule.weekdays}\n` +
                     `📅 Sâmbătă: ${clinicData.schedule.saturday}\n` +
                     `📅 Duminică: ${clinicData.schedule.sunday}`);
        
        chatbotState.currentMenu = 'main';
        updateChatbotOptions();
    }

    // Show specialty information
    function showSpecialtyInfo(specialtyId) {
        const specialty = clinicData.specialties.find(s => s.id === specialtyId);
        if (!specialty) return;
        
        addBotMessage(`Specialitatea ${specialty.name} se ocupă cu... [descriere specialitate]`);
        chatbotState.currentMenu = 'main';
        updateChatbotOptions();
    }

    // Show doctor schedule
    function showDoctorSchedule(doctor) {
        addBotMessage(`Programul doctorului ${doctor.name}:\n\n` +
                     `📅 ${doctor.schedule}`);
        
        chatbotState.currentMenu = 'main';
        updateChatbotOptions();
    }

    // Initialize chatbot
    if (openChatbotBtn) {
        openChatbotBtn.addEventListener('click', showWelcomeMessage);
    }
});