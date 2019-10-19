import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import {SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from '@microsoft/sp-http'; 
import styles from './ChartsPanelWebPart.module.scss';
import * as strings from 'ChartsPanelWebPartStrings';
import 'jquery';
require('bootstrap');
import 'charts';
var $: any = (window as any).$;
var google: any = (window as any).google;

export interface IChartsPanelWebPartProps {
  description: string;
}

export default class ChartsPanelWebPart extends BaseClientSideWebPart<IChartsPanelWebPartProps> {

  public render(): void {

    let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssURL);

    this.domElement.innerHTML = `
    <div class=${styles.chartsPanel}>
      <div class=${styles.FilterSection}>
          <div style="margin-top:5px;float:left;padding-left:10px;">
                  <i class="fa fa-filter" style="font-size:24px;color: green"></i>
          </div>
        <div style="margin-top:5px;float:left;padding-left:10px;">
          <select class=${styles.Filters} style="background-color: #70e690">
              <option>Supplier 1</option>
              <option>Supplier 2</option>
          </select>
        </div>
   <div style="margin-top:5px;float:left;padding-left:10px;">
            <select class=${styles.Filters} style="background-color: #70e690">
                <option>Contract 1</option>
                <option>Contract 2</option>
            </select>
  </div>
  <div style="margin-top:5px;float:left;padding-left:10px;">
            <select class=${styles.Filters} style="background-color: #70e690">
                <option>Region 1</option>
                <option>Region 2</option>
            </select>
  </div>
  <div style="margin-top:5px;float:left;padding-left:10px;">
            <select class=${styles.Filters} style="background-color: #70e690">
                <option>Country 1</option>
                <option>Country 2</option>
    </select>
  </div>
  <div style="margin-top:5px;float:left;padding-left:10px;">         
      <button id="id_filter" type="button" class="btn btn-info" style="margin-top: 0px !important">Filter</button>
      </div>
  </div>
  
  <div id="HeaderContainer" class="col-md-12" style="margin-bottom:10px;background-color:#f0f0f5;">
      <div class="col-md-3" style="padding-left: 5px !important;padding-right:5px !important">
          <div class="col-md-12 ${styles.Cards}">
              <div class=${styles.divContentHeading}>Total suppliers managed</div>
              <br />
              <div id="id_TotalSuppliers" class=${styles.divContentValueType1}>7</div>
          </div>
  
          <div class="col-md-12 ${styles.CardsAlternate}">
                  <div class=${styles.divContentHeading}>Total active contracts</div>
                  <br />
                  <div id="id_TotalSuppliers" class=${styles.divContentValueType1}>358</div>
          </div>
  
          <div class="col-md-12 Cards ${styles.Cards}" >
                  <div class=${styles.divContentHeading}>Annual contract value</div>
                  <br />
                  <div id="id_TotalSuppliers" class=${styles.divContentValueType1}>6,52,824</div>
          </div>
  
          <div class="col-md-12 ${styles.CardsAlternate}">
                  <div class=${styles.divContentHeading}>Contracts expiring</div>
                  <br />
                  <div id="id_TotalSuppliers" class=${styles.divContentValueType1}>2</div>
          </div>
  
          <div class="col-md-12 ${styles.Cards}" id="div_PR">
                  <div class=${styles.divContentHeading}>PRs pending approval</div>
                  <br />
                          <table>
                              <tr>
                                  <td class=${styles.divContentValueType2Label}>Count</td>
                                  <td class=${styles.divContentValueType2Value}>6</td>
                              </tr>
                              <tr class=${styles.AmountValues}>
                                  <td class=${styles.divContentValueType2Label}>Amount</td>
                                  <td class=${styles.divContentValueType2Value}>413</td>
                              </tr>
                          </table>
          </div>
  
          <div class="col-md-12 ${styles.CardsAlternate}" id="div_IP">
                  <div class=${styles.divContentHeading}>Invoices pending</div>
                          <br />
                          <table>
                              <tr>
                                  <td class=${styles.divContentValueType2Label}>Count</td>
                                  <td class=${styles.divContentValueType2Value}>4</td>
                              </tr>
                              <tr class=${styles.AmountValues}>
                                  <td class=${styles.divContentValueType2Label}>Amount</td>
                                  <td class=${styles.divContentValueType2Value}>612</td>
                              </tr>
                          </table>
          </div>     
      </div>
      <div class="col-md-3" style="padding-left: 5px !important;padding-right:5px !important">
              <div class="col-md-12 ${styles.LargeTrendGraph}">
                  <table style="width: 100%">
                      <tr>
                          <td style="width: 10%;background-color: yellow;text-align: center">
                                 <span class=${styles["vertical-text"]}>3 Year spend trend</span>
                          </td>
                          <td style="width: 90%">
                                  <div id='spend_chart'></div>
                          </td>
                      </tr>
                  </table>
                                     
              </div>
              <div class="col-md-12 ${styles.LargeTrendGraph}">                  
                      <table style="width: 100%">
                              <tr>
                                  <td style="width: 10%;background-color: yellow;text-align: center">
                                         <span class=${styles["vertical-text"]}>3 year obligation compliance</span>
                                  </td>
                                  <td style="width: 90%">
                                          <div id='compliance_chart'></div> 
                                  </td>
                              </tr>
                          </table>
                              
              </div>
              <div class="col-md-12 ${styles.LargeTrendGraph}">
                      <table style="width: 100%">
                              <tr>
                                  <td style="width: 10%;background-color: yellow;text-align: center">
                                         <span class=${styles["vertical-text"]}> 3 year SLA trend</span>
                                  </td>
                                  <td style="width: 90%">
                                          <div id='SLA_chart'></div> 
                                  </td>
                              </tr>
                          </table>
                      
              </div>
              <div class="col-md-12 ${styles.LargeTrendGraph}" style="margin-bottom:10px;">
                      <table style="width: 100%">
                              <tr>
                                  <td style="width: 10%;background-color: yellow;text-align: center">
                                         <span class=${styles["vertical-text"]}>&nbsp;3-year service credit trend</span>
                                  </td>
                                  <td style="width: 90%">
                                          <div id='credit_chart'></div> 
                                  </td>
                              </tr>
                          </table>                        
              </div>
      </div>
      <div class="col-md-6" style="padding-left: 5px !important;padding-right:5px !important">
              <div class="Row ${styles.TableCardRow}" style="margin-left:5px;">
                      <div class="col-md-6 ${styles.TableCardColumnLeft}"> 
                              <table id="SupplierDetailsTable" class=${styles.CustomTable} style="height: 250px">
                                  <th colspan="2">
                                      Top 3 Suppliers by spend
                                  </th>
                                  <tr><td class=${styles.TableSecondHeader}><strong>Supplier Name</strong></td><td class=${styles.TableSecondHeader}><strong>Amount ('000 USD)</strong></td></tr>
                                  <tr><td>Supplier 3</td><td>2,97,846</td></tr>
                                  <tr><td>Supplier 1</td><td>1,43,743</td></tr>
                                  <tr><td>Supplier 2</td><td>1,26,607</td></tr>
                              </table>
              </div>
              <div class="col-md-6 ${styles.TableCardColumnRight}" >
                      <div class=${styles.ActionContainer}>Open Actions</div>
                      <div class=${styles.HistogramContent}>
                          <div id="chart_div"></div>
                      </div>                   
              </div> 
              </div>
              <div class="col-md-12 ${styles.TableCardRow}">
                      <table id="ContractDetailsTable" class=${styles.CustomTable} style="height: 250px">
                              <th> Supplier Name </th>
                              <th> No. of Contracts </th>
                              <th> Annual Contract Value (in '000 USD)</th>
                              <th> Overall contract compliance % </th>
                          
                              <!--First Row Data-->
                              <tr>
                                  <td>Supplier 3</td>
                                  <td>71</td>
                                  <td>2,97,846</td>
                                  <td style="background-color: #cae8c5">97</td>
                                  
                              </tr>
                  
                                <!--Second Row Data-->
                                <tr>
                                  <td>Supplier 1</td>
                                  <td>40</td>
                                  <td>1,43,743</td>
                                  <td style="background-color: #f5bcbc">65</td>
                                  
                              </tr>
                  
                               <!--Third Row Data-->
                               <tr>
                                  <td>Supplier 2</td>
                                  <td>35</td>
                                  <td>1,26,607</td>
                                  <td style="background-color: #f5bcbc">66</td>
                                  
                              </tr>
                  
                              <!--Fourth Row Data-->
                              <tr>
                                      <td>Supplier 5</td>
                                      <td>80</td>
                                      <td>30,542</td>
                                      <td style="background-color: #f7eca6">72</td>
                                      
                                  </tr>
                  
                              <!--Fifth Row Data-->
                               <tr>
                                      <td>Supplier 4</td>
                                      <td>120</td>
                                      <td>21,828</td>
                                      <td style="background-color: #cae8c5">90</td>
                                      
                                  </tr>
                  
                                  <!--Sixth Row Data-->
                               <tr>
                                      <td>Supplier 6</td>
                                      <td>9</td>
                                      <td>6,814</td>
                                      <td style="background-color: #f7eca6">88</td>
                                      
                                  </tr>
                  
                                  <!--Seventh Row Data-->
                               <tr>
                                      <td>Supplier 7</td>
                                      <td>9</td>
                                      <td>14,516</td>
                                      <td style="background-color: #f7eca6">77</td>
                                      
                                  </tr>
                          </table>
              </div>
              <div class="col-md-12 ${styles.TableCardRow}">
                      <table id="ContractDetailsTable" class=${styles.CustomTable} style="height: 250px">
                              <th> Supplier Name </th>
                              <th> Contract Name </th>
                              <th> Contract Type</th>
                              <th> Contract Value (in '000 USD) </th>
                          
                              <!--First Row Data-->
                              <tr>
                                  <td>Supplier 1</td>
                                  <td>1</td>
                                  <td>SOW-ABC</td>
                                  <td>95</td>
                                  
                              </tr>
                  
                                <!--Second Row Data-->
                                <tr>
                                  <td>Supplier 4</td>
                                  <td>2</td>
                                  <td>CR_SOW_110027</td>
                                  <td>1,126</td>
                              </tr>
                          </table>
              </div>
      </div>
  </div>
</div>`;
      this.LoadCharts();
}

public LoadCharts() :void{
          google.charts.load('current', {'packages':['corechart']});
          google.charts.setOnLoadCallback(this.drawVisualization); 
          google.charts.setOnLoadCallback(this.drawSpendChart);  
          google.charts.setOnLoadCallback(this.drawComplianceChart);
          google.charts.setOnLoadCallback(this.drawSLAChart);
          google.charts.setOnLoadCallback(this.drawCreditChart);
}

public drawComplianceChart():void {
  var data = google.visualization.arrayToDataTable([
      ['Supplier', '2017', '2018', '2019'],
      ['Supplier 1', 1000, 800, 600],
      ['Supplier 2', 1250, 760, 800],
      ['Supplier 3', 1300, 690, 1000],
      ['Supplier 4', 1030, 670, 1300]
  ]);
  var options = {
      title: '',
      curveType: 'function',
      hAxis: { textPosition: 'none' },
      vAxis: { textPosition: 'none', viewWindow: { min: 600, max: 1400 }, gridlines: { count: 2 } },
      legend: { position: 'bottom' },
      colors: ['#ff4136', '#ff6d00', '#3d108a'],
      titleTextStyle: { fontName: 'EYInterstate Light', fontSize: 13 }
  };
  var chart = new google.visualization.LineChart(document.getElementById('compliance_chart'));
  chart.draw(data, options);
}
public drawSLAChart():void {
  var data = google.visualization.arrayToDataTable([
      ['Supplier', '2017', '2018', '2019'],
      ['Supplier 1', 1000, 970, 600],
      ['Supplier 2', 1170, 920, 800],
      ['Supplier 3', 1070, 880, 1000],
      ['Supplier 4', 970, 820, 1300]
  ]);
  var options = {
      title: '',
      curveType: 'function',
      hAxis: { textPosition: 'none' },
      vAxis: { textPosition: 'none', viewWindow: { min: 600, max: 1400 }, gridlines: { count: 2 } },
      legend: { position: 'bottom' },
      colors: ['#ff4136', '#ff6d00', '#3d108a'],
      titleTextStyle: { fontName: 'EYInterstate Light', fontSize: 13 }
  };
  var chart = new google.visualization.LineChart(document.getElementById('SLA_chart'));
  chart.draw(data, options);
}
public drawCreditChart():void {
  var data = google.visualization.arrayToDataTable([
      ['Supplier', '2017', '2018', '2019'],
      ['Supplier 1', 1250, 940, 600],
      ['Supplier 2', 1150, 820, 800],
      ['Supplier 3', 1200, 900, 1000],
      ['Supplier 4', 1050, 960, 1300]
  ]);
  var options = {
      title: '',
      curveType: 'function',
      hAxis: { textPosition: 'none' },
      vAxis: { textPosition: 'none', viewWindow: { min: 500, max: 1400 }, gridlines: { count: 2 } },
      legend: { position: 'bottom' },
      colors: ['#ff4136', '#ff6d00', '#3d108a'],
      titleTextStyle: { fontName: 'EYInterstate Light', fontSize: 13 }
  };
  var chart = new google.visualization.LineChart(document.getElementById('credit_chart'));
  chart.draw(data, options);
}

public drawVisualization():void { 
var data = google.visualization.arrayToDataTable([
['','',{ role: 'style' }],
['Critical', 2,'color: red'],
['High', 5,'color: orange'],
['Medium',12,'color: yellow'],
['Low',4,'color: green']
]);
var options = {
title : '',
vAxis: {title: '', titleTextStyle: {fontName:'EYInterstate Light', fontSize:13}},
hAxis: {title: '', titleTextStyle: {fontName:'EYInterstate Light', fontSize:13}},
seriesType: 'bars',
series: {5: {type: 'line'}},
titleTextStyle: {fontName:'EYInterstate Light', fontSize:16},
legend: 'none',
};
var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
chart.draw(data, options);
}

public drawSpendChart() :void{
  var data = google.visualization.arrayToDataTable([
    ['Supplier', '2017', '2018', '2019'],
    ['Supplier 1', 1000, 850, 600],
    ['Supplier 2', 1300, 880, 800],
    ['Supplier 3', 1250, 920, 1000],
    ['Supplier 4', 1150, 1000, 1100]
]);
var options = {
    title: '',
    curveType: 'function',
    hAxis: { textPosition: 'none' },
    vAxis: { textPosition: 'none', viewWindow: { min: 600, max: 1400 }, gridlines: { count: 2 } },
    legend: { position: 'bottom' },
    colors: ['#ff4136', '#ff6d00', '#3d108a'],
    titleTextStyle: { fontName: 'EYInterstate Light', fontSize: 13 }
};
var chart = new google.visualization.LineChart(document.getElementById('spend_chart'));
chart.draw(data, options);
}

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
