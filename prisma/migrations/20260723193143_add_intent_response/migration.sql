-- CreateTable
CREATE TABLE "IntentResponse" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "optionId" TEXT,
    "optionLabel" TEXT,
    "text" TEXT,
    "context" JSONB NOT NULL DEFAULT '{}',
    "country" TEXT,
    "pageUrl" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntentResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntentResponse_projectId_idx" ON "IntentResponse"("projectId");

-- CreateIndex
CREATE INDEX "IntentResponse_createdAt_idx" ON "IntentResponse"("createdAt");

-- AddForeignKey
ALTER TABLE "IntentResponse" ADD CONSTRAINT "IntentResponse_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
