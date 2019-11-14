import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements OnInit {
  modelForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.modelForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      zip: ['', [Validators.required, Validators.pattern('[0-9]{2}\-[0-9]{3}')]],
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      sex: ['', Validators.required]
    });

    this.modelForm.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.onControlValueChanged();
    });

    this.onControlValueChanged(); // ustawiamy początkowany stan walidacji

  }

  onSubmit(form) {
    console.log(form.value);
  }

  formErrors = {
    firstname: '',
    lastname: '',
    zip: '',
    email: '',
    sex: '',
  }

  private validationMessages = {
    firstname: {
      required: 'Nie wprowadzono imienia!',
      minlength: 'Wprowadzono za mało znaków! (minimum 2)',
      maxlength:'Wprowadzono zbyt dużo znaków! (maximum 15)'
    },
    lastname: {
      required: 'Nie wprowadzono nazwiska!',
      minlength: 'Wprowadzono zbyt mało znaków! (minimum 2)',
      maxlength:'Wprowadzono zbyt dużo znaków! (maximum 25)'
    },
    zip: {
      required: 'Nie wprowadzono kodu pocztowego!',
      pattern: 'Wprowadzono zły format!'

    },
    email: {
      required: 'Nie wprowadzono adresu email!',
      pattern: 'Wprowadzono zły format!'
    },
    sex: {
      required: 'Nie wprowadzono płci!'
    }
  }

  onControlValueChanged() {
    const form = this.modelForm;

    for (let field in this.formErrors) {
      this.formErrors[field] = '';
      let control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const validationMessages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += validationMessages[key] + ' ';
        }
      }
    }
  }
}
