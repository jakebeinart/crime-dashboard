import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Incident } from './crime-data.models';

@Injectable({
  providedIn: 'root',
})
export class CrimeDataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCrimeData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  queryDatabase(query: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/execute-sql?sql=${query}`);
  }
}
