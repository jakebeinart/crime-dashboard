import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrimeDataService {
  private apiUrl = 'http://localhost:3000/api/crime-data';

  constructor(private http: HttpClient) {}

  getCrimeData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
