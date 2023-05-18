function getAnswerFromChatGPT(question) {
  return fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0.5,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const answer = data.choices[0].text.trim();
      return answer;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Rethrow the error to be caught by the caller
    });
}

function parseText(text) {
  const textSections = text.split(`\n`);
  const filteredAnswer = textSections.filter((word) => word != "");
  const takeFrontSection = [];
  const description = [];
  filteredAnswer.forEach(function (section) {
    if (section.includes(`-`)) {
      takeFrontSection.push(section.split(`-`)[0]);
      description.push(section.split(`-`)[1]);
    } else {
      takeFrontSection.push(section.split(`:`)[0]);
      description.push(section.split(`:`)[1]);
    }
  });

  const placesName = [];
  takeFrontSection.forEach(function (listitem) {
    placesName.push(listitem.split(`.`)[1].trimStart());
  });

  return {
    pubNames: placesName,
    descriptions: description,
  };
}
