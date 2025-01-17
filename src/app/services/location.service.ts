import { Injectable } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private async ensurePermissions(): Promise<boolean> {
    try {
      const permissions = await Geolocation.checkPermissions();

      if (permissions.location === 'granted') {
        return true;
      }

      const request = await Geolocation.requestPermissions();
      return request.location === 'granted';
    } catch (error) {
      console.error(
        'Error al verificar o solicitar permisos de ubicación:',
        error
      );
      return false;
    }
  }

  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    try {
      const hasPermission = await this.ensurePermissions();
      if (!hasPermission) {
        throw new Error('Permiso de ubicación no otorgado');
      }

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

  async watchLocation(
    callback: (coords: { lat: number; lng: number }) => void
  ): Promise<string | null> {
    try {
      const hasPermission = await this.ensurePermissions();
      if (!hasPermission) {
        throw new Error('Permiso de ubicación no otorgado');
      }

      const watchId = Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
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
        }
      );

      return watchId;
    } catch (error) {
      console.error('Error al iniciar el monitoreo de ubicación:', error);
      return null;
    }
  }

  clearWatch(watchId: string) {
    try {
      Geolocation.clearWatch({ id: watchId });
    } catch (error) {
      console.error('Error al detener el monitoreo de ubicación:', error);
    }
  }
}
