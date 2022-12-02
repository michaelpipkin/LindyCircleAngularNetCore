import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	baseTitle = 'Lindy Circle | ';

	constructor(private authService: AuthenticationService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private titleService: Title) { }

	ngOnInit(): void {
		if (this.authService.isUserAuthenticated())
			this.authService.sendAuthStateChangeNotification(true);

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
		)
			.subscribe(() => {

				var rt = this.getChild(this.activatedRoute)

				rt.data.subscribe((data: { title: string; }) => {
					this.titleService.setTitle(`${this.baseTitle} ${data.title}`)
				})
			})
	}

	getChild(activatedRoute: ActivatedRoute): any {
		if (activatedRoute.firstChild) {
			return this.getChild(activatedRoute.firstChild);
		} else {
			return activatedRoute;
		}
	}
}
