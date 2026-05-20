-- DropIndex
DROP INDEX "tasks_team_id_key";

-- DropIndex
DROP INDEX "tasks_user_id_key";

-- DropIndex
DROP INDEX "tasks_history_task_id_key";

-- DropIndex
DROP INDEX "tasks_history_user_id_key";

-- AlterTable
ALTER TABLE "tasks_history" ADD CONSTRAINT "tasks_history_pkey" PRIMARY KEY ("id");
