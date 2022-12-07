import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '@app-shared/services/repository.service';
import { Attendance } from 'app/attendances/models/attendance.model';
import { Practice } from 'app/practices/models/practice.model';

@Component({
	selector: 'app-practice-details',
	templateUrl: './practice-details.component.html',
	styleUrls: ['./practice-details.component.css']
})

export class PracticeDetailsComponent implements OnInit {
	practice: Practice;
	attendances: Attendance[];
	totalAttendanceAmount: number;

	constructor(private http: HttpClient,
		private route: ActivatedRoute,
		private repository: RepositoryService) { }

	ngOnInit(): void {
		// + casts the param as a number
		const practiceId: number = +this.route.snapshot.params['practiceId'];

		this.repository.getPractice(practiceId).subscribe(
			res => {
				this.practice = res;
			});

		this.repository.getAttendanceForPractice(practiceId).subscribe(
			res => {
				this.attendances = res;
				this.totalAttendanceAmount = res.reduce(
					(runningTotal, attendance) => runningTotal + attendance.paymentAmount, 0
				);
			});
	}
}
