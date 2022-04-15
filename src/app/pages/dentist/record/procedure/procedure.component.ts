import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PostgrestResponse } from '@supabase/supabase-js';
import { MatTableDataSource } from '@angular/material/table';

export interface procedure {
  procedure_type_id: number;
  procedure_id: number;
  tooth: string;
  comments: string;
  quantity: number;
}

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss'],
})
export class ProcedureComponent implements OnInit {
  procedureForm = new FormGroup({
    procedure_type_id: new FormControl(''),
    tooth: new FormControl(''),
    comments: new FormControl(''),
    quantity: new FormControl(''),
  });
  dataSource = new MatTableDataSource<procedure>([]);
  procedureTypes: any[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public dialog: MatDialog,
    private supabase: SupabaseService
  ) {}

  ngOnInit(): void {
    this.supabase._supabase
      .from('procedure_type')
      .select('*')
      .then((data) => {
        console.log(data);
        if (data.error) {
        } else {
          console.log(data.body);
          this.procedureTypes = data.body;
        }
      });
  }

  addProcedure() {
    let sb = this.supabase._supabase;
    console.log('EDIT DATA', this.editData);
    console.log('APP_ID', this.editData.appointment_id);
    sb.from('appointment_procedure')
      .insert({
        procedure_type_id: this.procedureForm.value.procedure_type_id,
        tooth: this.procedureForm.value.tooth,
        comments: this.procedureForm.value.comments,
        quantity: this.procedureForm.value.quantity,
        appointment_id: this.editData.appointment_id,
      })
      .then((data) => {
        if (data.error) {
          console.log('Error: ', data.error);
          this._snackBar.open('Insert Error', 'Close', {
            duration: 2000,
          });
        } else {
          this._snackBar.open('Insert Successes', 'Close', {
            duration: 2000,
          });
        }
      });
    this.dialog.closeAll();
  }
}
