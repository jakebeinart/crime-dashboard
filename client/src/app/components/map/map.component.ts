import { Component } from '@angular/core';
import { tileLayer, latLng, Marker, icon, Map, Icon } from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CrimeDataService } from '../../services/crime-data.service';
import { Incident } from '../../services/crime-data.models';

@Component({
  selector: 'app-map',
  imports: [LeafletModule, ReactiveFormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  queryControl = new FormControl();

  selectedYear: number = 2021;
  selectedMonth: string = 'January';
  selectedIncidents: Incident[] = [];
  incidentMarkers: Marker[] = [];
  map: Map;
  constructor(public crimeDataService: CrimeDataService) {}

  onMapReady($event: Map) {
    this.map = $event;
    this.map.invalidateSize();
  }

  query() {
    this.incidentMarkers = [];
    this.crimeDataService
      .queryDatabase(this.queryControl.value)
      .subscribe((data) => {
        data.map((incident) => {
          // console.log(incident);
          this.incidentMarkers.push(
            new Marker(
              [Number(incident.Latitude), Number(incident.Longitude)],
              {
                icon: icon({
                  ...Icon.Default.prototype.options,
                  iconUrl: 'assets/marker-icon.png',
                  iconRetinaUrl: 'assets/marker-icon-2x.png',
                  shadowUrl: 'assets/marker-shadow.png',
                }),
              }
            ).bindPopup(
              `<b>${incident.Offense}</b><br>${incident.IncidentDate}`
            )
          );
        });
      });
  }

  months = [
    { name: 'January', value: 'January' },
    { name: 'February', value: 'February' },
    { name: 'March', value: 'March' },
    { name: 'April', value: 'April' },
    { name: 'May', value: 'May' },
    { name: 'June', value: 'June' },
    { name: 'July', value: 'July' },
    { name: 'August', value: 'August' },
    { name: 'September', value: 'September' },
    { name: 'October', value: 'October' },
    { name: 'November', value: 'November' },
    { name: 'December', value: 'December' },
  ];
  // Inside AppComponent
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 13,
    center: latLng(38.627, -90.1994),
  };
}
