import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUpload } from '../../models/file-upload.model';
import { map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { UploadFormComponent } from '../upload-form/upload-form.component'


@Component({
  selector: 'app-upload-list',
  standalone: true,
  imports: [
    CommonModule,
    UploadFormComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltip
  ],
  templateUrl: './upload-list.component.html',
  styleUrl: './upload-list.component.css'
})
export class UploadListComponent implements OnInit {

  uploadService = inject(FileUploadService);

  fileUploads: any[] = [];

  //Container to hold a list of items
  items: any[] | undefined;

  deleteFileUpload(fileUpload: FileUpload): void {
    if (confirm('Are you sure you want to delete this image?'))
      this.uploadService.deleteFile(fileUpload);
  }

  hideFileUpload(fileUpload: FileUpload): void {
    console.log(fileUpload.hidden)
    this.uploadService.hideFile(fileUpload);
  }

  ngOnInit(): void {
    this.uploadService.getFiles(100).snapshotChanges().pipe(
      map(changes =>
        // store the key
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
      this.items = fileUploads;
    });
  }
}
