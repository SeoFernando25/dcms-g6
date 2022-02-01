import { Injectable, OnInit, Predicate } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../environments/environment";

export interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService implements OnInit {
  
  private _isLoggedIn: boolean = false;
  private _sessionToken: string  = localStorage.getItem('session_token') || "";
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key);
    let login_tok = localStorage.getItem('session_token');
    if (login_tok) {
      this._sessionToken = login_tok;
      this._isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    // TODO Call database to check if session token is valid
    console.log("Supabase service initialized"); 
  }

  get isLoggedIn() {
    // Ask server if session token is valid
    return this._isLoggedIn;
  }

  get sessionToken() {
    return this._sessionToken;
  }

  async signIn(username: string, password: string): Promise<boolean> {
    let r = await this.supabase
    .rpc('login', {
      "u_name": username,
      "u_pass": password
    })
    
    if (r.error || !r.data) {
      console.log("Login failed:", r.error);
      return false;
    } else {
      console.log("Login succeeded:", r.data);
      this._isLoggedIn = true;
      this._sessionToken = r.data.toString();
      localStorage.setItem('session_token', this._sessionToken);
      return true;
    }

   
  }

  async signOut() {
    let r = await this.supabase.rpc('logout', {sess_token: this.sessionToken});
    localStorage.removeItem('session_token');
    if (r.error) {
      console.log("Logout failed:", r.error);
      this._isLoggedIn = false;
      this._sessionToken = "";
    } else {
      console.log("Logout succeeded:", r.data);
      this._isLoggedIn = false;
      this._sessionToken = "";
    }
    return 
  }

  async usernameExists(username: string): Promise<boolean> {
    let r = await this.supabase.from('person').select('username').eq('username', username).single();
    if (r.error) {
      console.log("Username check failed");
      console.log(r.error);
      return false;
    } else{
      console.log("Username exists");
      console.log(r);
    }
    return true;
  }
}
