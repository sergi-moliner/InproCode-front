import { Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GraphicsComponent } from './components/graphics/graphics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'graphics', component: GraphicsComponent },
  { path: '**', redirectTo: 'home' } //ultima ruta
];
