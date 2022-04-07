# MEDBUDDY
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![MIT](https://img.shields.io/github/license/Aman-Codes/MedBuddy?color=blue)


It is a website which connects doctors, patients, and services like ambulance provider. <br/>
The patient can choose a date and doctor to consult, the system will automatically generate appointment time based on the doctor's schedule. The patient can also view his current and past appointments and book ambulance service. <br/>
The doctor on the other hand can accept/reject the appointment, view all his current and past appointments and upload detailed prescriptions for the patient.<br/>

## Visit Online

This website is hosted at [https://medicalbuddy.herokuapp.com/](https://medicalbuddy.herokuapp.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Your machine should have Npm(or Yarn), Node.js, and MongoDB installed to use it locally.

## Setup and Installation

### Setting up the repository locally

1. First fork the repo :fork_and_knife: to your account.  
   Go to the forked repo and clone it :busts_in_silhouette: to your local machine:

```sh
git clone https://github.com/Your_Username/MedBuddy.git
```

This will make a copy of the code to your local machine.

2. Now move to the `MedBuddy` directory.

```sh
cd MedBuddy
```

3. Now check the remote of your local code by:

```sh
git remote -v
```

The response should look like:

```sh
origin	https://github.com/Your_Username/MedBuddy.git (fetch)
origin	https://github.com/Your_Username/MedBuddy.git (push)
```

To add upstream to remote, run:

```sh
git remote add upstream https://github.com/Aman-Codes/MedBuddy.git
```

Again run `git remote -v`, the response should look like:

```sh
origin	https://github.com/Your_Username/MedBuddy.git (fetch)
origin	https://github.com/Your_Username/MedBuddy.git (push)
upstream	https://github.com/Aman-Codes/MedBuddy (fetch)
upstream	https://github.com/Aman-Codes/MedBuddy (push)
```

4. Once the remote is set, install all the necessary dependencies by the following command:

```sh
npm install
```
### Run locally

Run the below command to start the server:

```sh
npm run dev
```
Go to: [http://localhost:4000](http://localhost:4000)

### Contributing

We really like contributions in several forms, see [CONTRIBUTING.md](https://github.com/Aman-Codes/MedBuddy/blob/master/docs/CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](https://github.com/Aman-Codes/MedBuddy/blob/master/docs/CODE_OF_CONDUCT.md)

### User Documentation

For complete user documentation refer [UserDocumentation.md](https://github.com/Aman-Codes/MedBuddy/blob/master/docs/UserDocumentation.md)

