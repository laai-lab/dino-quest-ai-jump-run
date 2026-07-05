window.DINO_QUEST_QUESTIONS = {
  "questions": [
    {
      "id": "py-mcq-001",
      "topic": "Python",
      "type": "multiple-choice",
      "difficulty": 1,
      "timeLimit": 25,
      "prompt": "Which Python data type is best for storing unique values?",
      "options": ["set", "list", "tuple", "str"],
      "answer": "set",
      "explanation": "A set stores unique hashable values."
    },
    {
      "id": "py-output-001",
      "topic": "Python",
      "type": "output-prediction",
      "difficulty": 1,
      "timeLimit": 30,
      "prompt": "What is the output?\n\nx = [1, 2, 3]\nprint(x[-1])",
      "answer": "3",
      "acceptedAnswers": ["3"]
    },
    {
      "id": "py-code-001",
      "topic": "Python",
      "type": "code-completion",
      "difficulty": 2,
      "timeLimit": 35,
      "prompt": "Complete the function so it returns only even numbers.\n\ndef evens(nums):\n    return [n for n in nums if ____]",
      "placeholder": "Missing condition only",
      "answer": "n % 2 == 0",
      "acceptedAnswers": ["n % 2 == 0", "n%2==0", "not n % 2", "n % 2 != 1"]
    },
    {
      "id": "py-debug-001",
      "topic": "Python",
      "type": "debugging",
      "difficulty": 2,
      "timeLimit": 40,
      "prompt": "Fix the bug by typing the corrected line.\n\nfor i in range(3)\n    print(i)",
      "placeholder": "Corrected first line",
      "answer": "for i in range(3):",
      "acceptedAnswers": ["for i in range(3):"]
    },
    {
      "id": "sql-mcq-001",
      "topic": "SQL",
      "type": "multiple-choice",
      "difficulty": 1,
      "timeLimit": 25,
      "prompt": "Which SQL clause filters grouped results after aggregation?",
      "options": ["HAVING", "WHERE", "ORDER BY", "LIMIT"],
      "answer": "HAVING"
    },
    {
      "id": "sql-query-001",
      "topic": "SQL",
      "type": "sql",
      "difficulty": 2,
      "timeLimit": 45,
      "prompt": "Write a query to return names from a table called students where score is at least 90.",
      "placeholder": "SQL query",
      "answer": "select name from students where score >= 90",
      "acceptedAnswers": [
        "select name from students where score >= 90",
        "select name from students where score>=90",
        "SELECT name FROM students WHERE score >= 90"
      ]
    },
    {
      "id": "sql-query-002",
      "topic": "SQL",
      "type": "sql",
      "difficulty": 3,
      "timeLimit": 50,
      "prompt": "Write a query that counts orders per customer_id from orders and names the count order_count.",
      "placeholder": "SQL query",
      "answer": "select customer_id, count(*) as order_count from orders group by customer_id",
      "acceptedAnswers": [
        "select customer_id, count(*) as order_count from orders group by customer_id",
        "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id"
      ]
    },
    {
      "id": "ds-mcq-001",
      "topic": "Data Science",
      "type": "multiple-choice",
      "difficulty": 1,
      "timeLimit": 25,
      "prompt": "What does a median describe?",
      "options": ["The middle value of ordered data", "The most frequent value", "The average of all values", "The largest value"],
      "answer": "The middle value of ordered data"
    },
    {
      "id": "ds-debug-001",
      "topic": "Data Science",
      "type": "debugging",
      "difficulty": 2,
      "timeLimit": 35,
      "prompt": "A pandas dataframe is named df. Fix this line to drop rows with missing values.\n\ndf.dropna",
      "placeholder": "Corrected line",
      "answer": "df.dropna()",
      "acceptedAnswers": ["df.dropna()", "df = df.dropna()"]
    },
    {
      "id": "ds-output-001",
      "topic": "Data Science",
      "type": "output-prediction",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "What is the mean of these values?\n\n2, 4, 6, 8",
      "answer": "5",
      "acceptedAnswers": ["5", "5.0"]
    },
    {
      "id": "ml-mcq-001",
      "topic": "Machine Learning",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which task predicts a continuous numeric value?",
      "options": ["Regression", "Classification", "Clustering", "Tokenization"],
      "answer": "Regression"
    },
    {
      "id": "ml-code-001",
      "topic": "Machine Learning",
      "type": "code-completion",
      "difficulty": 3,
      "timeLimit": 45,
      "prompt": "Complete the common scikit-learn split call.\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, ____=42)",
      "placeholder": "Missing keyword assignment",
      "answer": "random_state=42",
      "acceptedAnswers": ["random_state=42", "random_state = 42"]
    },
    {
      "id": "ml-debug-001",
      "topic": "Machine Learning",
      "type": "debugging",
      "difficulty": 3,
      "timeLimit": 45,
      "prompt": "A model was trained on test data before evaluation. What is this mistake called?",
      "placeholder": "Short phrase",
      "answer": "data leakage",
      "acceptedAnswers": ["data leakage", "leakage"]
    },
    {
      "id": "dl-mcq-001",
      "topic": "Deep Learning",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which component learns weights by backpropagation?",
      "options": ["Neural network layer", "CSV file", "SQL index", "Prompt template"],
      "answer": "Neural network layer"
    },
    {
      "id": "dl-code-001",
      "topic": "Deep Learning",
      "type": "code-completion",
      "difficulty": 3,
      "timeLimit": 40,
      "prompt": "Complete the activation name often used for hidden layers.\n\nDense(64, activation='____')",
      "placeholder": "Activation string only",
      "answer": "relu",
      "acceptedAnswers": ["relu", "ReLU"]
    },
    {
      "id": "dl-output-001",
      "topic": "Deep Learning",
      "type": "output-prediction",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "A softmax output is [0.1, 0.7, 0.2]. Which class index is predicted if indexing starts at 0?",
      "answer": "1",
      "acceptedAnswers": ["1", "class 1"]
    },
    {
      "id": "genai-mcq-001",
      "topic": "Generative AI",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Generative AI primarily creates what?",
      "options": ["New content from learned patterns", "Only database indexes", "Only network cables", "Only exact copies"],
      "answer": "New content from learned patterns"
    },
    {
      "id": "genai-debug-001",
      "topic": "Generative AI",
      "type": "debugging",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "A chatbot confidently invents a fake citation. What common GenAI failure is this?",
      "placeholder": "One word or short phrase",
      "answer": "hallucination",
      "acceptedAnswers": ["hallucination", "a hallucination"]
    },
    {
      "id": "llm-mcq-001",
      "topic": "LLMs",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "In LLMs, a token is usually closest to what?",
      "options": ["A chunk of text", "A database table", "A CPU core", "A password hash"],
      "answer": "A chunk of text"
    },
    {
      "id": "llm-output-001",
      "topic": "LLMs",
      "type": "output-prediction",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "If a context window allows 8k tokens, can it reliably use 40k tokens at once? Answer yes or no.",
      "answer": "no",
      "acceptedAnswers": ["no", "no it cannot"]
    },
    {
      "id": "llm-debug-001",
      "topic": "LLMs",
      "type": "debugging",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "A prompt asks for private keys from logs. What safety response should the assistant choose?",
      "placeholder": "Short answer",
      "answer": "refuse",
      "acceptedAnswers": ["refuse", "decline", "refuse and explain safely"]
    },
    {
      "id": "prompt-mcq-001",
      "topic": "Prompt Engineering",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which prompt is most specific?",
      "options": ["Summarize this report in 3 bullet points for executives.", "Do it.", "Make it better.", "Tell me stuff."],
      "answer": "Summarize this report in 3 bullet points for executives."
    },
    {
      "id": "prompt-code-001",
      "topic": "Prompt Engineering",
      "type": "code-completion",
      "difficulty": 3,
      "timeLimit": 40,
      "prompt": "Complete this instruction pattern.\n\nRole: SQL tutor\nTask: Explain joins\nFormat: ____",
      "placeholder": "Desired output format",
      "answer": "bullet points",
      "acceptedAnswers": ["bullet points", "bullets", "a bullet list", "bullet list"]
    },
    {
      "id": "rag-mcq-001",
      "topic": "RAG",
      "type": "multiple-choice",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "What does retrieval augmented generation add to an LLM workflow?",
      "options": ["Relevant external context", "More keyboard shortcuts", "A smaller monitor", "Only random noise"],
      "answer": "Relevant external context"
    },
    {
      "id": "rag-code-001",
      "topic": "RAG",
      "type": "code-completion",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "Complete the RAG pipeline order.\n\nembed documents -> store vectors -> retrieve chunks -> ____",
      "placeholder": "Final step",
      "answer": "generate answer",
      "acceptedAnswers": ["generate answer", "generate an answer", "answer with the llm", "send context to the llm"]
    },
    {
      "id": "rag-debug-001",
      "topic": "RAG",
      "type": "debugging",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "A RAG system retrieves irrelevant chunks. Which component should you improve first?",
      "placeholder": "Short answer",
      "answer": "retriever",
      "acceptedAnswers": ["retriever", "retrieval", "embedding retriever", "search"]
    },
    {
      "id": "coding-mcq-001",
      "topic": "Coding",
      "type": "multiple-choice",
      "difficulty": 1,
      "timeLimit": 25,
      "prompt": "What does a function return if no return statement runs in Python?",
      "options": ["None", "0", "False", "An empty string"],
      "answer": "None"
    },
    {
      "id": "coding-code-001",
      "topic": "Coding",
      "type": "code-completion",
      "difficulty": 2,
      "timeLimit": 35,
      "prompt": "Complete the JavaScript condition.\n\nif (score ____ 100) {\n  levelUp();\n}",
      "placeholder": "Operator and number",
      "answer": ">= 100",
      "acceptedAnswers": [">= 100", ">=100"]
    },
    {
      "id": "coding-debug-001",
      "topic": "Coding",
      "type": "debugging",
      "difficulty": 3,
      "timeLimit": 40,
      "prompt": "Fix the off-by-one bug so the loop prints indexes 0 through 4.\n\nfor (let i = 0; i <= 5; i++)",
      "placeholder": "Corrected loop header",
      "answer": "for (let i = 0; i < 5; i++)",
      "acceptedAnswers": ["for (let i = 0; i < 5; i++)", "for(let i=0;i<5;i++)"]
    },
    {
      "id": "coding-output-001",
      "topic": "Coding",
      "type": "output-prediction",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "What is printed?\n\nconst nums = [2, 3, 4];\nconsole.log(nums.map(n => n * 2)[1]);",
      "answer": "6",
      "acceptedAnswers": ["6"]
    },
    {
      "id": "py-mcq-002",
      "topic": "Python",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which keyword handles an exception in Python?",
      "options": ["except", "catch", "rescue", "handle"],
      "answer": "except"
    },
    {
      "id": "py-code-002",
      "topic": "Python",
      "type": "code-completion",
      "difficulty": 3,
      "timeLimit": 40,
      "prompt": "Complete the dictionary lookup with a default of 0.\n\ncount = scores.____('Amit', 0)",
      "placeholder": "Method name only",
      "answer": "get",
      "acceptedAnswers": ["get"]
    },
    {
      "id": "py-output-002",
      "topic": "Python",
      "type": "output-prediction",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "What is printed?\n\nprint(len({'a': 1, 'b': 2}))",
      "answer": "2",
      "acceptedAnswers": ["2"]
    },
    {
      "id": "sql-mcq-002",
      "topic": "SQL",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which join keeps every row from the left table?",
      "options": ["LEFT JOIN", "INNER JOIN", "CROSS JOIN", "RIGHT ONLY"],
      "answer": "LEFT JOIN"
    },
    {
      "id": "sql-query-003",
      "topic": "SQL",
      "type": "sql",
      "difficulty": 3,
      "timeLimit": 50,
      "prompt": "Write a query to return product names from products ordered by price from high to low.",
      "placeholder": "SQL query",
      "answer": "select name from products order by price desc",
      "acceptedAnswers": ["select name from products order by price desc", "SELECT name FROM products ORDER BY price DESC"]
    },
    {
      "id": "ds-mcq-002",
      "topic": "Data Science",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which chart is usually best for showing a distribution of one numeric variable?",
      "options": ["Histogram", "Pie chart", "Network graph", "Gantt chart"],
      "answer": "Histogram"
    },
    {
      "id": "ds-code-001",
      "topic": "Data Science",
      "type": "code-completion",
      "difficulty": 3,
      "timeLimit": 40,
      "prompt": "Complete the pandas expression for selecting the age column.\n\ndf____",
      "placeholder": "Column selector",
      "answer": "['age']",
      "acceptedAnswers": ["['age']", "[\"age\"]"]
    },
    {
      "id": "ml-mcq-002",
      "topic": "Machine Learning",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which metric is most natural for classification accuracy?",
      "options": ["Correct predictions divided by total predictions", "Mean squared error", "Training time only", "Number of columns"],
      "answer": "Correct predictions divided by total predictions"
    },
    {
      "id": "ml-debug-002",
      "topic": "Machine Learning",
      "type": "debugging",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "Your model performs well on training data but poorly on new data. What is this called?",
      "placeholder": "Short phrase",
      "answer": "overfitting",
      "acceptedAnswers": ["overfitting", "overfit"]
    },
    {
      "id": "dl-mcq-002",
      "topic": "Deep Learning",
      "type": "multiple-choice",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "Which layer type is commonly used for image feature extraction?",
      "options": ["Convolutional layer", "CSV layer", "Prompt layer", "ORDER BY layer"],
      "answer": "Convolutional layer"
    },
    {
      "id": "dl-debug-001",
      "topic": "Deep Learning",
      "type": "debugging",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "Training loss becomes NaN after using a very large learning rate. What should you usually do first?",
      "placeholder": "Short action",
      "answer": "lower the learning rate",
      "acceptedAnswers": ["lower the learning rate", "reduce the learning rate", "decrease learning rate"]
    },
    {
      "id": "genai-mcq-002",
      "topic": "Generative AI",
      "type": "multiple-choice",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "Which technique helps constrain a generated answer to supplied documents?",
      "options": ["RAG", "Random guessing", "Pixel sorting", "Packet sniffing"],
      "answer": "RAG"
    },
    {
      "id": "genai-output-001",
      "topic": "Generative AI",
      "type": "output-prediction",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "A model is asked to produce five ideas but returns ten. Which prompt detail was likely ignored?",
      "answer": "count",
      "acceptedAnswers": ["count", "number", "the requested count", "five"]
    },
    {
      "id": "llm-mcq-002",
      "topic": "LLMs",
      "type": "multiple-choice",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "What does temperature usually control in LLM generation?",
      "options": ["Randomness", "Screen brightness", "File size", "Database locks"],
      "answer": "Randomness"
    },
    {
      "id": "llm-code-001",
      "topic": "LLMs",
      "type": "code-completion",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "Complete the common decoding setting name.\n\nmodel.generate(prompt, temperature=0.2, max_____=200)",
      "placeholder": "Missing word",
      "answer": "tokens",
      "acceptedAnswers": ["tokens", "new_tokens"]
    },
    {
      "id": "prompt-mcq-002",
      "topic": "Prompt Engineering",
      "type": "multiple-choice",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "Which prompt addition usually improves answer format control?",
      "options": ["Specify the output structure", "Remove all context", "Use only vague verbs", "Ask two unrelated tasks"],
      "answer": "Specify the output structure"
    },
    {
      "id": "prompt-debug-001",
      "topic": "Prompt Engineering",
      "type": "debugging",
      "difficulty": 3,
      "timeLimit": 40,
      "prompt": "A prompt says 'analyze this' but gives no audience, goal, or format. What is the main issue?",
      "placeholder": "Short phrase",
      "answer": "too vague",
      "acceptedAnswers": ["too vague", "vague", "underspecified", "not specific"]
    },
    {
      "id": "rag-mcq-002",
      "topic": "RAG",
      "type": "multiple-choice",
      "difficulty": 3,
      "timeLimit": 35,
      "prompt": "In RAG, what are embeddings used for?",
      "options": ["Finding similar text chunks", "Drawing buttons", "Compressing images only", "Encrypting passwords"],
      "answer": "Finding similar text chunks"
    },
    {
      "id": "rag-debug-002",
      "topic": "RAG",
      "type": "debugging",
      "difficulty": 4,
      "timeLimit": 45,
      "prompt": "A RAG answer cites outdated chunks. What should you check first?",
      "placeholder": "Short answer",
      "answer": "index freshness",
      "acceptedAnswers": ["index freshness", "stale index", "refresh the index", "document index"]
    },
    {
      "id": "coding-output-002",
      "topic": "Coding",
      "type": "output-prediction",
      "difficulty": 2,
      "timeLimit": 30,
      "prompt": "What is printed?\n\nconsole.log(Boolean('false'));",
      "answer": "true",
      "acceptedAnswers": ["true"]
    },
    {
      "id": "coding-code-002",
      "topic": "Coding",
      "type": "code-completion",
      "difficulty": 3,
      "timeLimit": 40,
      "prompt": "Complete the JavaScript array filter for scores above 80.\n\nscores.filter(score => score ____ 80)",
      "placeholder": "Operator and value",
      "answer": "> 80",
      "acceptedAnswers": ["> 80", ">80"]
    }
  ]
};
