import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../data.service';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

export class DefaultChartValues {
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string;
  yAxisLabel: string;
  timeline: boolean = false;
  // See https://swimlane.github.io/ngx-charts/
  colorScheme: string;
}

/**
 * TEMPERATURE VIEW
 */
@Component({
  selector: 'temperature-view',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.scss']
})
export class TemperatureView implements OnInit, AfterViewInit, OnDestroy {
  
  // Array containing the columns that will be displayed in <mat-table>
  displayedColumns: string[] = ['name', 'value'];
  data: any[] = [{"name": "ºC","series": []}];

  // Reference to matSort from <mat-table>
  @ViewChild(MatSort) sort: MatSort;
  // Data source for <mat-table>
  dataSource = new MatTableDataSource<any>();
  // Default chart settings/values
  chartValues: DefaultChartValues = new DefaultChartValues();
  
  // (Shared) Subscription to the WebSocket
  mqttSubscription: Subscription;

  constructor(private _dataService: DataService, private _mqttService: MqttService) {
    // Modify the default chart settings to fit our needs
    this.chartValues.xAxisLabel = 'Time';
    this.chartValues.yAxisLabel = 'Temperature';
    this.chartValues.colorScheme = 'fire';
  }

  ngOnInit(): void {
    // Populate the table with historical data
    this.fetchInitialData();
    // Change data if message contains info about the temperature
    this.mqttSubscription = this._mqttService.observe('temperature').subscribe((message: IMqttMessage) => {
        let data = JSON.parse(message.payload.toString())
        this.data[0]['series'].push({
          "name": new Date(data.time),
          "value": data.temperature
        })
        // Doing this will trigger an update in the UI
        // it's not pretty but will do for now
        this.data = [...this.data]
        this.dataSource.data = this.data[0]['series']
    }, (err) => {
      console.error("Could not subscribe to websocket :(")
      console.log(err)
    })
  }
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  
  ngOnDestroy(): void {
    this.mqttSubscription.unsubscribe()
  }

  fetchInitialData(): void {

    this._dataService.getTemperature().subscribe((data) => {
      this.data[0]['series'] = data.map(d => {
        return {
          name: new Date(d.time),
          value: d.temperature
        }
      })

      // Doing this will trigger an update in the UI
      // it's not pretty but will do for now
      this.data = [...this.data]
      this.dataSource.data = this.data[0]['series']
    })
  }
}


/**
 * HUMIDITY VIEW
 */
@Component({
  selector: 'humidity-view',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.scss']
})
export class HumidityView implements OnInit, AfterViewInit, OnDestroy {
  
  displayedColumns: string[] = ['name', 'value'];
  data: any[] = [{"name": "%","series": []}];

  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  chartValues: DefaultChartValues = new DefaultChartValues();

  mqttSubscription: Subscription;

  constructor(private _dataService: DataService, private _mqttService: MqttService) {
    // Modify the default chart settings to fit our needs
    this.chartValues.xAxisLabel = 'Time';
    this.chartValues.yAxisLabel = 'Humidity';
    this.chartValues.colorScheme = 'natural';
  }

  ngOnInit(): void {
    // Populate the table with historical data
    this.fetchInitialData();
    // Change data if message contains info about the humidity
    this.mqttSubscription = this._mqttService.observe('humidity').subscribe((message: IMqttMessage) => {
        let data = JSON.parse(message.payload.toString())
        this.data[0]['series'].push({
          "name": new Date(data.time),
          "value": data.humidity
        })
        // Doing this will trigger an update in the UI
        // it's not pretty but will do for now
        this.data = [...this.data]
        this.dataSource.data = this.data[0]['series']
    }, (err) => {
      console.error("Could not subscribe to websocket :(")
      console.log(err)
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  
  ngOnDestroy(): void {
    this.mqttSubscription.unsubscribe()
  }

  fetchInitialData(): void {

    this._dataService.getHumidity().subscribe((data) => {
      this.data[0]['series'] = data.map(d => {
        return {
          name: new Date(d.time),
          value: d.humidity
        }
      })

      // Doing this will trigger an update in the UI
      // it's not pretty but will do for now
      this.data = [...this.data]
      this.dataSource.data = this.data[0]['series']
    })
  }
}

/**
 * DISTANCE VIEW
 */
@Component({
  selector: 'distance-view',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.scss']
})
export class DistanceView implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['name', 'value'];
  data: any[] = [{"name": "cm","series": []}];

  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  chartValues: DefaultChartValues = new DefaultChartValues();

  mqttSubscription: Subscription;

  constructor(private _dataService: DataService, private _mqttService: MqttService) {
    // Modify the default chart settings to fit our needs
    this.chartValues.xAxisLabel = 'Time';
    this.chartValues.yAxisLabel = 'Centimeters';
    this.chartValues.colorScheme = 'flame';
  }

  ngOnInit(): void {
    // Populate the table with historical data
    this.fetchInitialData();
    // Change data if message contains info about the ultrasonic sensor
    this.mqttSubscription = this._mqttService.observe('distance').subscribe((message: IMqttMessage) => {
        let data = JSON.parse(message.payload.toString())
        this.data[0]['series'].push({
          "name": new Date(data.time),
          "value": data.distance
        })
        // Doing this will trigger an update in the UI
        // it's not pretty but will do for now
        this.data = [...this.data]
        this.dataSource.data = this.data[0]['series']
    }, (err) => {
      console.error("Could not subscribe to websocket :(")
      console.log(err)
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  
  ngOnDestroy(): void {
    this.mqttSubscription.unsubscribe();
  }

  fetchInitialData(): void {

    this._dataService.getDistance().subscribe((data) => {
      this.data[0]['series'] = data.map(d => {
        return {
          name: new Date(d.time),
          value: d.distance
        }
      })

      // Doing this will trigger an update in the UI
      // it's not pretty but will do for now
      this.data = [...this.data]
      this.dataSource.data = this.data[0]['series']
    })
  }
}