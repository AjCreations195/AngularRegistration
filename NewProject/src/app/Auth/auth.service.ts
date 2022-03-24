import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, reduce, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new Subject<User|null>()
    constructor(private http: HttpClient,private router :Router) {}
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDrs7ffYxKj-4q3s2lT1d7N7OGQjRATHKc',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn);
                }))
    }
    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDrs7ffYxKj-4q3s2lT1d7N7OGQjRATHKc',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn);
                }))
    }
    
    logout(){
        this.user.next(null);
        this.router.navigate(['/login'])
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const user = new User(
            email, userId, token, expirationDate)
        this.user.next(user);
    }


    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!'
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!'
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password you entered is invalid!'
                break;

        }
        return throwError(errorMessage)
    }
}