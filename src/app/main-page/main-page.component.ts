import { Component, OnInit } from '@angular/core';
import { config, S3 } from 'aws-sdk';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public imageToShow:string;
  public tableData:Array<Array<string>>;
  public text:string;
  constructor() { }

  ngOnInit(): void {
    this.Table1();
    this.getS3('data/2021_06_29/qualification_success_rate_by_region.csv');

  }
  public getS3(key) {
    config.update({
      accessKeyId: "AKIA4J6QPG3CTOIA3V7I",
      secretAccessKey: "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",
      region: "us-east-1"
      }
    );

    let s3 = new S3()
    var getParams = {
      Bucket: 'mca-leadgen-analytical', // your bucket name,
      Key: key // path to the object you're looking for
      }
    s3.getObject(getParams, function(err, data) {
    // Handle any error and exit
    console.log(data)
    if (err)
        return err;
    });
  }
  public Table1():void {
    this.setText("Table 1");
    this.setImage("https://mca-leadgen-analytical.s3.amazonaws.com/plots/2021_06_30/distribution_of_deals_over_crm_pipelines.png");
    let s1=`creation_week,Las Vegas,Los Angeles,Modesto,Orange County,Palo Alto,Phoenix,San Diego,San Francisco
    21,111,541,46,665,160,512,315,637
    22,419,1651,163,2802,395,1951,957,2187
    23,426,1793,179,2285,384,1857,981,2067
    24,432,1745,150,2053,352,1728,999,2152
    25,472,1849,161,2150,436,1989,1001,2300
    26,104,393,32,608,121,418,213,457`;
    this.setTable(this.decodeCSV(s1));
  }
  public Table2():void {
    this.setText("Table 2");
    this.setImage("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg");
    let s2=`crm_pipeline_name,0
Auction Process,6
Buying Process,980
From web - development,1
Lost Deal,11
Selling Process,1`
    this.setTable(this.decodeCSV(s2));
  }

  public setImage(imageUrl:string):void {
    this.imageToShow=imageUrl;
  }
  public setText(text:string):void {
    this.text=text;
  }
  public setTable(tableData:Array<Array<string>>):void {
    this.tableData=tableData;
  }
  public decodeCSV(inputString:string):Array<Array<string>> {
    var lines=inputString.split('\n');
    var tableData=[];
    for (let i=0; i<lines.length;i++) {
      tableData.push(lines[i].trim().split(','));
    }
    return tableData;
  }

}
