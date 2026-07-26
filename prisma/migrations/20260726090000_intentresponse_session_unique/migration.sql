-- Atomic replay/dedup protection: one IntentResponse per (project, session)
CREATE UNIQUE INDEX "IntentResponse_projectId_sessionId_key" ON "IntentResponse"("projectId", "sessionId");
