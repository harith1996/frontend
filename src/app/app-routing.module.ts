import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistanceView, HumidityView, TemperatureView } from './view-data/view-data.component';
import { ViewMainComponent } from './view-main/view-main.component';

const routes: Routes = [
  { path: '', component: ViewMainComponent },
  { path: 'temperature', component: TemperatureView },
  { path: 'humidity', component: HumidityView },
  { path: 'distance', component: DistanceView }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }