# helpdesk support ticket management application


## Ticket management web application

A SPA-styled frontend application using React.js with  Ant design.

Start project:
```
cd .\ticket-management-web-application\
yarn
```

You can run:
```
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

----------------------------

## Ticket management web application

A RESTful-compliant API backend using Golang.

Start project:
```
go build
go get
```

You can run:
```
go run main.go
```
`GET` show all tickets : 
[http://localhost:8080/tickgets](http://localhost:8080/tickgets)

`GET` show detail ticket by ID : [http://localhost:8080/tickget/{id}](http://localhost:8080/tickget/{id})

`POST` Create ticket : [http://localhost:8080/ticket](http://localhost:8080/ticket)

`PUT` Update ticket by ID : [http://localhost:8080/tickget/{id}](http://localhost:8080/tickget/{id})
