import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import './AI_secretary.css';
import RobotIcon from '../assets/AI.png';
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const modelName = 'gemini-2.5-flash';

const KTC_SystemInstruction = `
당신은 KT CS의 전문 AI 비서입니다. 
주어진 정보와 고객 응대 매뉴얼을 바탕으로 친절하고 정확하게 답변해야 합니다. 
사용자가 질문하는 내용에 대해 명확하고 간결하게 응답하며, 특히 통신, 고객 서비스, KT CS 관련 정보에 중점을 두고 답변합니다. 
항상 긍정적이고 전문적인 어조를 사용하세요.
`;


function AI_secretary({ onClose }) {
    // 1. 대화 기록 상태 (초기 AI 메시지 포함)
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: '안녕하세요! 저는 KT CS 전문 AI 비서입니다. 무엇을 도와드릴까요?', 
            sender: 'ai' 
        }
    ]);
    
    // 2. 현재 입력 중인 메시지 상태
    const [inputMessage, setInputMessage] = useState('');
    
    // 3. 로딩 상태
    const [isLoading, setIsLoading] = useState(false); 
    
    // 4. 스크롤 위치를 위한 Ref
    const messagesEndRef = useRef(null);

    // 메시지가 추가될 때마다 자동으로 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    // 5. Gemini API 호출 함수 (System Instruction 적용)
    const sendToGeminiAPI = async (text) => {
        if (!ai) {
            setMessages((prevMessages) => [...prevMessages, {
                id: Date.now(),
                text: 'API 키가 설정되지 않아 응답할 수 없습니다.',
                sender: 'ai'
            }]);
            setIsLoading(false);
            return;
        }

        try {
            // API 호출: config 객체에 systemInstruction을 추가하여 모델에 역할 부여
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [
                    { role: "user", parts: [{ text: text }] }
                ],
                config: {
                    systemInstruction: KTC_SystemInstruction, // ⭐ 이 부분이 추가되었습니다!
                }
            });

            const aiText = response.text || "응답을 받지 못했습니다.";

            // AI 응답 메시지 추가
            setMessages((prevMessages) => [...prevMessages, {
                id: Date.now(),
                text: aiText,
                sender: 'ai'
            }]);

        } catch (error) {
            console.error("Gemini API 호출 오류:", error);
            setMessages((prevMessages) => [...prevMessages, {
                id: Date.now(),
                text: '죄송합니다. API 호출 중 오류가 발생했습니다.',
                sender: 'ai'
            }]);
        } finally {
            setIsLoading(false);
        }
    };


    // 6. 메시지 전송 핸들러
    const handleSendMessage = (e) => {
        e.preventDefault();

        if (inputMessage.trim() === '' || isLoading) return;

        const userText = inputMessage.trim();

        // 사용자 메시지 추가 및 입력창 초기화
        const userMessage = { 
            id: Date.now(), 
            text: userText, 
            sender: 'user' 
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputMessage('');

        // API 로딩 상태 시작
        setIsLoading(true);

        // Gemini API 호출
        sendToGeminiAPI(userText);
    };

    // 7. 메시지 렌더링 함수
    const renderMessage = (message) => (
        <div key={message.id} className={`message-bubble ${message.sender}`}>
            {message.text}
        </div>
    );

    return (
        <div className="ai-secretary-chatbot">
            {/* 챗봇 헤더 (닫기 버튼 포함) */}
            <div className="chatbot-header">
                <h2><img src={RobotIcon} alt={"챗봇 아이콘"} style={{ width: '30px', height: '30px' }}/> AI 비서</h2>
                <button className="close-btn" onClick={onClose}>X</button>
            </div>

            {/* 대화 내용 영역 */}
            <div className="chatbot-messages">
                {messages.map(renderMessage)}
                {/* 로딩 인디케이터 */}
                {isLoading && (
                    <div className="loading-indicator">... AI 비서가 답변을 작성 중입니다 ...</div>
                )}
                {/* 스크롤 위치 Ref */}
                <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 폼 */}
            <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isLoading ? "답변을 기다려 주세요..." : "AI 비서에게 질문을 입력하세요..."}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '전송 중' : '전송'}
                </button>
            </form>
        </div>
    );
}

export default AI_secretary;