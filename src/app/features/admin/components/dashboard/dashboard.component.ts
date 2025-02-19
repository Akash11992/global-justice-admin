import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '../../services/admin.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HttpClient } from '@angular/common/http';

Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  delegate: boolean = false;
  partner: boolean = false;
  speaker: boolean = false;
  table: boolean = false;
  notFound: boolean = false;
  joinmailing: boolean = false
  broucher: boolean = false
  refrence_pie_chart:any;
  refrence_pie_chart_label_count:any;
  refrence_pie_chart_label:any;
  salesbroucher: boolean = false
  pie_chart: any;
  bar_chart: any;
  chartoption2: any;
  graph: boolean = false;
  bargraph: boolean = false;
  value: any;
  pie_chart_label: any;
  pie_chart_label_count: any;
  bar_chart_label_date_range: any;
  bar_chart_label_complete_count: any;
  bar_chart_label_pending_count: any;
  completedData: any;
  pendingData: any;
  colorMapping:any;
  constructor(private AdminService: AdminService, private SharedService: SharedService, private httpClient: HttpClient) {
  }
  chartOptions: any;
  ngOnInit(): void {
    this.graph = true;
    this.getDelegatePieChart();

    this.getDelegateRefrenceChart();
    this.rendergraph('donutChart', 'doughnut',)
    //  this.rendergraph('LineChart',"bar")


  }

  rendergraph(id: any, type: any,) {

    // Check if there's an existing Chart on the canvas, and destroy it
    const existingChart = Chart.getChart(id);
    if (existingChart) {
      existingChart.destroy();
    }
    // const ctx = document.getElementById('pieChart');
    let backgroundColors;
    let labels;
    let data;
    if (id === 'pieChart') {
     // Specify colors for the pieChart
    //  backgroundColors = ['#64B5F6', '#FC6D6D', 'orange'];
     labels = this.pie_chart_label;
     data = this.pie_chart_label_count;  
      // Create an array of colors corresponding to the labels  
  this.colorMapping = { 'Completed': '#64B5F6',  'Cancel': '#FC6D6D','Pending': 'orange'} // Assign the same color for "cancel"    
   // Map the colors to the labels  
   backgroundColors = labels.map((label:any) => this.colorMapping[label]);
      console.log("inside pie chart", labels, data);
    } else {
      // Default colors for other charts (donutChart, LineChart)
      backgroundColors = ['#477593', '#c26364', '#00cc99'];   
     labels = this.refrence_pie_chart_label;
      data = this.refrence_pie_chart_label_count;
      console.log("inside refrence pie chart", labels, data);
    }
    new Chart(id, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: data,
          borderWidth: 1,
          backgroundColor: backgroundColors // Set custom colors here
        }]
      },
      options: {
        scales: {
          // y: {
          //   beginAtZero: true
          // }
        }
      }
    });

  }


  getDelegatePieChart() {
    // this.ngxService.start();
    this.AdminService.getDelegatePieChart().subscribe((data: any) => {

      this.pie_chart = data.data
      console.log("delegate", this.pie_chart);
      // Extract labels and data from the API response
      this.pie_chart_label = this.pie_chart.map((item: any) => item.registration_status);
      this.pie_chart_label_count = this.pie_chart.map((item: any) => item.count);
      console.log("delegate Labels:", this.pie_chart_label);
      console.log("delegate Data:", this.pie_chart_label_count);

      this.rendergraph('pieChart', 'pie')
      this.delegate = true;
      this.partner = false;
      this.speaker = false;
      this.graph = true;
      this.table = false;
      this.switchTab()
    }, (err) => {
      console.error("An error occurred while fetching data:", err);
      // Handle the error appropriately, e.g., display an error message to the user
    });
    //bar graph................
    console.log("b ar graph start");

    this.AdminService.getDelegateVerticalBarChart().subscribe((data: any) => {

      this.bar_chart = data.data
      console.log("delegate bar chart", this.bar_chart);

      // Extract labels and data from the API response
      this.bar_chart_label_date_range = this.bar_chart.map((item: any) => item.date_range);
      this.bar_chart_label_pending_count = this.bar_chart.map((item: any) => item.pending_count);
      this.bar_chart_label_complete_count = this.bar_chart.map((item: any) => item.complete_count);
      console.log("delegate Labels:bar_chart_label_date_range", this.bar_chart_label_date_range);
      console.log("delegate Labels:bar_chart_label_complete_count", this.bar_chart_label_complete_count);
      console.log("delegate Data:bar_chart_label_pending_count", this.bar_chart_label_pending_count);

      // and this.dateArray is your array of dates
      const completedataPoints = this.bar_chart_label_complete_count.map((count: number, index: number) => ({
        y: count === null ? 0 : count,
        label: this.bar_chart_label_date_range[index] // Use the date from the array
      }));
      const pendingdataPoints = this.bar_chart_label_pending_count.map((count: number, index: number) => ({
        y: count === null ? 0 : count,
        label: this.bar_chart_label_date_range[index] // Use the date from the array
      }));


      console.log("completedataPoints.........", completedataPoints);

      console.log("pendingdataPoints..........", pendingdataPoints);


      this.chartoption2 = {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: ""
        },
        axisX: {
          title: "Dates"
        },
        axisY: {
          title: "Percentage"
        },
        toolTip: {
          shared: true
        },
        legend: {
          horizontalAlign: "right",
          verticalAlign: "center",
          reversed: true
        },
        data: [{
          type: "stackedColumn100",
          name: "Completed",
          showInLegend: "true",
          indexLabel: "#percent %",
          indexLabelPlacement: "inside",
          indexLabelFontColor: "white",
          dataPoints: completedataPoints

        }, {
          type: "stackedColumn100",
          name: "Pending",
          showInLegend: "true",
          indexLabel: "#percent %",
          indexLabelPlacement: "inside",
          indexLabelFontColor: "white",
          dataPoints: pendingdataPoints

        }]
      }

      if (this.chartoption2) {
        this.bargraph = true
      }
      //................................


      // ...
      this.delegate = true;
      this.partner = false;
      this.speaker = false;
      this.graph = true;
      this.table = false;
      this.switchTab()
    }, (err) => {
      console.error("An error occurred while fetching data:", err);
      // Handle the error appropriately, e.g., display an error message to the user
    });

  }

  // getPartnerPieChart() {
  //   // this.ngxService.start();
  //   this.AdminService.getPartnerPieChart().subscribe((data: any) => {

  //     this.pie_chart = data.data
  //     console.log("partner", this.pie_chart);
  //     // Extract labels and data from the API response
  //     this.pie_chart_label = this.pie_chart.map((item: any) => item.registration_status);
  //     this.pie_chart_label_count = this.pie_chart.map((item: any) => item.count);
  //     console.log("partner Labels:", this.pie_chart_label);
  //     console.log("partner Data:", this.pie_chart_label_count);

  //     this.rendergraph('pieChart', 'pie')

  //     this.partner = true;
  //     this.delegate = false
  //     this.speaker = false
  //     this.graph = true;
  //     this.table = false;
  //     this.switchTab()
  //   }, (err) => {
  //     console.error("An error occurred while fetching data:", err);
  //     // Handle the error appropriately, e.g., display an error message to the user
  //   });

  //   //bar graph................
  //   console.log("b ar graph start");

  //   this.AdminService.getPartnerVerticalBarChart().subscribe((data: any) => {

  //     this.bar_chart = data.data
  //     console.log("delegate bar chart", this.bar_chart);

  //     // Extract labels and data from the API response
  //     this.bar_chart_label_date_range = this.bar_chart.map((item: any) => item.date_range);
  //     this.bar_chart_label_pending_count = this.bar_chart.map((item: any) => item.pending_count);
  //     this.bar_chart_label_complete_count = this.bar_chart.map((item: any) => item.complete_count);
  //     console.log("delegate Labels:bar_chart_label_date_range", this.bar_chart_label_date_range);
  //     console.log("delegate Labels:bar_chart_label_complete_count", this.bar_chart_label_complete_count);
  //     console.log("delegate Data:bar_chart_label_pending_count", this.bar_chart_label_pending_count);

  //     // and this.dateArray is your array of dates
  //     const completedataPoints = this.bar_chart_label_complete_count.map((count: number, index: number) => ({
  //       y: count === null ? 0 : count,
  //       label: this.bar_chart_label_date_range[index] // Use the date from the array
  //     }));
  //     const pendingdataPoints = this.bar_chart_label_pending_count.map((count: number, index: number) => ({
  //       y: count === null ? 0 : count,
  //       label: this.bar_chart_label_date_range[index] // Use the date from the array
  //     }));


  //     console.log("completedataPoints.........", completedataPoints);

  //     console.log("pendingdataPoints..........", pendingdataPoints);


  //     this.chartoption2 = {
  //       animationEnabled: true,
  //       exportEnabled: true,
  //       title: {
  //         text: ""
  //       },
  //       axisX: {
  //         title: "Dates"
  //       },
  //       axisY: {
  //         title: "Percentage"
  //       },
  //       toolTip: {
  //         shared: true
  //       },
  //       legend: {
  //         horizontalAlign: "right",
  //         verticalAlign: "center",
  //         reversed: true
  //       },
  //       data: [{
  //         type: "stackedColumn100",
  //         name: "Completed",
  //         showInLegend: "true",
  //         indexLabel: "#percent %",
  //         indexLabelPlacement: "inside",
  //         indexLabelFontColor: "white",
  //         dataPoints: completedataPoints

  //       }, {
  //         type: "stackedColumn100",
  //         name: "Pending",
  //         showInLegend: "true",
  //         indexLabel: "#percent %",
  //         indexLabelPlacement: "inside",
  //         indexLabelFontColor: "white",
  //         dataPoints: pendingdataPoints

  //       }]
  //     }

  //     if (this.chartoption2) {
  //       this.bargraph = true
  //     }
  //     //................................


  //     // ...
  //     this.delegate = false;
  //     this.partner = true;
  //     this.speaker = false;
  //     this.graph = true;
  //     this.table = false;
  //     this.switchTab()
  //   }, (err) => {
  //     console.error("An error occurred while fetching data:", err);
  //     // Handle the error appropriately, e.g., display an error message to the user
  //   });

  // }

  // getSpeakerPieChart() {
  //   // this.ngxService.start();
  //   this.AdminService.getSpeakerPieChart().subscribe((data: any) => {

  //     this.pie_chart = data.data
  //     console.log("speaker", this.pie_chart);
  //     // Extract labels and data from the API response
  //     this.pie_chart_label = this.pie_chart.map((item: any) => item.registration_status);
  //     this.pie_chart_label_count = this.pie_chart.map((item: any) => item.count);
  //     console.log("speaker Labels:", this.pie_chart_label);
  //     console.log("speaker Data:", this.pie_chart_label_count);

  //     this.rendergraph('pieChart', 'pie')
  //     this.speaker = true
  //     this.partner = false;
  //     this.delegate = false
  //     this.graph = true;
  //     this.switchTab()

  //   }, (err) => {
  //     console.error("An error occurred while fetching data:", err);
  //     // Handle the error appropriately, e.g., display an error message to the user
  //   });

  //   //bar graph................
  //   console.log("b ar graph start");

  //   this.AdminService.getSpeakerVerticalBarChart().subscribe((data: any) => {

  //     this.bar_chart = data.data
  //     console.log("delegate bar chart", this.bar_chart);

  //     // Extract labels and data from the API response
  //     this.bar_chart_label_date_range = this.bar_chart.map((item: any) => item.date_range);
  //     this.bar_chart_label_pending_count = this.bar_chart.map((item: any) => item.pending_count);
  //     this.bar_chart_label_complete_count = this.bar_chart.map((item: any) => item.complete_count);
  //     console.log("delegate Labels:bar_chart_label_date_range", this.bar_chart_label_date_range);
  //     console.log("delegate Labels:bar_chart_label_complete_count", this.bar_chart_label_complete_count);
  //     console.log("delegate Data:bar_chart_label_pending_count", this.bar_chart_label_pending_count);

  //     // and this.dateArray is your array of dates
  //     const completedataPoints = this.bar_chart_label_complete_count.map((count: number, index: number) => ({
  //       y: count === null ? 0 : count,
  //       label: this.bar_chart_label_date_range[index] // Use the date from the array
  //     }));
  //     const pendingdataPoints = this.bar_chart_label_pending_count.map((count: number, index: number) => ({
  //       y: count === null ? 0 : count,
  //       label: this.bar_chart_label_date_range[index] // Use the date from the array
  //     }));


  //     console.log("completedataPoints.........", completedataPoints);

  //     console.log("pendingdataPoints..........", pendingdataPoints);


  //     this.chartoption2 = {
  //       animationEnabled: true,
  //       exportEnabled: true,
  //       title: {
  //         text: ""
  //       },
  //       axisX: {
  //         title: "Dates"
  //       },
  //       axisY: {
  //         title: "Percentage"
  //       },
  //       toolTip: {
  //         shared: true
  //       },
  //       legend: {
  //         horizontalAlign: "right",
  //         verticalAlign: "center",
  //         reversed: true
  //       },
  //       data: [{
  //         type: "stackedColumn100",
  //         name: "Completed",
  //         showInLegend: "true",
  //         indexLabel: "#percent %",
  //         indexLabelPlacement: "inside",
  //         indexLabelFontColor: "white",
  //         dataPoints: completedataPoints

  //       }, {
  //         type: "stackedColumn100",
  //         name: "Pending",
  //         showInLegend: "true",
  //         indexLabel: "#percent %",
  //         indexLabelPlacement: "inside",
  //         indexLabelFontColor: "white",
  //         dataPoints: pendingdataPoints

  //       }]
  //     }

  //     if (this.chartoption2) {
  //       this.bargraph = true
  //     }
  //     //................................


  //     // ...
  //     this.delegate = false;
  //     this.partner = false;
  //     this.speaker = true;
  //     this.graph = true;
  //     this.table = false;
  //     this.switchTab()
  //   }, (err) => {
  //     console.error("An error occurred while fetching data:", err);
  //     // Handle the error appropriately, e.g., display an error message to the user
  //   });
  // }



getDelegateRefrenceChart(){
  this.AdminService.getDelegateRefrencePieChart().subscribe((data: any) => {

    this.refrence_pie_chart = data.data
    console.log("delegate refrence", this.refrence_pie_chart);
    // Extract labels and data from the API response
    this.refrence_pie_chart_label = this.refrence_pie_chart.map((item: any) => item.ref);
    this.refrence_pie_chart_label_count = this.refrence_pie_chart.map((item: any) => item.count_s);
    console.log("delegate refrence Labels:", this.refrence_pie_chart_label);
    console.log("delegate refrence Data:", this.refrence_pie_chart_label_count);

    this.rendergraph('donutChart', 'doughnut')
    this.speaker = false
    this.partner = false;
    this.delegate = true;
    this.graph = true;
    this.switchTab()

  }, (err) => {
    console.error("An error occurred while fetching data:", err);
    // Handle the error appropriately, e.g., display an error message to the user
  });
}

// getPartnerRefrenceChart(){
//   this.AdminService.getPartnerRefrencePieChart().subscribe((data: any) => {

//     this.refrence_pie_chart = data.data
//     console.log("delegate refrence", this.refrence_pie_chart);
//     // Extract labels and data from the API response
//     this.refrence_pie_chart_label = this.refrence_pie_chart.map((item: any) => item.ref);
//     this.refrence_pie_chart_label_count = this.refrence_pie_chart.map((item: any) => item.count_s);
//     console.log("delegate refrence Labels:", this.refrence_pie_chart_label);
//     console.log("delegate refrence Data:", this.refrence_pie_chart_label_count);

//     this.rendergraph('donutChart', 'doughnut')
//     this.speaker = false
//     this.partner = true;
//     this.delegate = false;
//     this.graph = true;
//     this.switchTab()

//   }, (err) => {
//     console.error("An error occurred while fetching data:", err);
//     // Handle the error appropriately, e.g., display an error message to the user
//   });
// }

// getSpeakerRefrenceChart(){
//   this.AdminService.getSpeakerRefrencePieChart().subscribe((data: any) => {

//     this.refrence_pie_chart = data.data
//     console.log("delegate refrence", this.refrence_pie_chart);
//     // Extract labels and data from the API response
//     this.refrence_pie_chart_label = this.refrence_pie_chart.map((item: any) => item.ref);
//     this.refrence_pie_chart_label_count = this.refrence_pie_chart.map((item: any) => item.count_s);
//     console.log("delegate refrence Labels:", this.refrence_pie_chart_label);
//     console.log("delegate refrence Data:", this.refrence_pie_chart_label_count);

//     this.rendergraph('donutChart', 'doughnut')
//     this.speaker = true
//     this.partner = false;
//     this.delegate = false;
//     this.graph = true;
//     this.switchTab()

//   }, (err) => {
//     console.error("An error occurred while fetching data:", err);
//     // Handle the error appropriately, e.g., display an error message to the user
//   });
// }
  switchTab() {
    console.log("active tab name delegate", this.delegate);
    // console.log("active tab name partner", this.partner);
    // console.log("active tab name speaker", this.speaker,);
    switch (true) {
      case this.delegate === true:
        console.log("active tab name delegate", this.delegate);
        this.value = "Delegate"
        break;
      // case this.partner === true:
      //   console.log("active tab name partner", this.partner);
      //   this.value = "Partner"
      //   break;
      // case this.speaker === true:
      //   console.log("active tab name speaker", this.speaker,);
      //   this.value = "Speaker"
      //   break;
    }
  }

  //...................vertical bar graph......................





  getJoinMailingList() {
    this.delegate = false;
    this.partner = false;
    this.speaker = false;
    this.joinmailing = true;
    this.broucher = false;
    this.salesbroucher = false;
    this.graph = false;
  }
  downloadBroucher() {
    this.delegate = false;
    this.partner = false;
    this.speaker = false;
    this.joinmailing = false;
    this.broucher = true;
    this.salesbroucher = false;

    this.graph = false;
  }
  downloadSalesBroucher() {
    this.delegate = false;
    this.partner = false;
    this.speaker = false;
    this.joinmailing = false;
    this.broucher = false;
    this.salesbroucher = true;
    this.graph = false;
  }


}