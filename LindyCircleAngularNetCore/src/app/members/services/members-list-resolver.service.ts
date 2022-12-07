import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RepositoryService } from '../../shared/services/repository.service';
import { Member } from '../models/member.model';

@Injectable({
	providedIn: 'root'
})

export class MembersListResolverService implements Resolve<Member[]> {
	constructor(private repository: RepositoryService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Member[]> {
		return this.repository.getMembers();
	}
}
