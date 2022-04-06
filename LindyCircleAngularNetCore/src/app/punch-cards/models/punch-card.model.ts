export interface PunchCard {

    punchCardId: number;
    purchaseMemberId: number;
    purchaseMemberName: string;
    currentMemberId: number;
    currentMemberName: string;
    purchaseDate: Date;
    purchaseAmount: number;
    remainingPunches: number;
}
