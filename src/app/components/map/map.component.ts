import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {} from '@angular/common/http';
import * as Mapboxgl from 'mapbox-gl';
import { MarkersService } from '../../services/mapbox.service';
import { Marker } from '../../interfaces/markers.interface';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { setMapboxToken } from '../../utils/mapbox-config';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map!: Mapboxgl.Map;
  predefinedMarkers: Mapboxgl.Marker[] = [];
  allMarkers: Marker[] = [];
  categories: string[] = ['Gallery', 'Hotel', 'Bar', 'Restaurant', 'Community center'];
  selectedCategory: string = 'all';

  constructor(
    private _markerService: MarkersService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
      this.loadPredefinedMarkers();
    }
  }

  initializeMap(): void {
    setMapboxToken(environment.mapboxToken);

    this.map = new Mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1734, 41.3851],
      zoom: 12,
    });
  }


  loadPredefinedMarkers() {
    this._markerService.getMarkers().subscribe({
      next: (markers) => {
        this.allMarkers = markers;
        this.displayMarkers(markers);
      },
      error: (error) => {
        console.error('Error loading predefined markers:', error);
      }
    });
  }

  filterMarkersByCategory() {
    if (this.selectedCategory === 'all') {
      this.loadPredefinedMarkers();
    } else {
      this._markerService.getMarkersByCategory(this.selectedCategory).subscribe({
        next: (markers) => {
          this.clearMarkers();
          this.displayMarkers(markers);
        },
        error: (error) => {
          console.error('Error loading markers by category:', error);
        }
      });
    }
  }

  clearMarkers() {
    this.predefinedMarkers.forEach(marker => marker.remove());
    this.predefinedMarkers = [];
  }

  displayMarkers(markers: Marker[]) {
    markers.forEach(markerData => {
      const marker = new Mapboxgl.Marker()
        .setLngLat([markerData.longitude, markerData.latitude])
        .addTo(this.map);

      const popup = new Mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${markerData.name}</h3><p>Coordinates: ${markerData.longitude}, ${markerData.latitude}</p><p>Category: ${markerData.category}</p>`
      );
      marker.setPopup(popup);
      marker.getElement().addEventListener('mouseenter', () => popup.addTo(this.map));
      marker.getElement().addEventListener('mouseleave', () => popup.remove());

      this.predefinedMarkers.push(marker);
    });
  }
}
