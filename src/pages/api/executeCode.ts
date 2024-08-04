import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function executeCode(req: NextApiRequest, res: NextApiResponse) {
  const { code, language, tests } = req.body;

  try {
    const executionResult = await axios.post("https://api.judge0.com/submissions", {
      source_code: code,
      language_id: language, // Map this to the correct language ID based on Judge0's API
      stdin: tests.map((test: any) => `${JSON.stringify(test.input)} ${test.target}`).join("\n"),
    });

    // Compare execution result with expected output
    if (executionResult.data.result === "correct") {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false, error: executionResult.data.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
