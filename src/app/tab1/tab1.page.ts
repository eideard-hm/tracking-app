import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import mapboxgl from 'mapbox-gl';
import type { Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab1Page implements OnInit, OnDestroy {
  private readonly _locationSvc = inject(LocationService);

  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  subscription?: Subscription;

  constructor() {}

  async ngOnInit() {
    await this.initializeMap();
    this.startTracking();
  }

  async initializeMap() {
    // Configurar el token de Mapbox
    (mapboxgl as any).accessToken = environment.mapboxAccessToken;

    // Obtener la ubicación inicial
    const coordinates = await this.getCurrentPosition();

    // Crear el mapa
    this.map = new mapboxgl.Map({
      container: 'map', // ID del contenedor en el HTML
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
      center: [coordinates.lng, coordinates.lat], // Centrar el mapa en las coordenadas iniciales
      zoom: 14, // Nivel de zoom inicial
    });

    // Agregar un marcador inicial
    this.marker = new mapboxgl.Marker()
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(this.map);
  }

  async getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    const { lat, lng } = await this._locationSvc.getCurrentLocation();
    return {
      lat,
      lng,
    };
  }

  startTracking() {
    // Inicia el seguimiento de la ubicación
    this._locationSvc.watchLocation((coords) => {
      // Actualizar el mapa con las nuevas coordenadas
      this.updateMap(coords.lat, coords.lng);
    });
  }

  updateMap(lat: number, lng: number) {
    if (this.marker) {
      // Mover el marcador a las nuevas coordenadas
      this.marker.setLngLat([lng, lat]);
    }

    if (this.map) {
      // Opcional: Centrar el mapa en la nueva posición
      this.map.flyTo({ center: [lng, lat], zoom: 14 });
    }
  }

  ngOnDestroy() {
    // Detener el seguimiento al salir de la página
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
