import { Component, OnInit } from '@angular/core';
import { FileControllerService } from 'src/app/api/services';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@full-fledged/alerts';
import { Receipt } from 'src/app/api/models';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { trigger, state, style } from '@angular/animations';

@Component({
  selector: 'app-admin-receipts',
  templateUrl: './admin-receipts.component.html',
  styleUrls: ['./admin-receipts.component.css'],
})
export class AdminReceiptsComponent implements OnInit {

  // form controls
  public receiptUploadForm: FormGroup;
  uploading: boolean = false;

  //receipts
  allreceipts: Receipt[] = [];

  //image to show
  imagePath: any = null;
  fileToUpload: File = null;

  modalRef: MDBModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private fileControllerService: FileControllerService,
    private alertService: AlertService,
    private _sanitizer: DomSanitizer
  ) { }

  modalOptions = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: '',
    containerClass: '',
    animated: true,
    data: {
      heading: 'Modal heading',
      content: { heading: 'Content heading', description: 'Content description' }
    }
  }

  ngOnInit(): void {
    this.receiptUploadForm = this.formBuilder.group({
      receipt_description: ['', Validators.required],
      receipt_amount: ['', Validators.required],
      receipt_file: ['', Validators.required]
    });

    this.getAllReceipts();
  }

  get f() {
    return this.receiptUploadForm.controls;
  }

  UploadReceipt() {

    this.uploading = true;

    // stop here if form is invalid
    if (this.receiptUploadForm.invalid) {
      this.alertService.warning("vul a.u.b. alle vereisten velden in")
      this.uploading = false;
      return;
    }

    var receipt_description = this.f.receipt_description.value;
    var receipt_amount: number = this.checkPaidAmount(this.f.receipt_amount.value)

    this.fileControllerService.uploadReceiptFile({ file: this.fileToUpload, description: receipt_description, paidAmount: receipt_amount }).subscribe(() => {
      this.alertService.success("De bon met informatie is opgeslagen op de server")
      this.uploading = false;
      this.getAllReceipts();
    }, error => {
      this.uploading = false;
      this.alertService.danger(error.error.message)
    })
  }

  checkPaidAmount(inputAmount): number {
    console.log(inputAmount);


    var paid_amount = inputAmount.toString();
    var inputsaldo = null;

    if (paid_amount.includes(',')) {
      inputsaldo = +paid_amount.replace(/,/g, '');
    }
    else {
      inputsaldo = +paid_amount * 100;
    }

    return inputsaldo
  }

  RetrieveImage(fileName) {
    this.fileControllerService.getReceiptFileByName(fileName).subscribe(data => {
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data.receiptFile);
    })
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);

  }

  getAllReceipts() {
    this.fileControllerService.getAllReceipts().subscribe(receipts => {
      this.allreceipts = receipts;
      console.log(this.allreceipts);
    });
  }

}

