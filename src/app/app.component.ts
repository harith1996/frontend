import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './data.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  group = "Foxtrot"
  email = "202102074@post.au.dk,202102084@post.au.dk"
  update_rate: number = -1;
  
  led_1: number = -1;
  led_2: number = -1;
  led_3: number = -1;
  
  mqttSubscription: Subscription;

  constructor(
    private _dataService: DataService,
    private _mqttService: MqttService
  ) {}

  ngOnInit(): void {

    // Get LEDs initial state
    this._dataService.getLED(0).subscribe((data: any) => {
      this.led_1 = data[0].state;
    }, (err) => {
      console.error("An error ocurred while fecthing the LED state :(")
      console.error(err)
    })

    // Get LEDs initial state
    this._dataService.getLED(1).subscribe((data: any) => {
      this.led_2 = data[0].state;
    }, (err) => {
      console.error("An error ocurred while fecthing the LED state :(")
      console.error(err)
    })

    // Get LEDs initial state
    this._dataService.getLED(2).subscribe((data: any) => {
      this.led_3 = data[0].state;
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
    this.mqttSubscription = this._mqttService.observe('led').subscribe((msg: IMqttMessage) => {
      let data = JSON.parse(msg.payload.toString())
      if (data.id == 0) {
        this.led_1 = data.state
      } else if (data.id == 1) {
        this.led_2 = data.state
      } else if (data.id == 2) {
        this.led_3 = data.state
      }
    }, (err) => {
      console.error("An error ocurred while receiving a message from the Mqtt Broker :(");
      console.error(err)
    })

  }

  /**
   * Request to toggle the value of the LED.
   */
  changeLED1State(): void {
    var state: number = (this.led_1 == 1) ? 0 : 1;
    console.log(`from ${this.led_1} to ${state}`)
    this._dataService.setLED(0, state).subscribe(() => {}, (err) => {
      console.error("An error ocurred while setting the LED state :(")
      console.error(err)
    })
  }

  changeLED2State(): void {
    var state: number = (this.led_2 == 1) ? 0 : 1;
    this._dataService.setLED(1, state).subscribe(() => {}, (err) => {
      console.error("An error ocurred while setting the LED state :(")
      console.error(err)
    })
  }

  changeLED3State(): void {
    var state: number = (this.led_3 == 1) ? 0 : 1;
    this._dataService.setLED(2, state).subscribe(() => {}, (err) => {
      console.error("An error ocurred while setting the LED state :(")
      console.error(err)
    })
  }

}