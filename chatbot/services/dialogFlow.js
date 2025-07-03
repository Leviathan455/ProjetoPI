const intents = require('../intents/basicIntents.json');

function findIntent(message) {
    console.log(`Checking : ${lowerMsg}`);
  const lowerMsg = message.toLowerCase();
  for (const intent of intents.intents) {
    for (const pattern of intent.patterns) {
  
      if (lowerMsg.includes(pattern.toLowerCase())) {
        return intent;
      }
    }
  }
  return null;
}

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = {
  generateResponse: (message) => {
    const intent = findIntent(message);
    if (intent) {
      return getRandomResponse(intent.responses);
    }
    return "Desculpe, não entendi. Poderia reformular?";
  }
};