-- DropForeignKey
ALTER TABLE "StudentNotification" DROP CONSTRAINT "StudentNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "StudentNotification" DROP CONSTRAINT "StudentNotification_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherNotification" DROP CONSTRAINT "TeacherNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherNotification" DROP CONSTRAINT "TeacherNotification_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "StudentNotification" ADD CONSTRAINT "StudentNotification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentNotification" ADD CONSTRAINT "StudentNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherNotification" ADD CONSTRAINT "TeacherNotification_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherNotification" ADD CONSTRAINT "TeacherNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
