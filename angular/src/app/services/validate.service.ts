import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  constructor () {}
  validateRegister (user) {
    return !(
      user.name == undefined ||
      user.password == undefined ||
      user.passwordConfirm == undefined ||
      user.email == undefined ||
      user.phone == undefined
    );
  }
  validateEdit (user) {
    return !(
      user.name == undefined ||
      user.email == undefined ||
      user.phone == undefined
    );
  }
  validateLogin (user) {
    return !(user.password == undefined || user.email == undefined);
  }

  validateEmail (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  validatePassword (password) {
    return /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/.test(password);
  }

  validatePasswordConfirm (password, passwordConfirm) {
    return passwordConfirm === password;
  }
  validatePhone (phone) {
    return /^01[0-2][0-9]{8}$/.test(phone);
  }
  validateName (name) {
    return /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+ +[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_]*$/.test(
      name
    );
  }
  validateNumber (number) {
    return /^\d+$/.test(number);
  }
}

//BKWjVvHDSC2wVNTGrh3EZZFjTJtt_Qrpm25UrskuFmRFT62apSs_rRfP_NtEzIxPvUwBTtCwmPlGSi1eUkaWW8w
