import { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../config/gemini';
import '../styles/companion-chat.css';

const CompanionChat = () => {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [{
            role: 'assistant',
            content: "Hello! I'm here to support and listen to you. How are you feeling today?"
        }];
    });
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = { role: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await getGeminiResponse(inputMessage);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble responding right now, but I want you to know that you're not alone. Would you like to try talking about something else?"
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const clearHistory = () => {
        const confirmClear = window.confirm('Are you sure you want to clear the chat history?');
        if (confirmClear) {
            setMessages([{
                role: 'assistant',
                content: "Hello! I'm here to support and listen to you. How are you feeling today?"
            }]);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="chat-header">
                    <h2>Your AI Companion</h2>
                    <button onClick={clearHistory} className="clear-button">
                        Clear History
                    </button>
                </div>
                <div className="messages-container min-h-[60vh] max-h-[70vh]">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                        >
                            <div className="message-content">{message.content}</div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="input-form p-4 bg-white border-t">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="message-input"
                    />
                    <button type="submit" className="send-button">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompanionChat;