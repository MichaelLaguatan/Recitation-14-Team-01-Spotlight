# Recitation-14-Team-01-Spotlight

**Application Description**
Scrape through sites that have signifigant creative freedom for obscure content that may interest the user whether it’s through search queries or recommendations.

**Contributors**
Gabe Beltran, 
Michael Laguatan, 
Owen Kutzscher, 
Harrison Martin, 
Vincent Pham


**Technology Stack**
Java Script, CSS, HTML, Postgresql, EJS, NodeJS application server
Youtube and Vimeo APIs.

**Prerequisites to run the application**
Install Docker


**How to run the application locally**
Downlaod repo from github: https://github.com/MichaelLaguatan/Recitation-14-Team-01-Spotlight
In the terminal, navigate to the folder allProjectCodeAndComponents
Start up Docker by clicking on docker 
Run: docker compose up
Go to your browser and search for "localhost:3000"

**How to run tests**
Clone the repository and navigate to the docker-compose.yaml file in the allProjectCodeandComponents folder
To run the application without going through the unit tests, change the command property of the node service to: 'npm run start'
To run only the unit tests and have the node server terminate afterwards, change the command property to: 'npm run prestart && npm run test'
To run the unit tests and have the node server continue running afterwards, change the command property to: 'npm run prestart && nm run test && npm run start'


**Link to the deployed application**
http://recitation-014-team-01.eastus.cloudapp.azure.com:3000/

