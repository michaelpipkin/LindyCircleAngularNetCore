export interface Member {

    memberId: number;
    firstName: string;
    lastName: string;
    inactive: boolean;
    totalAttendance: number;
    totalPaid: number;
    remainingPunches: number;
    readonly firstLastName: string;
    readonly lastFirstName: string;
    readonly activeText: string;
}
