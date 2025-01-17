import {
  Component,
  type ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import mapboxgl from 'mapbox-gl';

import { LocationService } from '@services/location.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab1Page implements OnInit, OnDestroy {
  readonly mapContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private readonly _locationSvc = inject(LocationService);
  private _watchId: string | null = null;
  private map!: mapboxgl.Map;
  private marker!: mapboxgl.Marker;

  ngOnInit() {
    this.initializeMap();
    this.startTracking();
  }

  private async initializeMap() {
    (mapboxgl as any).accessToken = environment.mapboxAccessToken;

    const coordinates = await this.getCurrentPosition();
    console.log({ coordinates });

    this.map = new mapboxgl.Map({
      container: this.mapContainer().nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordinates.lng, coordinates.lat],
      zoom: 14,
    });

    const popup = new mapboxgl.Popup({ className: 'text-black' }).setHTML(
      `
      <h6>Aquí estoy</h6>
      <span>Estoy en este lugar del mundo</span>
      `
    );

    this.marker = new mapboxgl.Marker({
      color: '#3880ff',
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(popup)
      .addTo(this.map);
  }

  private async getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    const { lat, lng } = await this._locationSvc.getCurrentLocation();
    return {
      lat,
      lng,
    };
  }

  private async startTracking() {
    this._watchId = await this._locationSvc.watchLocation((coords) => {
      this.updateMap(coords.lat, coords.lng);
    });
  }

  updateMap(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLngLat([lng, lat]);
    }

    if (this.map) {
      this.map.flyTo({ center: [lng, lat], zoom: 14 });
    }
  }

  ngOnDestroy() {
    if (this._watchId) {
      this._locationSvc.clearWatch(this._watchId);
    }
  }
}
