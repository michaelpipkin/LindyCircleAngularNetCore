import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

    constructor(private http: HttpClient) { }

//#region Member functions
    public getMembers(): Observable<Member[]> {
        return this.http.get<Member[]>(environment.API_URL + 'Members');
    }

    public getMember(memberId: number): Observable<Member> {
        return this.http.get<Member>(environment.API_URL + 'Members/' + memberId);
    }

    public addMember(member: Member): Observable<Member> {
        var val = {
            memberId: 0,
            firstName: member.firstName,
            lastName: member.lastName,
            inactive: false
        };
        return this.http.post<Member>(environment.API_URL + 'Members', val);
    }

    public updateMember(member: Member): Observable<Member> {
        var val = {
            memberId: member.memberId,
            firstName: member.firstName,
            lastName: member.lastName,
            inactive: member.inactive
        };
        return this.http.put<Member>(environment.API_URL + 'Members/' + member.memberId, val);
    }

    public deleteMember(memberId: number): Observable<any> {
        return this.http.delete(environment.API_URL + 'Members/' + memberId);
    }
//#endregion

//#region Practice functions
    public getPractices(): Observable<Practice[]> {
        return this.http.get<Practice[]>(environment.API_URL + 'Practices');
    }

    public getPractice(practiceId: number): Observable<Practice> {
        return this.http.get<Practice>(environment.API_URL + 'Practices/' + practiceId);
    }

    public getNextPracticeNumber(): Observable<number> {
        return this.http.get<number>(environment.API_URL + 'Practices/Next');
    }

    public addPractice(practice: Practice): Observable<any> {
        var val = {
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
		var val = {
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

	public deletePractice(practiceId: number): Observable<any> {
		return this.http.delete(environment.API_URL + 'Practices/' + practiceId);
	}
//#endregion

//#region Punch card functions
    public getPunchCardsPurchasedByMember(memberId: number): Observable<PunchCard[]> {
        return this.http.get<PunchCard[]>(environment.API_URL + 'Members/' + memberId + '/PunchCardsPurchased');
    }
//#endregion

//#region Attendance functions
    public getAttendanceForMember(memberId: number): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(environment.API_URL + 'Members/' + memberId + '/Attendances');
    }

    public getAttendanceForPractice(practiceId: number): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(environment.API_URL + 'Practices/' + practiceId + '/Attendance');
    }
//#endregion

//#region Default functions
	public getDefaultValue(defaultName: string): Observable<number> {
		return this.http.get<number>(environment.API_URL + 'Defaults/value/' + defaultName);
	}
//#endregion
}
