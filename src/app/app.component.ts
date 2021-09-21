import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  group = "Foxtrot"
  email = "202102074@post.au.dk,202102084@post.au.dk"
  update_rate: number = -1;
  led: boolean = true;

  constructor(private _dataService: DataService) {}

  ngOnInit(): void {
    
    // Initialize the WebSocket
    this._dataService.connectWebSocket();

    // Get LED state
    this._dataService.getLED().subscribe((data: any) => {
      this.led = data.state;
    }, (err) => {
      console.error("An error ocurred while fecthing the LED state :(")
      console.error(err)
    })
    
    // Get relevant info from server
    // (in this case we get update rate)
    this._dataService.getInfo().subscribe((data: any) => {
      this.update_rate = data.update_rate;
    }, (err) => {
      console.error("An error ocurred while fecthing the server state :(")
      console.error(err)
    })
    
    // Subscribe to the shared Observable to update the value
    // of the LED button.
    this._dataService.getWebSocket().subscribe((msg: any) => {
      let data = JSON.parse(msg.data)
      if (data.type == 'led') {
        this.led = data.payload.status
      }
    }, (err) => {
      console.error("An error ocurred while receiving a message from the WebSocket :(");
      console.error(err)
    })

  }

  /**
   * Request to toggle the value of the LED.
   */
  changeLEDState(): void {
    var state: number = Number(!this.led)
    this._dataService.setLED(state).subscribe(() => {}, (err) => {
      console.error("An error ocurred while setting the LED state :(")
      console.error(err)
    })
  }

}