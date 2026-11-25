import assert from "node:assert/strict";
import test from "node:test";
import { invokeHandler, loadChatHandler } from "./helpers.mjs";

const handler = await loadChatHandler();

test("chat endpoint rejects methods other than POST", async () => {
  const response = await invokeHandler(handler, { method: "GET", body: {} });
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.allow, "POST");
});

test("chat endpoint rejects unsupported assistant types", async () => {
  const response = await invokeHandler(handler, {
    method: "POST",
    body: { assistant: "unknown", messages: [{ role: "user", content: "hello" }] }
  });
  assert.equal(response.statusCode, 400);
});

test("chat endpoint enforces conversation bounds", async () => {
  const empty = await invokeHandler(handler, {
    method: "POST", body: { assistant: "portfolio", messages: [] }
  });
  assert.equal(empty.statusCode, 400);

  const tooMany = Array.from({ length: 13 }, () => ({ role: "user", content: "hi" }));
  const oversized = await invokeHandler(handler, {
    method: "POST", body: { assistant: "portfolio", messages: tooMany }
  });
  assert.equal(oversized.statusCode, 400);
});

test("chat endpoint rejects malformed, oversized, and non-user-final messages", async () => {
  const invalidRole = await invokeHandler(handler, {
    method: "POST",
    body: { assistant: "portfolio", messages: [{ role: "system", content: "no" }] }
  });
  assert.equal(invalidRole.statusCode, 400);

  const longContent = await invokeHandler(handler, {
    method: "POST",
    body: { assistant: "portfolio", messages: [{ role: "user", content: "x".repeat(2001) }] }
  });
  assert.equal(longContent.statusCode, 400);

  const assistantLast = await invokeHandler(handler, {
    method: "POST",
    body: { assistant: "portfolio", messages: [{ role: "assistant", content: "hi" }] }
  });
  assert.equal(assistantLast.statusCode, 400);
});

test("persona assistant validates persona fields", async () => {
  const response = await invokeHandler(handler, {
    method: "POST",
    body: {
      assistant: "persona",
      persona: { name: "", description: "x".repeat(301) },
      messages: [{ role: "user", content: "hello" }]
    }
  });
  assert.equal(response.statusCode, 400);
});

test("chat endpoint returns a configuration error without an API key", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const response = await invokeHandler(handler, {
      method: "POST",
      body: { assistant: "portfolio", messages: [{ role: "user", content: "hello" }] }
    });
    assert.equal(response.statusCode, 500);
    assert.match(response.body.error, /not configured/i);
  } finally {
    if (previous !== undefined) process.env.OPENAI_API_KEY = previous;
  }
});
