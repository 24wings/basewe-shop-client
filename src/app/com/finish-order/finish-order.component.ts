import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-finish-order',
  templateUrl: './finish-order.component.html',
  styleUrls: ['./finish-order.component.css']
})
export class FinishOrderComponent implements OnInit {
  @Input() order: BangweiOrder
  constructor() { }

  ngOnInit() {
  }

}
