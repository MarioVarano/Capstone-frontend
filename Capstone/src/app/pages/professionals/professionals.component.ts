import { Component, OnInit } from '@angular/core';
import { IProfessionista } from '../../Models/iprofessionista';
import { ProfessionistiService } from '../../services/professionisti.service';

@Component({
  selector: 'app-professionals',
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.scss'
})
export class ProfessionalsComponent implements OnInit {
  professionisti: IProfessionista[] = [];

  constructor(private professionistiService: ProfessionistiService) {}

  ngOnInit(): void {
    console.log('Initializing ProfessionalsListComponent'); // Debug
    this.professionistiService.getProfessionisti().subscribe({
      next: (data) => {
        console.log('Received data', data); // Debug
        this.professionisti = data;
      },
      error: (err) => {
        console.error('Failed to load professionals', err); // Debug
      }
    });
  }
}
