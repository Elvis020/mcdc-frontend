# Brief
So i want to create a project and this project is about electronic medical cause of death certificate.

## Problem 
  When people die, a medical doctor fills out a form called the medical cause of death certificate. Because it is written, Medical doctors can write vague, inaccurate information during this process. Also there are some gov organizations that require this information as part of the existing standards, such as the Birth and Death registry and other public health officials. When logged(doctors) in...they should be able to access,submit and update the records accurately. There should be a 5 day window within which an edit cannot be made by a doctor on the medical cause of death. Also, asides doctors, no other user should be able to initiate or edit records. A doctor can only edit records they have initioated.
  
  Also the doctor should see a history of what they have logged. Doctors should also be able to see their last sign-in for auditing purposes, in case of anything. Keep in mind that the app will not be only for doctors...once the doctor submits the information, a copy goes to the Birth and Death registry and the Health Department; thus these people can be users and have access to the records. Asides the birth and death registry, other health information professionals can also have access but the access should be restricted based on the district or region to which the account is registered. Also the doctors should be able to print the certificate or send pdf version to clients. A doctor can save progress of a medical cause of death certificate without submitting in which case other users cannot see it. A doctor can only see their medical cause of deaths but health information professionals and the birth and death registry will see all records based on the level of access of the account.
  
  I have attached a report.jpeg file for reference.That is the form they fill.

## In Summary, there are 3 roles
* Doctor
  * Signs-in with their MedID(or email for now) and they are able to log the data into the cause-of-death form.
  * Able to view history of certificates.
  * Able to save as draft during the filling of the cause-of-death form.
  * Once they are done filling the form, they print-out or share a QR code to requester
* Ministry Personnel
  * Cause-of-death requesters come to them with a QR code.
  * They recieve the QR code and then scan it, during the scanning, the certificate is printed based on the information on the QR code.
  * Whoever printed it, has their name in audit or records
* Role 3(will fill out their responsibilities soon)
