import { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../config/gemini';
import '../styles/companion-chat.css';

const BASE_URL = 'https://learnbuddy-api.onrender.com';

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
    const [showCustomInputs, setShowCustomInputs] = useState({
        planner: false,
        motivation: false,
        subject: false,
        feedback: false
    });
    const [customInputs, setCustomInputs] = useState({
        planner: '',
        motivation: '',
        subject: '',
        feedback: ''
    });
    const messagesEndRef = useRef(null);

    // Function to make POST requests to the endpoints
    const makePostRequest = async (endpoint, data) => {
        try {
            const url = `${BASE_URL}${endpoint}`;
            console.log('Making POST request to:', url, 'with data:', data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'omit',
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const result = await response.json();
            console.log('Response from', endpoint, ':', result);
            return result;
        } catch (error) {
            console.error(`Error calling ${endpoint}:`, error);
            throw error;
        }
    };

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handler for /planner endpoint - plan trip
    const handlePlanTrip = async () => {
        if (showCustomInputs.planner && customInputs.planner.trim()) {
            await sendRequestToEndpoint('/planner', { query: customInputs.planner });
            setShowCustomInputs(prev => ({ ...prev, planner: false }));
            setCustomInputs(prev => ({ ...prev, planner: '' }));
        } else {
            setShowCustomInputs(prev => ({ ...prev, planner: true }));
        }
    };

    // Handler for /motivation endpoint - get motivation
    const handleMotivation = async () => {
        if (showCustomInputs.motivation && customInputs.motivation.trim()) {
            await sendRequestToEndpoint('/motivation', { mood: customInputs.motivation });
            setShowCustomInputs(prev => ({ ...prev, motivation: false }));
            setCustomInputs(prev => ({ ...prev, motivation: '' }));
        } else {
            setShowCustomInputs(prev => ({ ...prev, motivation: true }));
        }
    };

    // Handler for /subject endpoint - teach subject
    const handleTeachSubject = async () => {
        if (showCustomInputs.subject && customInputs.subject.trim()) {
            await sendRequestToEndpoint('/subject', { subject: customInputs.subject });
            setShowCustomInputs(prev => ({ ...prev, subject: false }));
            setCustomInputs(prev => ({ ...prev, subject: '' }));
        } else {
            setShowCustomInputs(prev => ({ ...prev, subject: true }));
        }
    };

    // Handler for /feedback endpoint - code correction
    const handleCodeFeedback = async () => {
        if (showCustomInputs.feedback && customInputs.feedback.trim()) {
            await sendRequestToEndpoint('/feedback', { input: customInputs.feedback });
            setShowCustomInputs(prev => ({ ...prev, feedback: false }));
            setCustomInputs(prev => ({ ...prev, feedback: '' }));
        } else {
            setShowCustomInputs(prev => ({ ...prev, feedback: true }));
        }
    };

    // Send request to endpoint and display response
    const sendRequestToEndpoint = async (endpoint, data) => {
        setIsTyping(true);
        try {
            const result = await makePostRequest(endpoint, data);
            
            // Handle different response formats
            let content = '';
            if (result.plan) {
                // For planner endpoint - display the plan content
                content = result.plan;
            } else if (result.subject_explanation) {
                // For subject endpoint - display the subject explanation
                content = result.subject_explanation;
            } else if (result.response) {
                // For other endpoints - display the response
                content = result.response;
            } else if (result.motivation) {
                // For motivation endpoint
                content = result.motivation;
            } else if (result.subject) {
                // For subject endpoint
                content = result.subject;
            } else if (result.feedback) {
                // For feedback endpoint
                content = result.feedback;
            } else {
                // Fallback - stringify the entire response
                content = JSON.stringify(result, null, 2);
            }
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: content
            }]);
        } catch (error) {
            let errorMessage = `Error: Could not reach ${endpoint}.`;
            if (error.message) {
                errorMessage += ` (${error.message})`;
            }
            errorMessage += ` Make sure the ngrok URL is running and accessible.`;
            
            console.error('Full error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage
            }]);
        } finally {
            setIsTyping(false);
        }
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

    const handleCustomInputChange = (type, value) => {
        setCustomInputs(prev => ({ ...prev, [type]: value }));
    };

    const renderCustomInput = (type, placeholder) => {
        if (!showCustomInputs[type]) return null;

        return (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-2 flex gap-2">
                <input
                    type="text"
                    value={customInputs[type]}
                    onChange={(e) => handleCustomInputChange(type, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePlanTrip()}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
                <button
                    onClick={() => {
                        if (type === 'planner') handlePlanTrip();
                        else if (type === 'motivation') handleMotivation();
                        else if (type === 'subject') handleTeachSubject();
                        else if (type === 'feedback') handleCodeFeedback();
                    }}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
                >
                    Send
                </button>
                <button
                    onClick={() => {
                        setShowCustomInputs(prev => ({ ...prev, [type]: false }));
                        setCustomInputs(prev => ({ ...prev, [type]: '' }));
                    }}
                    className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm font-medium"
                >
                    Cancel
                </button>
            </div>
        );
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
                <div className="feature-buttons p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button 
                        onClick={handlePlanTrip}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition"
                    >
                        ✈️ Plan Trip
                    </button>
                    <button 
                        onClick={handleMotivation}
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition"
                    >
                        💪 Motivation
                    </button>
                    <button 
                        onClick={handleTeachSubject}
                        className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm font-medium transition"
                    >
                        📚 Learn JS
                    </button>
                    <button 
                        onClick={handleCodeFeedback}
                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium transition"
                    >
                        🐛 Code Help
                    </button>
                </div>
                <div className="custom-inputs-section p-3 bg-gray-100 border-b space-y-2">
                    {renderCustomInput('planner', 'e.g., Plan trip to Russia...')}
                    {renderCustomInput('motivation', 'e.g., feeling happy...')}
                    {renderCustomInput('subject', 'e.g., teach me javascript basics...')}
                    {renderCustomInput('feedback', 'e.g., correct this code...')}
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