import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './data.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

const SUPPORTED_LEDS = [0,1,2];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  group = "Foxtrot"
  email = "202102074@post.au.dk,202102084@post.au.dk"
  
  led_states: number[] = SUPPORTED_LEDS.map(i => -1)
  // led_1: number = -1;
  // led_2: number = -1;
  // led_3: number = -1;
  
  mqttSubscription: Subscription;

  constructor(
    private _dataService: DataService,
    private _mqttService: MqttService
  ) {}

  ngOnInit(): void {

    // Get LEDs initial state
    SUPPORTED_LEDS.forEach((ledNumber) => {
      this._dataService.getLED(ledNumber).subscribe((data: any) => {
        this.led_states[ledNumber] = data[0]?.state;
      }, (err) => {
        console.error("An error ocurred while fecthing the LED state :(")
        console.error(err)
      })
    })
    
    // Subscribe to the shared Observable to update the value
    // of the LED button.
    this.mqttSubscription = this._mqttService.observe('led').subscribe((msg: IMqttMessage) => {
      let data = JSON.parse(msg.payload.toString())
      if (SUPPORTED_LEDS.includes(data.id)) {
        this.led_states[data.id] = data.state
      }
    }, (err) => {
      console.error("An error ocurred while receiving a message from the Mqtt Broker :(");
      console.error(err)
    })

  }

  /**
   * Request to toggle the value of the LED.
   * @param {number} ledNumber - ID of the LED to change 
   */
  changeLEDState(ledNumber: number): void {
    if(SUPPORTED_LEDS.includes(ledNumber)){
      var state: number = (this.led_states[ledNumber] == 1) ? 0 : 1;
      console.log(`from ${this.led_states[ledNumber]} to ${state}`)
      this._dataService.setLED(ledNumber, state).subscribe(() => {}, (err) => {
      console.error("An error ocurred while setting the LED state :(")
      console.error(err)
    })
    }
  }

}