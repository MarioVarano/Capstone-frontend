# EpicHealth

#### La piattaforma utilizza Angular per lo sviluppo del frontend e Spring Boot per il backend, con PostgreSQL per la persistenza dei dati.


# Descrizione del progetto
EpicHealth è una piattaforma completa progettata per mettere in contatto utenti e professionisti della sanità. Gli utenti possono registrarsi, cercare pr ofessionisti per città o specializzazione, visualizzare i dettagli dei professionisti e richiedere appuntamenti. I professionisti ricevono notifiche via email per le richieste di appuntamento e possono confermarle tramite un link. Sia gli utenti che i professionisti possono gestire i propri dati personali e appuntamenti tramite una dashboard personale.

## 🛠️ Tecnologie utilizzate
- Frontend: Angular e ngBootstrap
- Backend: Java e Spring Boot
- Database: PostgreSQL


## ✨ Funzionalità principali
- Registrazione e login per utenti e professionisti
- Visualizzazione e filtro dei professionisti registrati
- Richiesta e gestione degli appuntamenti
- Notifiche via email per le richieste di appuntamento
- Dashboard per la gestione dei dati personali e degli appuntamenti
- Operazioni CRUD complete per utenti e professionisti
- Design responsivo
- Endpoint API RESTful

## ⚙️ Prerequisiti
- Node.js e npm
- Angular CLI
- Java 17 o superiore (per il backend)
- Maven 3.6.0 o superiore (per il backend)
- PostgreSQL

## 📥 Clona il repository
Per il Frontend:
- git clone https://github.com/MarioVarano/Capstone-frontend.git


Per il Backend:
- git clone https://github.com/MarioVarano/Capstone.git


##  📦 Installa le dipendenze
Per installare le dipendenze necessarie per il frontend Angular, esegui:
npm install
ng serve


Per il backend, esegui:
mvn clean install
mvn spring-boot:run

## 🛠️ Configura PostgreSQL
Crea un database chiamato backend e configura il file application.properties nel backend con le tue credenziali PostgreSQL.

properties
spring.datasource.url=jdbc:postgresql://localhost:5432/backend
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update


## 🤝 Contributi
I contributi sono benvenuti! Per favore, fai un fork del repository e invia una pull request per qualsiasi miglioramento o correzione di bug.

## 📧 Contatti
Per qualsiasi domanda o informazione, contattami all'indirizzo email mariovarano1995@gmail.com

GitHub - Frontend Repository
GitHub - Backend Repository








Link Capstone BackEnd: https://github.com/MarioVarano/Capstone.git
