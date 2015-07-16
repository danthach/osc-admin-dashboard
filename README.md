# osc-admin-console

Setup Instructions:

1) Install Node.js and MongoDB locally if not already installed

2) Open a terminal and enter: 
       	$ mongod 

3) Open a second terminal and enter:
		$ mongo
    then:
   		$ use oscDashDb

4) Clone the repo:
       git@bitbucket.org:realeyesmedia/osc-admin-console.git
       (or)
       https://bitbucket.org/realeyesmedia/osc-admin-console.git

5) Open a third terminal and navigate to the directory where you cloned the repo. Enter: 
		$ npm install
   then:
   		$ node app.js

6) Open a browser and navigate to:
		http://localhost:3000/init
	(This URL will allow you to bypass user authentication one time so you can create a first user / administrator)
	Enter the email address and password for the initial administrator of the app and click "Submit". 
	
7) Navigate to:
		http://localhost:3000
	You'll be automatically logged in as the administrator and you can begin adding users and servers. 
