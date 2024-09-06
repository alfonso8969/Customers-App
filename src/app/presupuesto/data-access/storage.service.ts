import { inject, Injectable } from '@angular/core';
import { Budget } from '../../class/budget.model';
import { map, Observable, Subscription, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../auth/data-access/login.service';
import * as ls from 'local-storage';

@Injectable()
export class StorageBudgetService {
  httpClient = inject(HttpClient);
  budgets: Budget[] = [];
  budget!: Budget;
  url: string = 'https://customers-987c4-default-rtdb.firebaseio.com/';
  endPoint: string = 'budgets.json';
  endPointDelUp: string = 'budgets/';

  constructor(private loginService: LoginService) {}

  getBudgetsStorage(): Observable<Budget[]> {
    return this.httpClient.get<Budget[]>(this.url + this.endPoint + '?auth=' + this.getToken());
  }

  getBudgetStorage(budgetId: number): Observable<Budget> {
    return this.httpClient
      .get<Budget[]>(this.url + this.endPoint + '?auth=' + this.getToken())
      .pipe(map((bs) => bs.find((b) => b.budgetId === budgetId)!));
  }

  storageBudgets(budgets: Budget[]) {
    let url = this.url + this.endPoint + '?auth=' + this.getToken();
    let raw = JSON.stringify(budgets);
    this.httpClient
      .put<Budget[]>(url, raw, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: 'json',
      })
      .subscribe({
        next: (data) => {
          console.log('result of save budgets: ', data);
        },
        error: (error) => {
          console.error('Error at save budgets', error);
        },
      });
  }

  deleteBudgetStorage(budgetId: number): Subscription {
    let index: number | string = budgetId! - 1;
    let url: string = this.url + this.endPointDelUp + index + '.json' + '?auth=' + this.getToken();
    return this.httpClient
      .delete<Budget>(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: 'json',
      })
      .subscribe({
        next: (data) => {
          console.log('result of delete budget: ', data);
        },
        error: (error) => {
          console.error('Error at delete budget', error);
          this.handleError(error);
        },
      });
  }

  updateBudgetStorage(budget: Budget): Subscription {
    let index: number | string = budget.budgetId! - 1;
    let url: string = this.url + this.endPointDelUp + index + '.json' + '?auth=' + this.getToken();
    var raw = JSON.stringify(budget);
    return this.httpClient
      .put<Budget>(url, raw, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'body',
        responseType: 'json',
      })
      .subscribe({
        next: (data) => {
          console.log('result of update budget: ', data);
        },
        error: (error) => {
          console.error('Error at update budget', error);
          this.handleError(error);
        },
      });
  }

  storageLocalBudget(budget: Budget): void {
    ls.set('budget', JSON.stringify(budget));
  }

  deleteStorageLocalBudget(): void {
    ls.remove('budget');
  }

  getStorageLocalBudget(): Budget {
    return JSON.parse(ls.get('budget')!);
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  getToken(): string {
    return this.loginService.getToken();
  }
}
