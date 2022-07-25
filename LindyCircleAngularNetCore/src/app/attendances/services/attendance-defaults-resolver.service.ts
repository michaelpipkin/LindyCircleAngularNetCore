import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RepositoryService } from '@app-shared/services/repository.service';
import { forkJoin, Observable } from 'rxjs';

export interface Defaults {
	practiceNumber: number;
	rentalCost: number;
}

@Injectable({
	providedIn: 'root'
})
export class AttendanceDefaultsResolverService implements Resolve<Defaults> {
	constructor(private repository: RepositoryService) { }

	resolve(): Observable<Defaults> {
		return forkJoin({
			practiceNumber: this.repository.getNextPracticeNumber(),
			rentalCost: this.repository.getDefaultValue('Rental cost')
		});
	}	
}
