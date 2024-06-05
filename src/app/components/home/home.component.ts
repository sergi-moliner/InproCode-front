import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../interfaces/users.interface';
import * as bootstrap from 'bootstrap';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { get } from 'mongoose';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ProgressBarComponent, RouterModule],
  providers: [UserService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  listUsers: User[] = [];

  loading: boolean = false;

  userForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder, private _userService: UserService, private toastr: ToastrService) {
    this.userForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getListsUsers();
  }

  getListsUsers(): void {
    this.loading = true;
    this._userService.getListUsers().subscribe((data: User[]) => {
      console.log(data);
      this.listUsers = data;
      this.loading = false;
    });
  }

  openModal(user?: User): void {
    if (user) {
      this.userForm.setValue(user);
      this.isEditMode = true;
    } else {
      this.userForm.reset({ id: 0 });
      this.isEditMode = false;
    }
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user = this.userForm.value as User;

    if (this.isEditMode) {
      const index = this.listUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.listUsers[index] = user;
        this._userService.updateUser(user).subscribe(() => {
          this.toastr.info('User updated successfully', 'User updated');
        });
        const modalElement = document.getElementById('userModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }

      }
    } else {

      this.listUsers.push(user);
      this._userService.saveUser(user).subscribe(() => {
        this.toastr.success('User saved successfully', 'User saved');
      });

    }
    this.userForm.reset({ id: 0 });
    this.getListsUsers();
  }

  deleteUser(userId: number | undefined): void {
    if (userId !== undefined) {
      this.loading = true;
      this.listUsers = this.listUsers.filter(user => user.id !== userId);
      this._userService.deleteUser(userId).subscribe(() => {
        this.getListsUsers();
        this.toastr.warning('User deleted successfully', 'User deleted');
      });
    }
  }
}
