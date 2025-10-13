import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  // private apiUrl = 'http://localhost:8080/api/analytics';
  private apiUrl = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient) { }

  getDashboardData(timeRange: string, startDate: Date, endDate: Date): Observable<any> {
    // For example
    const params = new HttpParams()
      .set('range', timeRange)
      .set('start', startDate.toISOString())
      .set('end', endDate.toISOString());

    return this.http.get('http://localhost:8080/dashboard', { params });
  }

  private transformData(rawData: any): any {
    return {
      applications: {
        labels: rawData.applications?.statusLabels || [],
        counts: rawData.applications?.statusCounts || [],
        totalChange: rawData.applications?.totalChange || 0
      },
      logsheets: rawData.logsheets || [],
      attendance: {
        attended: parseInt(rawData.attendance?.attended) || 0,
        registered: parseInt(rawData.attendance?.registered) || 0,
        noShow: parseInt(rawData.attendance?.noShow) || 0
      },
      placements: rawData.placements || [],
      studentProgress: rawData.studentProgress || [],
      systemActivity: rawData.systemActivity?.[0] || {}
    };
  }
}