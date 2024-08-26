package com.kh.last.model.dto;

public class PhoneChangeRequest {
    private String currentPhone;
    private String newPhone;
    private String verificationCode;

    // getters and setters
    public String getCurrentPhone() {
        return currentPhone;
    }

    public void setCurrentPhone(String currentPhone) {
        this.currentPhone = currentPhone;
    }

    public String getNewPhone() {
        return newPhone;
    }

    public void setNewPhone(String newPhone) {
        this.newPhone = newPhone;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}