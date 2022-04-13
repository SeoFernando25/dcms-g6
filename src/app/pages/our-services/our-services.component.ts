import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface GenerialService {
  name: string;
  position: number;
  price: string;
}

const ELEMENT_DATA: GenerialService[] = [
  { position: 1, name: 'Childrens Dentistry', price: '$100' },
  { position: 2, name: 'Dental Cleaning', price: '$200' },
  { position: 3, name: 'Family Dentistry', price: '$300' },
  { position: 4, name: 'Oral Cancer Screening', price: '$400' },
  { position: 5, name: 'Tooth Extraction', price: '$500' },
  { position: 6, name: 'Dental Veneers', price: '$100' },
  { position: 7, name: 'Dentures', price: '$200' },
  { position: 8, name: 'Invisalign', price: '$300' },
  { position: 9, name: 'Teeth Whitening', price: '$400' },
  { position: 10, name: 'Dental Bridgtes', price: '$400' },
  { position: 11, name: 'Dental Crowns', price: '$400' },
  { position: 12, name: 'Dental Implants', price: '$400' },
  { position: 13, name: 'Root Canals', price: '$400' },
  { position: 14, name: 'Wisdom Teeth Removal', price: '$400' },
];

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss'],
})
export class OurServicesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'price'];
  dataSource = ELEMENT_DATA;

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void { }
}
