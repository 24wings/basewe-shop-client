import { Component, OnInit ,ViewChild, ViewChildren} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from "@angular/router";
// import { userInfo } from 'os';
import { reduce } from 'rxjs/operators';
import { tick } from '@angular/core/testing';
import { Params ,OnsNavigator} from 'ngx-onsenui';
import * as ons from 'onsenui';

import { Observable } from "rxjs/Observable";
 
import { UnPaidComponent } from "../un-paid/un-paid.component"
// import { UnpayOrderComponent } from '../../com/unpay-order/unpay-order.component';

 
@Component({
  selector: 'ons-page[app-create-order]',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})

export class CreateOrderComponent implements OnInit {
  @ViewChild("addAddress")
  animation: string = 'default';
  addAddress:any;
  visible: boolean = false;
  orderId: any; 
  buyNum: number = 1;
  order:BangweiOrder;
  reduction:BangweiReduction;
addressId :any;
  ticketIds:any;

  
  truePayMoney = 0; addresses: ShopUserReciveAddress[] = []
  tickets:{_id?:string,reduction:BangweiReduction,checked?:boolean}[]=[];
  ticket:{reduction:BangweiReduction}
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
  toggle() {
    this.visible = !this.visible;
  };
  async close() {
    this.hide()
  }
  showallTicket: boolean = false;
 newAddress:ShopUserReciveAddress={
    name:'',
    phone:'',
    region:'',
    city:'',
    area:'',
    detailAddress: '',
    isDefault:true,
    publishRequire: '',
    publishContent: '',
    shopuser:'',
    publishDt:new Date()
  }
  orders: { _id?: string, num: number, product: BangweiProduct, checked?: boolean }[] = [];
  // product: BangweiProduct;
  // public params: Params,
    // public navigatory: OnsNavigator
   defaultAddress:ShopUserReciveAddress
  constructor(public apiService: ApiService, public route: ActivatedRoute, public router: Router, public params: Params, public navigatory: OnsNavigator) { 
    this.orderId = this.params.data.orderId;

  }

  async ngOnInit() {
   await this.getUserDafalAddress() 
   await this.getOrderDetail(this.orderId)
    await this.findMyaddredd();
   this.allMoney()
    this.chooseDiscount()
  }
  async getUserDafalAddress(){
    this.defaultAddress = await this.apiService.getUserDefailtReciveAddress();
 

  }
   
  async getOrderDetail(order){
    
    this.order = await this.apiService.getOrderDetail(order)
 
   
    // console.log(this.order)
 
  }
  addBuyNum() {
    this.apiService.userAddOrderNum(this.orderId)
    this.buyNum++;
    this.truePayMoney = 0;
    this.allMoney()
 
  }
  lessBuyNum() {
    this.buyNum > 0 ? this.buyNum-- : (this.buyNum = 0);
    this.allMoney()
  }
  allMoney() {
    this.truePayMoney = 0;
    this.truePayMoney = this.buyNum * this.order.product.price;
    let  tickets=this.tickets.filter(ticket=>ticket.checked)
    tickets.forEach(ticket=>{this.truePayMoney-=ticket.reduction.value})
    // console.log(this.truePayMoney) //最后总价格
  }
  async addOrderDafaulAddress(){
    let newAddress = await this.apiService.createShopUserReciveAddress(this.newAddress);
    // console.log(newAddress)
  }
  async findMyaddredd(address?) {
console.log(address);
    let result = await this.apiService.shopUserReciveAddress();
    let newAddress = result.reciveAddress[0];
    if(address ){
      if(address._id)
         await this.apiService.setDefaultReciveAddress(address._id);
      await this.getUserDafalAddress() 
      return;

    }
    if(newAddress){
      await this.apiService.setDefaultReciveAddress(newAddress._id);
      await this.getUserDafalAddress() 
    }
    

    }
  async chooseDiscount(){
    this.tickets=await this.apiService.userActiveTickets();
     
    this.tickets.forEach(ticket=>ticket.checked=false);
    if (this.tickets[0]) this.tickets[0].checked = true;
    this.allMoney()  
  }
  selectTicket(ticket){
    this.show() 
    this.tickets.forEach(ticket=>ticket.checked=false);
 ticket.checked=true;
//  console.log(ticket.reduction.value)
 
    this.allMoney()
  }
  
 
async  pay(){
if(this.defaultAddress){
 this.defaultAddress._id
  // this.router.navigateByUrl(`/un-paid?orderId=${this.orderId}&reciveAddressId=${this.defaultAddress._id}&ticketIds=${this.tickets.filter(ticket => ticket.checked).map(ticket => ticket._id).join(',') }&truePayMoney=${this.truePayMoney}`)
  // this.apiService.goUnpay(this.orderId, this.defaultAddress._id, this.ticketIds,this.truePayMoney)


  this.navigatory.element.pushPage(UnPaidComponent,{
    data:{
    orderId:this.orderId,
    reciveAddressId:this.defaultAddress._id,
      ticketIds: this.tickets.filter(ticket => ticket.checked).map(ticket => ticket._id),
  truePayMoney:this.truePayMoney

    }
  })
}else{
this.addAddress.show()
}
// this.router.navigateByUrl('/un-paid?orderId=' + this.orderId)
  
  
}
 
}
