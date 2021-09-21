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
  private API_GET_LED: string = environment.rest_proto + environment.api_url + "led";
  private API_SET_LED = (s: number) => environment.rest_proto + environment.api_url + "led/" + s;

  /* WebSockets */
  private webSocketSubject: Subject<MessageEvent>;
  // This Observable will be shared across all of the views and the navbar, that way
  // we only need one connection.
  private sharedObservable: Observable<MessageEvent>;
  private WS_URL: string = environment.ws_proto + environment.api_url;

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
  public getLED(): Observable<any> {
    return this._http.get(this.API_GET_LED);
  }

  /**
   * Uses HttpClient to set the current status of the LED.
   * @param s State of the LED, 0 to turn off and 1 to turn on.
   * @returns an Observable to the /api/led/{0,1} route.
   */
  public setLED(s: number): Observable<any> {
    return this._http.get(this.API_SET_LED(s), { responseType: 'text' });
  }

  /**
   * Initializes the WebSocket Subject and shared Observable.
   */
  public connectWebSocket(): void {
    
    // If the WebSocket is already initalized,
    // get out of here.
    if (this.webSocketSubject) {
      return
    }

    // Connect the WebSocket to the correct URL
    let ws = new WebSocket(this.WS_URL)
    // Create an Observable for the WebSocket
    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    
    // Assign the created Observable to the WebSocket Subject
    this.webSocketSubject = Subject.create(observer, observable);
    // Create a shared Observable to share across all views
    this.sharedObservable = this.webSocketSubject.pipe(share());
  }
  
  /**
   * Get a shared Observable to the WebSocket.
   * @returns a shared Observable to the active WebSocket.
   */
  public getWebSocket(): Observable<MessageEvent> {
      return this.sharedObservable; 
  }

}
