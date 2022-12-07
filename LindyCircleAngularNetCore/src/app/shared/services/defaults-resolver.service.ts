import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RepositoryService } from '@app-shared/services/repository.service';
import { forkJoin, Observable } from 'rxjs';

export interface Defaults {
	practiceNumber: number;
	rentalCost: number;
	punchCardPrice: number;
}

@Injectable({
	providedIn: 'root'
})

export class DefaultsResolverService implements Resolve<Defaults> {
	constructor(private repository: RepositoryService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Defaults> {
		return forkJoin({
			practiceNumber: this.repository.getNextPracticeNumber(),
			rentalCost: this.repository.getDefaultValue('Rental cost'),
			punchCardPrice: this.repository.getDefaultValue('Punch card price')
		});
	}
}
