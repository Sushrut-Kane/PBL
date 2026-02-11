import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_API_KEY);

export const gradeWithHF = async (answerKey, studentAnswer, maxMarks) => {
  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY not set");
  }

  const prompt = `
You are an examiner.

Correct Answer:
${answerKey}

Student Answer:
${studentAnswer}

Maximum Marks: ${maxMarks}

Return ONLY valid JSON in this format:
{
  "marks": number,
  "feedback": "short feedback"
}
`;

  const response = await hf.textGeneration({
    model: "google/flan-t5-large",
    inputs: prompt,
    parameters: {
      max_new_tokens: 200,
      temperature: 0.2
    }
  });

  const output = response.generated_text;
  if (!output) {
    throw new Error("Empty response from Hugging Face model");
  }

  const match = output.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid JSON returned by HF model");
  }

  const result = JSON.parse(match[0]);

  return {
    marks: Number(result.marks),
    feedback: String(result.feedback)
  };
};
