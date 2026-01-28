import * as AttendanceService from "@/services/attendance.service";

export const AttendanceController = {
  markAttendance: AttendanceService.markAttendance,
  getClassAttendance: AttendanceService.getClassAttendance,
  getStudentReportByUserId: AttendanceService.getStudentAttendanceByUserId,
  getStudentReportByStudentId:
    AttendanceService.getStudentAttendanceByStudentId,
};
