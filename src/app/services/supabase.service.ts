import { Injectable, OnInit, Predicate } from '@angular/core';
import {
  ApiError,
  createClient,
  PostgrestError,
  PostgrestResponse,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService implements OnInit {
  public _supabase: SupabaseClient;

  constructor() {
    this._supabase = createClient(
      environment.supabase_url,
      environment.supabase_key
    );
  }

  ngOnInit(): void {
    // TODO Call database to check if session token is valid
    console.log('Supabase service initialized');
  }

  signUp(username: string, password: string) {
    // return this.supabase
    // .from('person')
    // .insert([
    //   { username: username, password: password },
    // ])
    return this._supabase.auth.signUp({ email: username, password });
  }

  async signIn(username: string, password: string) {
    return this._supabase.auth.signIn({ email: username, password });
  }

  getPersonData() {
    return this._supabase
      .from('person')
      .select('*')
      .eq('auth_id', this._supabase.auth.user()?.id)
      .limit(1)
      .single();
  }

  getPersonDataWithID(id: string) {
    return this._supabase
      .from('person')
      .select('*')
      .eq('auth_id', id)
      .limit(1)
      .single();
  }

  getPatientData() {
    return this._supabase
      .from('patient')
      .select('*')
      .eq('patient_id', this._supabase.auth.user()?.id)
      .limit(1)
      .single();
  }

  getPatientDataWithID(id: string) {
    return this._supabase
      .from('patient')
      .select('*')
      .eq('patient_id', id)
      .limit(1)
      .single();
  }

  getEmployeeData() {
    return this._supabase
      .from('employee')
      .select('*')
      .eq('employee_id', this._supabase.auth.user()?.id)
      .limit(1)
      .single();
  }

  getEmployeeDataWithID(id: string) {
    return this._supabase
      .from('employee')
      .select('*')
      .eq('employee_id', id)
      .limit(1)
      .single();
  }

  getBranchData() {
    return this._supabase.from('branch').select('clinic_id,address_street');
  }

  signOut() {
    return this._supabase.auth.signOut();
  }
}
