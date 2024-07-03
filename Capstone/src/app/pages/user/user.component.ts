import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '../../Models/iUser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentUser: IUser | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user as IUser;
    });
  }
}
