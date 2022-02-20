import { Component } from '@angular/core';

import * as signalR from "@microsoft/signalr";

import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //SignalR 'a bağlantı kuruldu
  connection: signalR.HubConnection;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/satishub")
      .build();

    this.connection.start();


    this.connection.on("receiveMessage", message => {

      this.chart.showLoading();
      //Gelen mesajı yazdır
      console.log(message);


      //grafik te göstermek için
      for (let i = 0; i < this.chart.series.length; i++) {
        this.chart.series[i].remove();
      }
      for (let i = 0; i < message.length; i++) {
        this.chart.addSeries(message[i]);
      }
      this.updateFromInput = true;
      this.chart.hideLoading();
    });

    //grafik te göstermek için
    const self = this;
    this.chartCallback = chart => {
      self.chart = chart;
    };



  }

  //Veritabanındaki verileri grafikte göstermek için tanımlama lazım
  chart;
  updateFromInput = false;
  chartCallback;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    // Grafikle ilgili belirli operasyonları giriyoruz 
    // Grafik Title
    title: {
      text: "Satış"
    },
    //Alt Title
    subtitle: {
      text: "Kişilere ait satış bilgileri"
    },
    //Y Ekseni 
    yAxis: {
      title: {
        text: "Y Eksini"
      }
    },
    // X Ekseni
    xAxis: {
      accessibility: {
        rangeDescription: "2019 - 2020"
      }
    },
    //Karşılaştırma
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle"
    },
    //Tema ayarları
    series: [
      // {
      //   name: "A",
      //   type: "line",
      //   data: [100, 200,300]
      // }
    ],
    plotOptions: {
      series: {
        label: {
          connectorAllowed: true
        },
        // X ekseni başlama noktası
        pointStart: 100
      }
    }
  }
}
