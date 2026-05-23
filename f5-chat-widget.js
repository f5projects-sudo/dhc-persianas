/**
 * F5 Networking Chat Widget
 * Uso: <script src="f5-chat-widget.js" data-webhook-url="YOUR_WEBHOOK_URL"></script>
 */

(function() {
    // Configuración
    const WEBHOOK_URL = document.currentScript?.dataset.webhookUrl || 
        'https://n8nv2.automationf5networking.com/webhook/672bc544-3ba4-4853-b720-da0ed36ac3a9/chat';
    
    const WIDGET_ID = 'f5-chat-widget';
    const STYLES = `
        :root {
            --f5-primary: #0052cc;
            --f5-primary-light: #e8f0ff;
            --f5-secondary: #666;
            --f5-bg: #fff;
            --f5-border: #d0d0d0;
            --f5-text: #333;
            --f5-text-light: #999;
        }

        #${WIDGET_ID}-trigger {
            position: fixed;
            bottom: 35px;
            right: 110px; /* A un lado del botón de WhatsApp */
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--f5-primary);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 82, 204, 0.4);
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 9998;
        }

        #${WIDGET_ID}-trigger:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 82, 204, 0.5);
        }

        #${WIDGET_ID}-trigger.open {
            transform: rotate(45deg);
        }

        .f5-chat-window {
            position: fixed;
            bottom: 105px;
            right: 30px;
            width: 380px;
            height: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
            display: flex;
            flex-direction: column;
            z-index: 9999;
            animation: slideUp 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: var(--f5-text);
        }

        .f5-chat-window.hidden {
            display: none;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .f5-chat-header {
            background: linear-gradient(135deg, var(--f5-primary) 0%, #004494 100%);
            color: white;
            padding: 16px;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .f5-chat-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }

        .f5-chat-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .f5-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #f9f9f9;
        }

        .f5-chat-message {
            display: flex;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .f5-chat-message.user {
            justify-content: flex-end;
        }

        .f5-chat-bubble {
            max-width: 75%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .f5-chat-message.user .f5-chat-bubble {
            background: var(--f5-primary);
            color: white;
            border-radius: 18px 18px 4px 18px;
        }

        .f5-chat-message.bot .f5-chat-bubble {
            background: #e8e8e8;
            color: var(--f5-text);
            border-radius: 18px 18px 18px 4px;
        }

        .f5-chat-typing {
            display: flex;
            gap: 4px;
            align-items: center;
            padding: 10px 14px;
        }

        .f5-chat-typing span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #999;
            animation: bounce 1.4s infinite;
        }

        .f5-chat-typing span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .f5-chat-typing span:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes bounce {
            0%, 80%, 100% { opacity: 0.5; }
            40% { opacity: 1; }
        }

        .f5-chat-input-area {
            border-top: 1px solid var(--f5-border);
            padding: 12px;
            background: white;
            display: flex;
            gap: 8px;
            border-radius: 0 0 12px 12px;
        }

        .f5-chat-input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid var(--f5-border);
            border-radius: 8px;
            font-size: 14px;
            background: white;
            color: var(--f5-text);
            font-family: inherit;
            transition: border-color 0.2s;
        }

        .f5-chat-input:focus {
            outline: none;
            border-color: var(--f5-primary);
            box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
        }

        .f5-chat-input::placeholder {
            color: var(--f5-text-light);
        }

        .f5-chat-send {
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            background: var(--f5-primary);
            color: white;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-weight: 500;
        }

        .f5-chat-send:hover {
            background: #0047b8;
        }

        .f5-chat-send:active {
            transform: scale(0.98);
        }

        .f5-chat-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .f5-chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .f5-chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .f5-chat-messages::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
        }

        @media (max-width: 480px) {
            .f5-chat-window {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
        }
    `;

    function initWidget() {
        // Inyectar estilos
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);

        // Crear elementos
        const trigger = document.createElement('button');
        trigger.id = `${WIDGET_ID}-trigger`;
        trigger.innerHTML = '💬';
        trigger.setAttribute('aria-label', 'Abrir chat');

        const window = document.createElement('div');
        window.className = 'f5-chat-window hidden';
        window.innerHTML = `
            <div class="f5-chat-header">
                <h3>F5 Networking</h3>
                <button class="f5-chat-close" aria-label="Cerrar chat">✕</button>
            </div>
            <div class="f5-chat-messages" id="f5-messages">
                <div class="f5-chat-message bot">
                    <div class="f5-chat-bubble">
                        ¡Hola! ¿En qué puedo ayudarte?
                    </div>
                </div>
            </div>
            <div class="f5-chat-input-area">
                <input 
                    type="text" 
                    class="f5-chat-input" 
                    id="f5-input"
                    placeholder="Escribe tu pregunta..."
                    autocomplete="off"
                />
                <button class="f5-chat-send" id="f5-send" aria-label="Enviar">➤</button>
            </div>
        `;

        document.body.appendChild(trigger);
        document.body.appendChild(window);

        // Funcionalidad
        const closeBtn = window.querySelector('.f5-chat-close');
        const messagesDiv = window.querySelector('#f5-messages');
        const inputField = window.querySelector('#f5-input');
        const sendBtn = window.querySelector('#f5-send');
        let isLoading = false;
        let conversationHistory = [];

        function toggleWindow() {
            window.classList.toggle('hidden');
            trigger.classList.toggle('open');
            if (!window.classList.contains('hidden')) {
                inputField.focus();
            }
        }

        function scrollToBottom() {
            setTimeout(() => {
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 0);
        }

        function addMessage(text, isUser) {
            const msg = document.createElement('div');
            msg.className = `f5-chat-message ${isUser ? 'user' : 'bot'}`;

            const bubble = document.createElement('div');
            bubble.className = 'f5-chat-bubble';
            bubble.textContent = text;

            msg.appendChild(bubble);
            messagesDiv.appendChild(msg);

            if (isUser) {
                conversationHistory.push({ role: 'user', content: text });
            } else {
                conversationHistory.push({ role: 'assistant', content: text });
            }

            scrollToBottom();
        }

        function showTyping() {
            const msg = document.createElement('div');
            msg.className = 'f5-chat-message bot';
            msg.id = 'f5-typing';

            const bubble = document.createElement('div');
            bubble.className = 'f5-chat-bubble';
            bubble.innerHTML = '<div class="f5-chat-typing"><span></span><span></span><span></span></div>';

            msg.appendChild(bubble);
            messagesDiv.appendChild(msg);
            scrollToBottom();
        }

        function removeTyping() {
            const typing = document.getElementById('f5-typing');
            if (typing) typing.remove();
        }

        async function sendMessage() {
            const message = inputField.value.trim();
            if (!message || isLoading) return;

            isLoading = true;
            sendBtn.disabled = true;

            addMessage(message, true);
            inputField.value = '';
            showTyping();

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chatInput: message,
                        action: 'sendMessage',
                        conversationHistory: conversationHistory
                    })
                });

                removeTyping();

                if (response.ok) {
                    const data = await response.json();
                    const botMessage = data.output || data.message || data.reply || 'Gracias por tu pregunta.';
                    addMessage(botMessage, false);
                } else {
                    addMessage('⚠️ Error al conectar. Intenta de nuevo.', false);
                }
            } catch (error) {
                removeTyping();
                console.error('Error:', error);
                addMessage('❌ Error de conexión.', false);
            } finally {
                isLoading = false;
                sendBtn.disabled = false;
                inputField.focus();
            }
        }

        // Event listeners
        trigger.addEventListener('click', toggleWindow);
        closeBtn.addEventListener('click', toggleWindow);
        sendBtn.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !window.classList.contains('hidden')) {
                toggleWindow();
            }
        });
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();
