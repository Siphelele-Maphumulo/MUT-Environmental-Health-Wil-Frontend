import { Component } from '@angular/core';

@Component({
  selector: 'app-agreement',
  standalone: true,
  imports: [],
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent {
  today: string;
  activities: { activity: string; hours: number | null }[] = [];
  isScrolledToResponsibilities: boolean = false;

  constructor() {
    // Get today’s date in YYYY-MM-DD format
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];

    // Initialize with one activity row
    this.addActivity();
  }

  // Method to add an activity
  addActivity() {
    if (this.activities.length < 6) {
      this.activities.push({ activity: '', hours: null });
    }
  }

  // Method to remove an activity
  removeActivity(index: number) {
    if (this.activities.length > 1) { // Ensures there’s always at least one activity row
      this.activities.splice(index, 1);
    }
  }

  // Method to validate activity selection on form submission
  validateActivitySelection() {
    const checkboxes = document.querySelectorAll('input[name="activities"]:checked');
    const checkedCount = checkboxes.length;

    if (checkedCount === 0) {
      alert("You must select at least one activity.");
      return false;
    } else if (checkedCount > 6) {
      alert("You can select a maximum of 6 activities.");
      return false;
    }

    // Validate hours input for each checked activity
    let allHoursEntered = true;
    checkboxes.forEach((checkbox) => {
      const hoursInput = (checkbox.parentElement?.nextElementSibling as HTMLInputElement);
      if (hoursInput && (!hoursInput.value || parseInt(hoursInput.value) <= 0)) {
        allHoursEntered = false;
      }
    });

    if (!allHoursEntered) {
      alert("Please enter valid hours for all selected activities.");
      return false;
    }

    // Validate all textareas are filled
    const requiredTextareas = document.querySelectorAll('textarea[required]');
    let allTextareasFilled = true;
    requiredTextareas.forEach((textarea) => {
      if (!(textarea as HTMLTextAreaElement).value.trim()) {
        allTextareasFilled = false;
      }
    });

    if (!allTextareasFilled) {
      alert("Please fill in all required fields in the reflection section.");
      return false;
    }

    // Validate student signature upload
    const studentSignatureInput = document.getElementById('student_signature') as HTMLInputElement;
    if (!studentSignatureInput || !studentSignatureInput.files || studentSignatureInput.files.length === 0) {
      alert("Cannot upload logsheet with no student signature.");
      return false;
    }

    // Continue with form submission if validation passes
    alert("Form submitted successfully!");
    return true;
  }

  // Method to handle scrolling and enabling Agree button
  handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    const responsibilitiesSection = document.querySelector('h4#Responsibilities') as HTMLElement;
    if (responsibilitiesSection) {
      this.isScrolledToResponsibilities = target.scrollTop + target.clientHeight >= responsibilitiesSection.offsetTop;
    }
    const agreeButton = document.getElementById('agree-btn') as HTMLButtonElement;
    if (agreeButton) {
      agreeButton.disabled = !this.isScrolledToResponsibilities;
      agreeButton.style.display = this.isScrolledToResponsibilities ? 'block' : 'none';
      if (!this.isScrolledToResponsibilities) {
        agreeButton.innerText = "Scroll to the Responsibilities section to agree";
      } else {
        agreeButton.innerText = "I Agree";
      }
    }
  }
}
