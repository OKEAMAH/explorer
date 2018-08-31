/*CORE*/
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {Params} from '@angular/router/src/shared';
/*SERVICES*/
import {CommonService} from '../../services/common.service';
import {LayoutService} from '../../services/template.service';
/*MODELS*/
import {Address} from '../../models/address.model';
import {Transaction} from '../../models/transaction.model';
import {Holder} from '../../models/holder.model';
import {QueryParams} from '../../models/query_params';
/*UTILS*/
import {AutoUnsubscribe} from '../../decorators/auto-unsubscribe';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
@AutoUnsubscribe('_subsArr$')
export class AddressComponent implements OnInit {
  address: Observable<Address>;
  transactions: Transaction[] = [];
  token_holders: Holder[] = [];
  transactionQueryParams: QueryParams = new QueryParams();
  holderQueryParams: QueryParams = new QueryParams();
  transactionScrollState = true;
  holderScrollState = true;
  addrHash: string;

  private _dataLoading = false;
  private _subsArr$: Subscription[] = [];

  constructor(private _commonService: CommonService, private _route: ActivatedRoute, private _layoutService: LayoutService) {
  }

  ngOnInit() {
    this._subsArr$.push(
      this._route.params.pipe(
        filter((params: Params) => !!params.id),
      ).subscribe((params: Params) => {
        this.addrHash = params.id;
        this._layoutService.isPageLoading.next(true);
        this.getAddress();
      })
    );
    this._subsArr$.push(this.transactionQueryParams.state.subscribe(() => {
      this.getTransactionData();
    }));
    this._subsArr$.push(this.holderQueryParams.state.subscribe(() => {
      this.getHolderData();
    }));
  }

  getAddress() {
    this.address = this._commonService.getAddress(this.addrHash).pipe(
      // getting token holder data if address is contract
      tap((addr: Address) => {
        this._layoutService.isPageLoading.next(false);
        if (addr.contract && addr.go20) {
          this.getHolderData();
        }
        this.getTransactionData();
      })
    );
  }

  getTransactionData() {
    this._dataLoading = true;
    this._commonService.getAddressTransactions(this.addrHash, this.transactionQueryParams.params).subscribe((data: any) => {
      if (data.transactions && data.transactions.length) {
        this.transactions = this.transactions.concat(data.transactions);
        if (data.transactions.length < this.transactionQueryParams.limit) {
          this.transactionScrollState = false;
        }
      }
      this._dataLoading = false;
    });
  }

  getHolderData() {
    this._dataLoading = true;
    this._commonService.getAddressHolders(this.addrHash, this.holderQueryParams.params).subscribe((data: any) => {
      if (data.token_holders && data.token_holders.length) {
        this.token_holders = this.token_holders.concat(data.token_holders);
        if (data.token_holders.length < this.holderQueryParams.limit) {
          this.holderScrollState = false;
        }
      }
      this._dataLoading = false;
    });
  }

  onScroll(type: string) {
    if (!this._dataLoading) {
      switch (type) {
        case 'transaction':
          this.transactionQueryParams.next();
          break;
        case 'holder':
          this.holderQueryParams.next();
          break;
      }
    }
  }
}
