import openai from './config/open-ai.js'
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
 console.log(colors.bold.green('Welcome to Jim\'s Chatbot Program!'));
 console.log(colors.bold.green('Ask the bot a question: '));

 const chatHistory = [];  // Store conversation history

 // loop keeps chat going
 while(true) {
  const userInput = readlineSync.question(colors.yellow('You: '));

  try {
    // Construct messages by iterating over the history enables contextual 2nd...questions
    const messages = chatHistory.map(([role, content]) => ({ role, content }))

    // Add latest user input 
    messages.push({role: 'user', content: userInput });

    // Call the API with user input
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    // Get completion text/content
    const completionText = completion.data.choices[0].message.content;

    // exit chat
    if(userInput.toLowerCase() === 'exit') {
      console.log(colors.green('Bot: ') + completionText);
      return;
    }
    // Bot response
    console.log(colors.green('Bot: ') + completionText);
    
    // Update history with user input and assistant response (enables follow-ups)
    chatHistory.push(['user', userInput]);
    chatHistory.push(['assistant', completionText]);

  } catch (error) {
  console.error(colors.red(error));   
  }
 }
}

main();