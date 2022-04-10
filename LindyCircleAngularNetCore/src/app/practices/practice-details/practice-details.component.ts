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

	constructor(private http: HttpClient,
		private route: ActivatedRoute,
		private repository: RepositoryService) { }

	practice: Practice | undefined;
	attendances: Attendance[] = [];
	totalAttendanceAmount: number = 0;

	ngOnInit(): void {
		const routeParams = this.route.snapshot.paramMap;
		const practiceIdFromRoute = Number(routeParams.get('practiceId'));

		this.repository.getPractice(practiceIdFromRoute).subscribe(data => {
			this.practice = data;
		});

		this.repository.getAttendanceForPractice(practiceIdFromRoute).subscribe(data => {
			this.attendances = data;
			this.totalAttendanceAmount = data.reduce(
				(runningTotal, attendance) => runningTotal + attendance.paymentAmount, 0
			);
		});
	}
}
