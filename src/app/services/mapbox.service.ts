import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marker } from '../interfaces/markers.interface';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {
  private apiUrl = 'http://localhost:3000/api/markers';

  constructor(private http: HttpClient) {}

  getMarkers(): Observable<Marker[]> {
    return this.http.get<Marker[]>(this.apiUrl);
  }

  createMarker(marker: Marker): Observable<Marker> {
    return this.http.post<Marker>(this.apiUrl, marker);
  }

  deleteAllMarkers(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
