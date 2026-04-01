import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { AGENT_SYSTEM_PROMPT } from "./prompts";

export async function runAgent(input: string, chatHistory: { role: string; content: string }[] = []) {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7,
    streaming: false,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const messages = [
    new SystemMessage(AGENT_SYSTEM_PROMPT),
    ...chatHistory.map((m) =>
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    new HumanMessage(input),
  ];

  const response = await llm.invoke(messages);
  return typeof response.content === "string" ? response.content : JSON.stringify(response.content);
}

export async function* streamAgent(input: string, chatHistory: { role: string; content: string }[] = []) {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.7,
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const messages = [
    new SystemMessage(AGENT_SYSTEM_PROMPT),
    ...chatHistory.map((m) =>
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    new HumanMessage(input),
  ];

  const stream = await llm.stream(messages);
  for await (const chunk of stream) {
    const content = chunk.content;
    if (typeof content === "string" && content) {
      yield content;
    }
  }
}
