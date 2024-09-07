import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {stringToColor} from 'src/app/helpers';
import {calendarEvent} from 'src/app/models/calendar-events';
import {Task} from 'src/app/models/ITask';
import {environment} from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/task`;

@Injectable({
	providedIn: 'root',
})
export class TasksService {
	constructor(private http: HttpClient) {}

	getAll() {
		return this.http.get(baseUrl);
	}

	getById(id: number) {
		return this.http.get(`${baseUrl}/${id}`);
	}

	addTask(task: Task) {
		return this.http.post(baseUrl, task);
	}

	updateTask(id: number, task: Task) {
		return this.http.put(`${baseUrl}/${id}`, task);
	}

	getSelectorValues() {
		return this.http.get(`${baseUrl}?selectors=true`);
	}
	//get calendar task, append tickets events
	getTaskCalendar(): Observable<calendarEvent[]> {
		return this.getAll().pipe(
			map(res => {
				let tasks: any = res;
				let calendarEvents = tasks.map((task: Task) => {
					return {
						id: task.IdTask,
						type: 'task',
						description: task.Comments,
						tooltipTitle: task.Title,
						groupId: task.SupportOperator.Name,
						title: `${task.SupportOperator.Name}: Tsk-${task.IdTask}`,
						start: `${task.StartDate}`,
						end: `${task.EndDate}`,
						color: stringToColor(task.SupportOperator.Name),
						displayEventTime: false,
					};
				});
				return calendarEvents;
			})
		);
	}
}
