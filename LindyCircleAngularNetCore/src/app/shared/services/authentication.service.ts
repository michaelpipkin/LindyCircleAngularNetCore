import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomEncoder } from '@app-shared/customEncoder';
import { AuthResponseDto } from '@app-shared/interfaces/authResponseDto';
import { ChangePasswordDto } from '@app-shared/interfaces/changePasswordDto';
import { ForgotPasswordDto } from '@app-shared/interfaces/forgotPasswordDto';
import { RegistrationResponseDto } from '@app-shared/interfaces/registrationResponseDto';
import { ResetPasswordDto } from '@app-shared/interfaces/resetPasswordDto';
import { UserAuthenticationDto } from '@app-shared/interfaces/userAuthenticationDto';
import { UserRegistrationDto } from '@app-shared/interfaces/userRegistrationDto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
	private authChangeSub = new Subject<boolean>();
	authChanged = this.authChangeSub.asObservable();

    constructor(private http: HttpClient,
        private jwtHelper: JwtHelperService) { }

    public registerUser = (body: UserRegistrationDto): Observable<any> =>
        this.http.post<RegistrationResponseDto>(environment.API_URL + 'Accounts/Registration', body);

    public confirmEmail(token: string, userName: string) {
        let params = new HttpParams({ encoder: new CustomEncoder() });
        params = params.append('token', token);
        params = params.append('userName', userName);

        return this.http.get(environment.API_URL + 'Accounts/EmailConfirmation', { params: params });
    }

    public loginUser = (body: UserAuthenticationDto): Observable<any> =>
        this.http.post<AuthResponseDto>(environment.API_URL + 'Accounts/Login', body);

    public sendAuthStateChangeNotification = (isAuthenticated: boolean) =>
		this.authChangeSub.next(isAuthenticated);

    public logout(): void {
        localStorage.removeItem("token");
        this.sendAuthStateChangeNotification(false);
    }

    public isUserAuthenticated(): boolean {
        const token = localStorage.getItem("token");
        return token != null && !this.jwtHelper.isTokenExpired(token);
    }

    public isUserAdmin(): boolean {
        const roles = localStorage.getItem("roles");
        return roles != null && roles.includes("Admin");
    }

    public forgotPassword = (body: ForgotPasswordDto): Observable<any> =>
        this.http.post(environment.API_URL + 'Accounts/ForgotPassword', body);

    public resetPassword = (body: ResetPasswordDto): Observable<any> =>
        this.http.post(environment.API_URL + 'Accounts/ResetPassword', body);

    public changePassword = (body: ChangePasswordDto): Observable<any> =>
        this.http.post(environment.API_URL + 'Accounts/ChangePassword', body);
}
