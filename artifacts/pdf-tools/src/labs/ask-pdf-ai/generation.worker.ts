let handler: import("@mlc-ai/web-llm").WebWorkerMLCEngineHandler | undefined;

self.onmessage = async (event: MessageEvent) => {
  if (!handler) {
    const { WebWorkerMLCEngineHandler } = await import("@mlc-ai/web-llm");
    handler = new WebWorkerMLCEngineHandler();
  }
  handler.onmessage(event);
};
