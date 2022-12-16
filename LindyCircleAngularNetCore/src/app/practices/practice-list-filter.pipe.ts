import { Pipe, PipeTransform } from '@angular/core';
import { Practice } from './models/practice.model';

@Pipe({
	name: 'practiceListFilter'
})

export class PracticeListFilterPipe implements PipeTransform {

	transform(practices: Practice[], topicFilter: string, startDateFilter: Date, endDateFilter: Date): Practice[] {
		return practices.filter(
			function (practice: Practice) {
				return practice.practiceTopic.toString().toLowerCase().includes(
					topicFilter.toString().trim().toLowerCase()) &&
					(startDateFilter != undefined && startDateFilter.toString() != '' ?
						practice.practiceDate >= startDateFilter : true) &&
					(endDateFilter != undefined && endDateFilter.toString() != '' ?
						practice.practiceDate <= endDateFilter : true)
			}
		);;
	}
}
