import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Action } from './helpers/action.enum';
import { MustMatch } from './helpers/must-match-validator';
import { UserApi } from './helpers/user-api.service';
import { User } from './helpers/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'user registration';

  addForm: FormGroup;
  submitted: boolean = false;
  @ViewChild('content') elContent :any;
  modalRef :any;
  buttonText: string = '';
  formTitle :string ='';
  dbops: Action;
  userData:User[] = [];
  constructor(private _toastr: ToastrService,private modalService: NgbModal, private _userapi:UserApi){

  }
  ngOnInit(){
  
    this.setFormState();
    this.getAllUsers();
  }

  setFormState(){
    
    this.buttonText = "Save";
    this.formTitle = 'Add User';
    this.dbops = Action.create;
    this.addForm = new FormGroup({
      id: new FormControl(0),
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      lastName : new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      dob: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required])),
      acceptTerms: new FormControl(false, Validators.requiredTrue)    
    },
    MustMatch('password', 'confirmPassword'));
  }
  get ctrl(){
    return this.addForm.controls;
  }
  addUser(){

    this.submitted = true;
    if(this.addForm.invalid){
      return;
    }
    switch(this.dbops){
      case Action.create:
        //code here to save data in database
        this._userapi.addUser(this.addForm.value).subscribe(res => {
          this._toastr.success('user added', 'user registration');
          this.getAllUsers();
          this.cancelForm();
        })
      
        break;
      case Action.update:
         //code here to update data in database
         this._userapi.updateUser(this.addForm.value).subscribe(res => {
          this._toastr.success('updated added', 'user registration');
          this.getAllUsers();
          this.cancelForm();
        })
        break;
    }
   

  }
  cancelForm(){
    this.buttonText = "Save";
    this.formTitle = 'Add User';
    this.dbops = Action.create;
    this.submitted = false;

    this.addForm.reset({
      id:0,
      title: '',
      firstName: '',
      lastName : '',
      email: '',
      dob: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    });
    this.modalRef.close();
  }
  openXl(content: any) {
    this.modalRef = this.modalService.open(content, { size: 'xl' });
	}
getAllUsers(){
  this._userapi.getUsers().subscribe((res: User[]) => {
    this.userData = res;
  })
}
  edit(userId:any){
    this.buttonText = "Update";
    this.formTitle = "Update User"  
    this.dbops = Action.update;
    let user = this.userData.find((u:User) => u.id === userId);
    this.addForm.patchValue(user);
    this.addForm.get('password').setValue('');
    this.addForm.get('confirmPassword').setValue('');
    this.addForm.get('acceptTerms').setValue(false);
    this.modalRef= this.modalService.open(this.elContent, { size: 'xl' } );
  }
  delete(id:any){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this record!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, Keep it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // code here to delete
          this._userapi.deleteuser(id).subscribe(res => {
            this.getAllUsers();
            Swal.fire(
              'Deleted!',
              'user data has been deleted.',
              'success'
            )
          });
         
        }else{
          Swal.fire(
            'Cancel!',
            'Your record is safe',
            'error'
          )
        }
      })
  }
}


