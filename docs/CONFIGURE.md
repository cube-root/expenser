<h1> Configure Google Login</h1>

## Introduction

In-order to access the google sheet, you need to get the google access token from user. So its a mandatory thing to configure the google login.

<br/><br/><br/><br/>

## Configuring Google Login

First login to [https://console.firebase.google.com](https://console.firebase.google.com) and create a firebase project. Open the newly created firebase project and follow the steps to configure google login.

<br/><br/>

### Steps :-

1. Go to project overview in the firebase page. And click on the "Add app" on the screenshot as below.

<img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/add-webapp-1.png?raw=true">

<br/><br/>

2. After click on add app,you can see the changes as the screenshot below. Click on webapp icon from the options.

<img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/add-webapp.png?raw=true">

<br/><br/>

3. You will be taken into another page to create the webapp. Give suitable names and required fields from the form and click on Register app to create the app.

<img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/create-webapp.png?raw=true">

<br/><br/>

4. You can see the configs on the next page or you can again go to project overview. Now there will be an option to view your newly created webapp. Click the settings icon from the option.

<img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/config-step-1.png?raw=true">

<br/><br/>

5. Scroll down to the bottom. You can able to see the config file.

<img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/config.png?raw=true">

<br/><br/>

6. Now create an env file (.env) on the root of the folder and with the config from the firebase add the variables as shown below. Or you can see the example env file on the root folder ([file](https://github.com/cube-root/expenser/blob/main/.env.example)).

```
FIREBASE_API_KEY=xxxxxxxxx
FIREBASE_AUTH_DOMAIN=xxxxxxxxxx
PROJECT_ID=Sample-project_id
STORAGE_BUCKET=sample_bucket
MESSAGING_SENDER_ID=9786798
APP_ID=asuy:12873bjasd
```

<br/><br/>

7. Now we need to add google login in authentication. For that go to authentication tab.
   <img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/enable-auth-1.png?raw=true">

<br/><br/>

8. On the next page click on add new provider, Add google login from the list.

<img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/enable-auth.png?raw=true">

<br/><br/>

9. Setup complete for google login.

<br/><br/><br/><br/>

## Enabling Google Sheet API

Now we need to enable google sheet api from the cloud console. Go to [https://console.cloud.google.com](https://console.cloud.google.com) and follow the steps.

<br/><br/>

### Steps :-

<br/><br/>

1. Select the project from the console.
   <br/><br/>
2. search for the google sheet api on the top of the dashboard.
   <img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/google-cloud-1.png?raw=true">
   <br/><br/>

3. On the next page enable the sheet api.
   <img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/google-cloud-2.png?raw=true">

<br/><br/>

 4. Now you enabled google sheet api.

 <br/><br/>
 5. Create a new service account from the "IAm & Admin" section in the google console and download the json service account file.
 <img src="https://github.com/cube-root/expenser/blob/main/docs/screenshots/google-cloud-service.png?raw=true">
<br/><br/>
6. From the service account file, create ENV variables as "SERVICE_ACCOUNT_PRIVATE_KEY" for "private_key" key in service account json file and "CLIENT_EMAIL" for "client_email" key in service account json file 


