import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { share } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /* API routes */
  private API_GET_INFO: string = environment.rest_proto + environment.api_url + "info";
  private API_GET_TEMPERATURE: string = environment.rest_proto + environment.api_url + "temperature";
  private API_GET_HUMIDITY: string = environment.rest_proto + environment.api_url + "humidity";
  private API_GET_DISTANCE: string = environment.rest_proto + environment.api_url + "distance";
  private API_GET_LED = (i: number) => environment.rest_proto + environment.api_url + "led/" + i;
  private API_SET_LED = (i: number, s: number) => environment.rest_proto + environment.api_url + "led/" + i + "/" + s;

  constructor(private _http: HttpClient) { }

  /**
   * Uses HttpClient to retrieve info about the server.
   * @returns an Observable to the /api/info route. Right now it
   * only returns the update rate of the sensors.
   */
  public getInfo(): Observable<any> {
    return this._http.get<Object>(this.API_GET_INFO)
  }

  /**
   * Uses HttpClient to retrieve historical data about the temperature.
   * @returns an Observable to the /api/temperature route.
   */
  public getTemperature(): Observable<any[]> {
    return this._http.get<Object[]>(this.API_GET_TEMPERATURE)
  }

  /**
   * Uses HttpClient to retrieve historical data about the humidity.
   * @returns an Observable to the /api/humidity route.
   */
  public getHumidity(): Observable<any[]> {
    return this._http.get<Object[]>(this.API_GET_HUMIDITY);
  }

  /**
   * Uses HttpClient to retrieve historical data about the ultrasonic sensor.
   * @returns an Observable to the /api/distance route.
   */
  public getDistance(): Observable<any[]> {
    return this._http.get<Object[]>(this.API_GET_DISTANCE);
  }

  /**
   * Uses HttpClient to retrieve the current status of the LED.
   * @returns an Observable to the /api/led route.
   */
  public getLED(i: number): Observable<any> {
    return this._http.get(this.API_GET_LED(i));
  }

  /**
   * Uses HttpClient to set the current status of the LED.
   * @param s State of the LED, 0 to turn off and 1 to turn on.
   * @returns an Observable to the /api/led/{0,1} route.
   */
  public setLED(i: number, s: number): Observable<any> {
    return this._http.put(this.API_SET_LED(i, s), { responseType: 'text' });
  }

}
