import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private db = inject(AngularFireDatabase)
  private storage = inject(AngularFireStorage)
  private basePath = '/uploads';

  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    const filePath = `${this.basePath}/${fileUpload.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadItem = this.storage.upload(filePath, fileUpload.file);

    uploadItem.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          //fileUpload.url = downloadURL;
          fileUpload.url = 'https://firebasestorage.googleapis.com/v0/b/pgp-site.appspot.com/o/uploads%2F' + fileUpload.name + '?alt=media';
          fileUpload.thumb = 'https://firebasestorage.googleapis.com/v0/b/pgp-site.appspot.com/o/uploads%2Fth-' + fileUpload.name + '?alt=media';
          this.saveFileData(fileUpload);
        });
      })
    ).subscribe();

    return uploadItem.percentageChanges();
  }

  pushThumbToStorage(datauri: string, filename: string) {
    const filePath = `${this.basePath}/${'th-' + filename}`;
    const storageRef = this.storage.ref(filePath);

    storageRef.putString(datauri, 'data_url').then(function (snapshot) {
      console.log('Uploaded a data_url string!');
    });

  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }

  hideFile(fileUpload: FileUpload): void {

    this.db.object('/uploads/' + fileUpload.key + '/hidden')
      .query.ref.transaction((hidden) => {
        if (hidden === true) {
          this.db.object('/uploads/' + fileUpload.key + '/hidden').remove();
        } else {
          this.db.object('/uploads/' + fileUpload.key).update({ 'hidden': true });
        }
      });
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
    storageRef.child('th-' + name).delete();
  }
}
