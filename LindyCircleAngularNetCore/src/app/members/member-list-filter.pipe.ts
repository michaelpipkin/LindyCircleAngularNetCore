import { Pipe, PipeTransform } from '@angular/core';
import { Member } from './models/member.model';

@Pipe({
	name: 'memberListFilter'
})

export class MemberListFilterPipe implements PipeTransform {

	transform(members: Member[], firstNameFilter: string, lastNameFilter: string, activeFilter: boolean): Member[] {
		return members.filter(
			function (member: Member) {
				return member.firstName.toString().toLowerCase().includes(
					firstNameFilter.toString().trim().toLowerCase()) &&
					member.lastName.toString().toLowerCase().includes(
						lastNameFilter.toString().trim().toLowerCase()) &&
					(member.inactive == false || member.inactive != activeFilter);
			}
		);
	}
}
