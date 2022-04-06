import { AuthenticationService } from './../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-email-confirmation',
    templateUrl: './email-confirmation.component.html',
    styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
    public showSuccess: boolean = false;
    public showError: boolean = false;
    public errorMessage: string = "";

    constructor(private authService: AuthenticationService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.confirmEmail();
    }

    private confirmEmail() {
        this.showError = this.showSuccess = false;

        const token = this.route.snapshot.queryParams['token'];
        const userName = this.route.snapshot.queryParams['userName'];

        console.log(token);

        this.authService.confirmEmail(token, userName).subscribe(
            _ => {
                this.showSuccess = true;
            },
            error => {
                this.showError = true;
                this.errorMessage = error;
            });
    }

}
