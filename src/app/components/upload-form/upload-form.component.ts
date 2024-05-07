import { Component, inject } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUpload } from '../../models/file-upload.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltip,
    MatProgressBarModule
  ],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css'
})
export class UploadFormComponent {

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  uploadService = inject(FileUploadService);
  url: string | ArrayBuffer | null = 'https://placehold.co/300x300';
  datauri!: string | null;

  async addImage(files: any, event: any) {

    // Enable Upload Button
    this.selectedFiles = event.target.files;

    //Validate Image Type
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      console.log('Only images are supported.');
      return;
    }

    var reader = new FileReader();
    for (let j = 0; j < files.length; j++) {
      reader.readAsDataURL(files[j]);
      reader.onload = async (_event) => {
        var imgURL = reader.result;
        await this.resizeImage(imgURL).then((resolve: any) => {
          this.datauri = resolve;
          this.url = resolve;
        });

      };
    }

  }

  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      var image = new Image();
      image.onload = function () {

        var canvas = document.createElement('canvas');
        canvas.height = 300;
        canvas.width = 300;
        var ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, 300, 300);
        }
        var data = canvas.toDataURL('image/png', 0.8);
        resolve(data);
      };

      image.src = imageURL;
    });
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.currentFileUpload.name = Math.random().toString(36).substring(2, 15) + Math.random().toString(23).substring(2, 5) + '.jpg';

        this.uploadService.pushThumbToStorage(this.datauri!, this.currentFileUpload.name);

        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe({
          next: (percentage) => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error: (e) => console.error(e),
          complete: () => {
            this.url = 'https://placehold.co/300x300';
            this.percentage = 0;
          }
        })

      }
    }
  }

}

