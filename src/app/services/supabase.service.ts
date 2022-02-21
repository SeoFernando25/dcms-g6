import { Injectable, OnInit, Predicate } from '@angular/core';
import {ApiError, createClient, PostgrestError, PostgrestResponse, Session, SupabaseClient, User} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService implements OnInit {
  public _supabase: SupabaseClient;

  constructor() {
    this._supabase = createClient(environment.supabase_url, environment.supabase_key);
  }

  ngOnInit(): void {
    // TODO Call database to check if session token is valid
    console.log("Supabase service initialized"); 
  }

  signUp(username: string, password: string) {
    // return this.supabase
    // .from('person')
    // .insert([
    //   { username: username, password: password },
    // ])
    return this._supabase.auth.signUp({email:username, password});
  }

  async signIn(username: string, password: string) {
    return this._supabase.auth.signIn({email:username, password});
  }

  signOut() {
    return this._supabase.auth.signOut();
  }

}