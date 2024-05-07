import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltip],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.css'
})
export class PhotoGalleryComponent implements OnInit {
  uploadService = inject(FileUploadService);
  fileUploads?: any[];

  //Container to hold a list of items
  items: any[] | undefined;

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
