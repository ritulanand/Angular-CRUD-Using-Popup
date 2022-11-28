
import { Injectable } from '@angular/core';
import  {InMemoryDbService} from 'angular-in-memory-web-api';
import { User } from './user.interface';
@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {


  constructor() { }
  createDb(){
    let users: User[] = [
      {
        id: 100,title: 'Mr', firstName: 'Ajit', lastName: 'kumar', dob: '2005-08-10', email: 'ajit@gmail.com',password: '123456',acceptTerms: true 

      },
      {
        id: 101,title: 'Miss', firstName: 'Sujit', lastName: 'kumar', dob: '2001-04-10', email: 'sjit@gmail.com',password: '1234567',acceptTerms: true 

      },
      {
        id: 102,title: 'Mrs', firstName: 'Rahul', lastName: 'kumar', dob: '2005-02-10', email: 'fjit@gmail.com',password: '1234568',acceptTerms: true 

      },
      {
        id: 103,title: 'Mr', firstName: 'Ritul', lastName: 'Anand', dob: '2001-08-10', email: 'gjit@gmail.com',password: '1234569',acceptTerms: true 

      },
    ]
    return {users};
  }
}
