<template>
<body> 
    <div id="infosCustomer">
      <h2>Number of table:</h2>
      <input
        type="text"
        v-model="tableNumber"
        @input="validateTableNumber"
        placeholder="1~18"
      />
      <p v-if="tableNumberError" style="color: red;">{{ tableNumberError }}</p>
  
      <h2>Number of attendees:</h2>
      <input
        type="text"
        v-model="attendeesNumber"
        @input="validateAttendeesNumber"
        placeholder="1~10"
      />
      <p v-if="attendeesNumberError" style="color: red;">{{ attendeesNumberError }}</p>
  
      <router-link to="/Menu" class="button-link">
        <button @click="handleSubmit">Menu</button>
      </router-link>
    </div>
  </body>
    
  </template>
  
  <script>
  export default {
    data() {
      return {
        tableNumber: "",
        attendeesNumber: "",
        tableNumberError: "",
        attendeesNumberError: "",
      };
    },
    methods: {
      validateTableNumber() {
        const num = parseInt(this.tableNumber, 10);
        if (isNaN(num) || num < 1 || num > 18) {
          this.tableNumberError = "Please enter a number between 1 and 18.";
        } else {
          this.tableNumberError = "";
        }
      },
      validateAttendeesNumber() {
        const num = parseInt(this.attendeesNumber, 10);
        if (isNaN(num) || num < 1 || num > 10) {
          this.attendeesNumberError = "Please enter a number between 1 and 10.";
        } else {
          this.attendeesNumberError = "";
        }
      },
      handleSubmit() {
        let isValid = true;
  
        // Re-check both validations to ensure correctness on submit
        const tableNum = parseInt(this.tableNumber, 10);
        const attendeesNum = parseInt(this.attendeesNumber, 10);
  
        if (isNaN(tableNum) || tableNum < 1 || tableNum > 18) {
          console.error("Invalid table number: must be between 1 and 18.");
          this.tableNumberError = "Please enter a number between 1 and 18.";
          isValid = false;
        }
  
        if (isNaN(attendeesNum) || attendeesNum < 1 || attendeesNum > 10) {
          console.error("Invalid number of attendees: must be between 1 and 10.");
          this.attendeesNumberError = "Please enter a number between 1 and 10.";
          isValid = false;
        }
  
        if (!isValid) {
          console.warn("Form submission blocked due to invalid input.");
        } else {
          console.log("Form submitted successfully!");
          // Redirect logic or API call can go here
        }
      },
    },
  };
  </script>
  
  <style>
 body {
  margin: 0;
  font-family: 'Impact', 'Arial', sans-serif;
  background: #fffcd8;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#infosCustomer {
  background: rgba(255, 255, 255, 0.9);
  border: 5px solid #ffd700;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  margin: 5% 0 5% 31%;
}

h2 {
  font-size: 2rem;
  color: #0033a0;
  margin-bottom: 1rem;
  text-shadow: 4px 4px 0px #ffd700;
}

input {
  width: 80%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 2px solid #ffd700;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.button-link button {
  background-color: #0033a0;
  border: 2px solid #ffd700;
  border-radius: 5px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.3s ease-in-out;
  color:#ffd700;
  font-family: 'Trebuchet MS', sans-serif;
  text-decoration: none;
}


.button-link:hover button {
  background-color: #ffd700;
  box-shadow: 2px 2px 5px #222;
  text-decoration: none;
  color:#0033a0;
  
}

.error-message {
  color: #c00;
  font-weight: bold;
  text-shadow: 1px 1px 0px #000;
  margin: 0.5rem 0;
} 
</style>