import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tradeLimit } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})



export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private eref: ElementRef, 
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    console.log("Home component is constructed.")
  }

  reqUrl = "https://api.binance.com/api/v3"

  public assetSet = new Set()
  public assets = []
  public allData = undefined
  public from = undefined
  public to = undefined
  public checking = false
  public properSymbol = false
  public symbolAvg = 0
  public symbolError = false
  public targetValue = ""
  public userEmail = ""
  public targetError = false
  public mailError = false
  public symbol = ""
  public closeAlert = true

  ngOnInit() {
    this.http.get(this.reqUrl + "/exchangeInfo").subscribe((data) => {
      data["symbols"].forEach((item) => {
        this.assetSet.add(item["baseAsset"])
      });
      this.allData = data
      this.assets = Array.from(this.assetSet)
    })
  }

  ngAfterViewInit() { 
    console.log("Home component is ngAfterViewInit.")
    console.log(this.assets)
  }

  async checkSymbol(symbol){
    this.checking = true
    this.properSymbol = this.allData["symbols"].filter(elem => elem.symbol === symbol).length > 0
    this.symbolError = !this.properSymbol
    if (this.properSymbol){
      this.symbol = symbol
      this.symbolAvg = 0
      this.http.get(this.reqUrl + "/trades?symbol=" + symbol +"&limit=" + tradeLimit).subscribe((data: Array<any>) => {
        data.map((item) => {
          this.symbolAvg += Number(item.price)
        })
        this.symbolAvg = this.symbolAvg / tradeLimit
      })
    }
    this.checking = false
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async setAlarm(){

    console.log(this.userEmail)
    console.log(this.targetValue)
    
    if(this.targetValue === "" || isNaN(Number(this.targetValue))){
      this.targetError = true
      return
    }
    if(this.userEmail === "" || !this.validateEmail(this.userEmail)){
      this.mailError = true
      return
    }
    await this.afs
            .collection('alarms')
            .add({
              isHappened: false,
              isUpper: this.symbolAvg < Number(this.targetValue),
              mail: this.userEmail,
              setDate: new Date().getTime(),
              symbol: this.symbol,
              targetPrice: Number(this.targetValue)
            });
    this.userEmail = ""
    this.targetValue = ""
    this.targetError = false
    this.mailError = false
    this.closeAlert = false
    this.symbol = ""
    setTimeout(() => {
      this.closeAlert = true
      this.properSymbol = false
    }, 5000);
  }
  
}