// mapa-routed.component.ts
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mapa-routed',
  templateUrl: './mapa-routed.component.html',
  styleUrls: ['./mapa-routed.component.css']
})
export class MapaRoutedComponent implements OnInit {
  map: L.Map | undefined;
  marker: L.Marker | undefined;

  constructor(
    private userService: UserAjaxService,
    private oMatSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initMap();
    this.map?.on('click', (event: L.LeafletMouseEvent) => this.updateMarker(event.latlng));
   
  }

  private initMap() {
    this.map = L.map('map').setView([40.4168, -3.7038], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private updateMarker(latlng: L.LatLng) {
    if (this.marker) {
      this.map?.removeLayer(this.marker);
    }

    const customIcon = L.icon({
      iconUrl: 'https://images.vexels.com/media/users/3/131625/isolated/lists/35942a8a6bb75dc1842582deb7168bf8-infografia-de-marcador-de-ubicacion-naranja.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.marker = L.marker(latlng, { icon: customIcon }).addTo(this.map as L.Map);
  }

  guardarCoordenadas() {
    if (this.marker) {
      const latlng = this.marker.getLatLng();
      const userId = 1; // Reemplaza con la lógica para obtener el ID del usuario actual
  
      // Llama al servicio para actualizar las coordenadas en el backend
      this.userService.updateUserCoordinates(userId, latlng.lat, latlng.lng)
        .subscribe(
          () => {
            console.log('Coordinates saved successfully');
            this.oMatSnackBar.open('Coordinates saved successfully.', '', { duration: 2000 });
          },
          (error) => {
            console.error('Error saving coordinates', error);
            this.oMatSnackBar.open('Error saving coordinates.', '', { duration: 2000 });
          }
        );
    }
  }
  


}
