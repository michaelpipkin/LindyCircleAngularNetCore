import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RepositoryService } from '@app-shared/services/repository.service';
import { Practice } from '../models/practice.model';

@Injectable({
	providedIn: 'root'
})

export class PracticesListResolverService implements Resolve<Practice[]> {
	constructor(private repository: RepositoryService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Practice[]> {
		return this.repository.getPractices();
	}
}
