import { Injectable } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  // Obtener la ubicación actual
  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      throw error;
    }
  }

  // Monitorear ubicación en tiempo real
  watchLocation(callback: (coords: { lat: number; lng: number }) => void) {
    const watchId = Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        console.error('Error monitoreando la ubicación:', err);
        return;
      }

      if (position) {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }
    });

    return watchId; // Devuelve el ID para detener el monitoreo si es necesario
  }

  // Detener el monitoreo de la ubicación
  clearWatch(watchId: string) {
    Geolocation.clearWatch({ id: watchId });
  }
}
