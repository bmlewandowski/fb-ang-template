export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  thumb?: string;
  hidden?: boolean;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}