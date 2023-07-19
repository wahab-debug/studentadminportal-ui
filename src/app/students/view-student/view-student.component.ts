import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student={
    id :'',
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    email:'',
    mobile:0,
    genderId:'',
    profileImageUrl:'',
    gender:{
      id:'',
      description:''

    },
    address:{
      id:'',
      physicalAddress:'',
      postalAddress:''
    }



  }

  isNewStudent= false;
  header = '';
  displayProfileImageUrl = '';
  genderList: Gender[]=[];

  constructor(private readonly studentService: StudentService,
     private readonly route:ActivatedRoute,
    private readonly genderService: GenderService,
     private snackbar:MatSnackBar,
     private router:Router){}


  ngOnInit(): void{
    this.route.paramMap.subscribe(
      (params)=>{
       this.studentId = params.get('id');
       if(this.studentId){
        
        if(this.studentId.toLowerCase()==='Add'.toLowerCase())
        {
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();

          //new student
        }
        else
        {
          this.isNewStudent= false;
          this.header = 'Edit Student';
          this.studentService.getStudent(this.studentId)
        .subscribe(
          (successResponse)=>{
            this.student = successResponse;
            this.setImage();
          },
          (errorResponse)=>
          {
            this.setImage();
          }
        );


          //existing studnet
        }

        
        
        this.genderService.getGenderList()
        .subscribe(
          (successResponse)=>{
            this.genderList=successResponse;
          }
        );

       }
      }
    );

  }

  onUpdate():void { 
    this.studentService.updateStudent(this.student.id,this.student)
    .subscribe(
      (successResponse)=>{ 
        //show notif
        this.snackbar.open('Update Successful', undefined,{duration:2000});
      },
      (errorResponse)=>{
        //log it 
      }
     
      
      );
  }

  onDelete():void{
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (successResponse)=>{
        this.snackbar.open('Student deleted successfully',undefined,{duration:2000});
        setTimeout(()=>{
          this.router.navigateByUrl('students');
        },2000);
        
      },
      (errorResponse)=>{
        //log
      }
    );
  }

  onAdd(): void {
    this.studentService.addStudent(this.student)
    .subscribe
    (
      (successResponse)=>
      {
        this.snackbar.open('Student added successfully',undefined,{duration:2000});
        setTimeout(()=>{
          this.router.navigateByUrl(`students/${successResponse.id}`);
        },2000);
      },
      (errorResponse)=>
      {

      }

    );
  }

  private setImage(): void {
    if(this.student.profileImageUrl)
    {
      //fetch url
      this.displayProfileImageUrl=this.studentService.getImagePath(this.student.profileImageUrl);

    }else
    {
      //display default
      this.displayProfileImageUrl='/assets/user.jpg';

    }
    
  }
  uploadImage(event:any) :void{
    if(this.studentId)
    {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id,file)
      .subscribe
      (
        (successResponse)=>
        {
          this.student.profileImageUrl=successResponse;
          this.setImage();
          this.snackbar.open('Image Uploaded', undefined,{duration:2000});
        },
        (errorResponse)=>{}

      );
    }

  }
}
