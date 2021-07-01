import { Component, OnInit } from '@angular/core';
import { config, S3 } from 'aws-sdk';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public imageToShow:string;
  public tableData:Array<Array<string>>;
  public text:string;
  public s1:string;
  public tableChangeSubject = new Subject<string>();
  constructor() { }

  ngOnInit(): void {
    this.getS3('data/2021_06_29/qualification_success_rate_by_region.csv');
    this.Table1();

  }
  public async getS3(key) {
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
    // s3.getObject((data)=> {
    //   var s1=data.Body.toString('utf-8');
    //   this.tableChangeSubject.next(s1);
    // })
    try {
      const data = await s3.getObject(getParams).promise();
      return data.Body.toString('utf-8');
    } catch (e) {
      console.log("error loading from S3");
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }

    // s3.getObject(getParams, function(err, data) {

    //   var s1=data.Body.toString('utf-8');
    //   this.tableChangeSubject.next(s1);
    //   if (err)
    //       return err;
    //   });
    //   return data.Body.toString('utf-8');
  }
  public getTableChangedEvent(): Observable<string> {
    return this.tableChangeSubject.asObservable();
  }
  public Table1():void {
    this.setText("Table 1");
    this.getS3('data/2021_06_29/qualification_success_rate_by_region.csv').then((data)=>{
      this.setTable(this.decodeCSV(data));
    });
    

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
