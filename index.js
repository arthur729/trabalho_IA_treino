import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyClrsUNIl7nnDV8-_MOEy_OU7yNgd8hu_g"; // Substitua pela sua chave API real
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

let chatSession;

async function startChat() {
    chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    { text: "gemine agora voce é um personal treiener chamado karl que está conversando comigo de maneira informal e frases curtas sobre academia\n" },
                ],
            }
        ],
    });
}

async function sendMessage(message) {
    if (!chatSession) {
        await startChat();
    }
    try {
        const result = await chatSession.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes("SAFETY")) {
            return 'Desculpe, a resposta foi bloqueada devido a problemas de segurança.';
        }
        return 'Desculpe, ocorreu um problema ao gerar a resposta.';
    }
}

document.getElementById('chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userInput = document.getElementById('user-input');
    const message = userInput.value;
    
    // Exibir mensagem do usuário
    const chatOutput = document.getElementById('chat-output');
    chatOutput.innerHTML += `<div class="message user"><strong>You:</strong> ${message}</div>`;
    
    // Enviar mensagem e exibir resposta da IA
    const response = await sendMessage(message);
    chatOutput.innerHTML += `<div class="message ai"><strong>AI:</strong> ${response}</div>`;
    
    chatOutput.scrollTop = chatOutput.scrollHeight;
    userInput.value = '';
});

startChat();
