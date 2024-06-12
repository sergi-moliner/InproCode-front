import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/event.service';
import { MarkersService } from '../../services/mapbox.service';
import { User } from '../../interfaces/users.interface';
import { Event } from '../../interfaces/event.interface';
import { Marker } from '../../interfaces/markers.interface';
import {} from '@angular/common/http';

Chart.register(...registerables);

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [],
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss']
})
export class GraphicsComponent implements OnInit {

  users: User[] = [];
  events: Event[] = [];
  markers: Marker[] = [];
  userRoles: string[] = [];
  userRoleCounts: number[] = [];
  eventTypes: string[] = [];
  eventTypeCounts: number[] = [];
  markerCategories: string[] = [];
  markerCategoryCounts: number[] = [];
  userLocations: string[] = [];
  userLocationCounts: number[] = [];

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private markerService: MarkersService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getEventData();
    this.getMarkerData();
    this.getUserLocationData();
  }

  getUserData() {
    this.userService.getListUsers().subscribe(users => {
      this.users = users;
      const roleCounts: { [key: string]: number } = {};
      users.forEach(user => {
        if (!roleCounts[user.type]) {
          roleCounts[user.type] = 0;
        }
        roleCounts[user.type]++;
      });
      this.userRoles = Object.keys(roleCounts);
      this.userRoleCounts = Object.values(roleCounts);
      this.renderDoughnutChart(this.userRoles, this.userRoleCounts, 'userRolesChart', 'User Roles');
    });
  }

  getEventData() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      const typeCounts: { [key: string]: number } = {};
      events.forEach(event => {
        if (!typeCounts[event.type]) {
          typeCounts[event.type] = 0;
        }
        typeCounts[event.type]++;
      });
      this.eventTypes = Object.keys(typeCounts);
      this.eventTypeCounts = Object.values(typeCounts);
      this.renderBarChart(this.eventTypes, this.eventTypeCounts, 'eventTypesChart', 'Event Types');
    });
  }

  getMarkerData() {
    this.markerService.getMarkers().subscribe(markers => {
      this.markers = markers;
      const categoryCounts: { [key: string]: number } = {};
      markers.forEach(marker => {
        if (!categoryCounts[marker.category]) {
          categoryCounts[marker.category] = 0;
        }
        categoryCounts[marker.category]++;
      });
      this.markerCategories = Object.keys(categoryCounts);
      this.markerCategoryCounts = Object.values(categoryCounts);
      this.renderRadarChart(this.markerCategories, this.markerCategoryCounts, 'markerCategoryChart', 'Marker Categories');
    });
  }

  getUserLocationData() {
    this.userService.getListUsers().subscribe(users => {
      this.users = users;
      const locationCounts: { [key: string]: number } = {};
      users.forEach(user => {
        if (!locationCounts[user.location]) {
          locationCounts[user.location] = 0;
        }
        locationCounts[user.location]++;
      });
      this.userLocations = Object.keys(locationCounts);
      this.userLocationCounts = Object.values(locationCounts);
      this.renderPieChart(this.userLocations, this.userLocationCounts, 'userLocationChart', 'User Locations');
    });
  }

  renderDoughnutChart(labels: string[], data: number[], chartId: string, chartLabel: string) {
    const canvasElement = document.getElementById(chartId) as HTMLCanvasElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              label: chartLabel,
              data: data,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: chartLabel
              }
            }
          }
        });
      } else {
        console.error(`Failed to get 2D context for canvas element with id ${chartId}`);
      }
    } else {
      console.error(`Canvas element with id ${chartId} not found`);
    }
  }

  renderBarChart(labels: string[], data: number[], chartId: string, chartLabel: string) {
    const canvasElement = document.getElementById(chartId) as HTMLCanvasElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: chartLabel,
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: chartLabel
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      } else {
        console.error(`Failed to get 2D context for canvas element with id ${chartId}`);
      }
    } else {
      console.error(`Canvas element with id ${chartId} not found`);
    }
  }

  renderRadarChart(labels: string[], data: number[], chartId: string, chartLabel: string) {
    const canvasElement = document.getElementById(chartId) as HTMLCanvasElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: labels,
            datasets: [{
              label: chartLabel,
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: chartLabel
              }
            },
            scales: {
              r: {
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      } else {
        console.error(`Failed to get 2D context for canvas element with id ${chartId}`);
      }
    } else {
      console.error(`Canvas element with id ${chartId} not found`);
    }
  }

  renderPieChart(labels: string[], data: number[], chartId: string, chartLabel: string) {
    const canvasElement = document.getElementById(chartId) as HTMLCanvasElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: chartLabel,
              data: data,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: chartLabel
              }
            }
          }
        });
      } else {
        console.error(`Failed to get 2D context for canvas element with id ${chartId}`);
      }
    } else {
      console.error(`Canvas element with id ${chartId} not found`);
    }
  }
}
