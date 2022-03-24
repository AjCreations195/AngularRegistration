import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  isAuthenticated = false;
  constructor(private authService:AuthService) { }
 
  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user=>{
        this.isAuthenticated = !!user;
        console.log(!!user);
        
    });
  }
  onLogout(){
    this.authService.logout()
  }
  ngOnDestroy(): void {
   this.userSub.unsubscribe();
  }

}
