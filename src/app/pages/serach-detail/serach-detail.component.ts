import { Component, OnInit, Inject } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder  } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Console } from 'console';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-serach-detail',
  templateUrl: './serach-detail.component.html',
  styleUrls: ['./serach-detail.component.scss']
})
export class SerachDetailComponent implements OnInit {
  peopleDetailForm = new FormGroup({
    address_street: new FormControl(''),
    address_city: new FormControl(''),
    address_region: new FormControl(''),
    address_postal_code: new FormControl(''),
    first_name: new FormControl(''),
    middle_name: new FormControl(''),
    last_name: new FormControl(''),
    gender: new FormControl(''),
    ssn: new FormControl(''),
    date_of_birth: new FormControl(''),
    phone_number: new FormControl(''),
    guardian_first_name: new FormControl(''),
    guardian_middle_name: new FormControl(''),
    guardian_last_name: new FormControl(''),
    guardian_ssn: new FormControl(''),
  });

  constructor(private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    public dialog:MatDialog,
    private supabase:SupabaseService) { }

  ngOnInit(): void {
    console.log("editData", this.editData);
    console.log("guardian_id", this.editData.person.guardian_id);
    let sb = this.supabase._supabase;
    sb.from('person').select("*").eq('auth_id', this.editData.person.guardian_id).then(data => {
      console.log("Data", data.body);
    
    this.peopleDetailForm.patchValue({
      address_street: this.editData.person.address_street,
      address_city: this.editData.person.address_city,
      address_region: this.editData.person.address_region,
      address_postal_code: this.editData.person.address_postal_code,
      first_name: this.editData.person.first_name,
      middle_name: this.editData.person.middle_name,
      last_name: this.editData.person.last_name,
      ssn: this.editData.person.ssn,
      date_of_birth: this.editData.person.date_of_birth,
      phone_number: this.editData.person.phone_number,
      gender: this.editData.person.gender,
      guardian_first_name: data.body?.at(0).first_name,
      guardian_middle_name: data.body?.at(0).middle_name,
      guardian_last_name: data.body?.at(0).last_name,
      guardian_ssn: data.body?.at(0).ssn,
  });
  });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

}
