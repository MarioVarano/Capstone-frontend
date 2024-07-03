import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IProfessionista } from '../../Models/iprofessionista';
import { ProfessionistiService } from '../../services/professionisti.service';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss']
})
export class ProfessionalComponent implements OnInit {
  currentProfessional: IProfessionista | null = null;

  constructor(private authService: AuthService, private professionistiService: ProfessionistiService) {}

  ngOnInit(): void {

    const userId = this.authService.getUserId();
    console.log(userId);
    if (userId) {
      this.professionistiService.getProfessionistaById(userId).subscribe(
        res => this.currentProfessional = res,
      );
    }

  }
}
