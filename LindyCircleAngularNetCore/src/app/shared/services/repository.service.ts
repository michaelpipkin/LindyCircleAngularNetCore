import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateFormatService } from '@app-shared/services/date-format.service';
import { environment } from '@env/environment';
import { Attendance } from 'app/attendances/models/attendance.model';
import { Member } from 'app/members/models/member.model';
import { Practice } from 'app/practices/models/practice.model';
import { PunchCard } from 'app/punch-cards/models/punch-card.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class RepositoryService {

	constructor(private http: HttpClient,
		private dateFormatter: DateFormatService) { }

	//#region Member functions
	public getMembers = (): Observable<Member[]> => this.http.get<Member[]>(environment.API_URL + 'Members');

	public getActiveMembers = (): Observable<Member[]> => this.http.get<Member[]>(environment.API_URL + 'Members/Active');

	public getTransferMembers = (memberId: number): Observable<Member[]> =>
		this.http.get<Member[]>(environment.API_URL + 'Members/Transfer/' + memberId);

	public getMember = (memberId: number): Observable<Member> =>
		this.http.get<Member>(environment.API_URL + 'Members/' + memberId);

	public addMember(member: Member): Observable<Member> {
		const val = {
			memberId: 0,
			firstName: member.firstName,
			lastName: member.lastName,
			inactive: false
		};
		return this.http.post<Member>(environment.API_URL + 'Members', val);
	}

	public updateMember(member: Member): Observable<Member> {
		const val = {
			memberId: member.memberId,
			firstName: member.firstName,
			lastName: member.lastName,
			inactive: member.inactive
		};
		return this.http.put<Member>(environment.API_URL + 'Members/' + member.memberId, val);
	}

	public deleteMember = (memberId: number): Observable<any> =>
		this.http.delete(environment.API_URL + 'Members/' + memberId);
	//#endregion

	//#region Practice functions
	public getPractices = (): Observable<Practice[]> =>
		this.http.get<Practice[]>(environment.API_URL + 'Practices');

	public getPractice = (practiceId: number): Observable<Practice> =>
		this.http.get<Practice>(environment.API_URL + 'Practices/' + practiceId);

	public getPracticeByDate(practiceDate: Date): Observable<Practice> {
		const queryParams = new HttpParams().append("practiceDate", practiceDate.toString());
		return this.http.get<Practice>(environment.API_URL + 'Practices/Date', { params: queryParams });
	}

	public getNextPracticeNumber = (): Observable<number> =>
		this.http.get<number>(environment.API_URL + 'Practices/Next');

	public addPractice(practice: Practice): Observable<any> {
		const val = {
			practiceId: 0,
			practiceNumber: practice.practiceNumber,
			practiceDate: practice.practiceDate,
			practiceTopic: practice.practiceTopic,
			practiceCost: practice.practiceCost,
			miscExpense: practice.miscExpense,
			miscRevenue: practice.miscRevenue
		};
		return this.http.post<Practice>(environment.API_URL + 'Practices', val);
	}

	public updatePractice(practice: Practice): Observable<Practice> {
		const val = {
			practiceId: practice.practiceId,
			practiceNumber: practice.practiceNumber,
			practiceDate: practice.practiceDate,
			practiceTopic: practice.practiceTopic,
			practiceCost: practice.practiceCost,
			miscExpense: practice.miscExpense,
			miscRevenue: practice.miscRevenue
		};
		return this.http.put<Practice>(environment.API_URL + 'Practices/' + practice.practiceId, val);
	}

	public deletePractice = (practiceId: number): Observable<any> =>
		this.http.delete(environment.API_URL + 'Practices/' + practiceId);
	//#endregion

	//#region Punch card functions
	public getPunchCardsPurchasedByMember = (memberId: number): Observable<PunchCard[]> =>
		this.http.get<PunchCard[]>(environment.API_URL + 'PunchCards/Purchased/' + memberId);

	public getPunchCardsHeldByMember = (memberId: number): Observable<PunchCard[]> =>
		this.http.get<PunchCard[]>(environment.API_URL + 'PunchCards/Held/' + memberId);

	public getAllPunchCardsByMember = (memberId: number): Observable<PunchCard[]> =>
		this.http.get<PunchCard[]>(environment.API_URL + 'PunchCards/Member/' + memberId)

	public addPunchCard(punchCard: PunchCard): Observable<PunchCard> {
		const val = {
			punchCardId: 0,
			purchaseMemberId: punchCard.purchaseMemberId,
			currentMemberId: punchCard.purchaseMemberId,
			purchaseDate: punchCard.purchaseDate,
			purchaseAmount: punchCard.purchaseAmount
		};
		return this.http.post<PunchCard>(environment.API_URL + 'PunchCards', val);
	}

	public updatePunchCard(punchCard: PunchCard): Observable<PunchCard> {
		const val = {
			punchCardId: punchCard.punchCardId,
			purchaseMemberId: punchCard.purchaseMemberId,
			currentMemberId: punchCard.currentMemberId,
			purchaseDate: punchCard.purchaseDate,
			purchaseAmount: punchCard.purchaseAmount
		};
		return this.http.put<PunchCard>(environment.API_URL + 'PunchCards/' + punchCard.punchCardId, val);
	}

	public deletePunchCard = (punchCardId: number): Observable<any> =>
		this.http.delete(environment.API_URL + 'PunchCards/' + punchCardId);
	//#endregion

	//#region Attendance functions
	public getAttendanceForMember(memberId: number): Observable<Attendance[]> {
		return this.http.get<Attendance[]>(environment.API_URL + 'Attendances/Member/' + memberId);
	}

	public getAttendanceForPractice(practiceId: number): Observable<Attendance[]> {
		return this.http.get<Attendance[]>(environment.API_URL + 'Attendances/Practice/' + practiceId);
	}
	//#endregion

	//#region Default functions
	public getDefaultValue(defaultName: string): Observable<number> {
		return this.http.get<number>(environment.API_URL + 'Defaults/Value/' + defaultName);
	}
	//#endregion
}
