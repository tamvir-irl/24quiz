export const quizes = [
    {
      id: "1",
      question:
        "Let's start off with an easy one! :3\nWhat's the value of the following polynomial expression?\n(x-a)(x-b)(x-c)...(x-z)",
      options: [
        {
          type: "radio",
          value: "1",
          label: String.raw`x^{26} - (abcde...z)x^{25} - ....`,
          placeholder: null,
        },
        {
          type: "radio",
          value: "2",
          label: String.raw`(abcde...z)x^{26} - (bcde...z)x^{25} - ....`,
          placeholder: null,
        },
        {
          type: "text",
          value: "",
          label: "Different answer?",
          placeholder: "Type your answer here",
        },
      ],
      time: 40000,
      answer: "0",
    },
    {
        id: "2",
        question: `🧠🦸‍♂️ Avengers: The Prisoner of Time\n
                   📜 Story:\n
                    Loki is causing trouble again. This time, he has trapped Doctor Strange in a Time Loop. To escape the time loop, Doctor Strange must answer a question.\n
                    Loki says:\n
                    "Doctor Strange, if you really can manipulate time, then answer this simple question —\n
                    How many times will the minute hand and the hour hand cross each other between 3:00 and 7:00 on a clock?\n
                    Doctor Strange is thinking about time, and now he needs your help!`,
        options: [
            {
                type: "number",
                value: "",
                label: "Your answer",
                placeholder: "Thinkkk"
            }
        ],
        time: 60000,
        answer: "3"
    },
    {
        id: "3",  // Assign an appropriate quiz ID
        question: "A 3-digit code is required to open the door of a lab. Someone provided the following clues:\n\n" +
                  "682 → 1 digit correct, wrong place\n" +
                  "614 → 1 digit correct, correct place\n" +
                  "206 → 2 digits correct, both wrong place\n" +
                  "738 → Nothing is correct\n" +
                  "380 → 1 digit correct, wrong place\n\n" +
                  "What is the code to open the door?",
        options: [
          {
            label: "420",
            value: "420",
            type: "radio",  // Single choice answer
            placeholder: null
          },
          {
            label: "542",
            value: "542",
            type: "radio",  // Single choice answer
            placeholder: null
          },
          {
            label: "102",
            value: "102",
            type: "radio",  // Single choice answer
            placeholder: null
          },
          {
            label: "120",
            value: "120",
            type: "radio",  // Single choice answer
            placeholder: null
          },
          {
            label: "042",
            value: "042",
            type: "radio",  // Single choice answer
            placeholder: null
          },
          {
            label: "720",
            value: "720",
            type: "radio",  // Single choice answer
            placeholder: null
          },

        ],
        time: 60000, // 1-minute timer for answering the quiz
        answer: "042",
      }
    // Add more quizzes as needed
  ];
  