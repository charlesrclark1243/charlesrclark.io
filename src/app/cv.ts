import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cv',
  imports: [MatCardModule, MatListModule, MatChipsModule, MatButtonModule],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
})
export class Cv {}
