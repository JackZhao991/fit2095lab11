import { Component } from '@angular/core';
import * as io from "socket.io-client";
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lab11frontend';
  socket: SocketIOClient.Socket;
  poll: {question: string, options: Array<any>} = {question: '', options: []};
  selectedValue: number = 0;
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public colors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(102, 0, 204, 0.2)',
        'rgba(255, 128, 0, 0.2)',
        'red',
        'blue',
        'green'
      ]
    }
  ];

  constructor () {
    this.socket = io.connect("http://localhost:8080");
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.getPoll();
    //console.log(this.poll);
  }

  getPoll () {
    this.socket.on("sendPoll", (pollObj) => {
      this.poll.question = pollObj.question;
      this.poll.options = pollObj.options;
      //console.log(this.poll.options);
      this.setChart();
    })
  }

  vote () {
    this.socket.emit("sendVote", this.selectedValue);
    this.socket.on("updatePoll", (updatedPoll) => {
      this.poll.options = updatedPoll.options;
      //console.log(this.poll.options);
    });
    this.setChart();
  }

  onOptionSelect (value: number) {
    this.selectedValue = value;
    //console.log(this.selectedValue);
  }

  setChart () {
    this.clearChart();
    for(let i = 0; i < this.poll.options.length; i++) {
      this.pieChartLabels.push(this.poll.options[i].text);
      this.pieChartData.push(this.poll.options[i].count);
    }
    console.log(this.pieChartLabels);
    console.log(this.pieChartData);
  }

  clearChart() {
    this.pieChartLabels = [];
    this.pieChartData = [];
  }
}
