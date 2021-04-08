export const defaultSource = `
entity Region {
	regionName String
}

entity Country {
	countryName String
}

// an ignored comment
/** not an ignored comment */
entity Location {
	streetAddress String
	postalCode String
	city String
	stateProvince String
}

entity Department {
	departmentName String required
}

/**
 * Task entity.
 * @author The JHipster team.
 */
entity Task {
	title String
	description String
}

/**
 * The Employee entity.
 */
entity Employee {
	/**
	* The firstname attribute.
	*/
	firstName String
	lastName String
	email String
	phoneNumber String
	hireDate Instant
	salary Long
	commissionPct Long
}

entity Job {
	jobTitle String
	minSalary Long
	maxSalary Long
}

entity JobHistory {
	startDate Instant
	endDate Instant
	language Language
}

enum Language {
    FRENCH, ENGLISH, SPANISH
}

relationship OneToOne {
	Country{region} to Region
}

relationship OneToOne {
	Location{country} to Country
}

relationship OneToOne {
	Department{location} to Location
}

relationship ManyToMany {
	Job{task(title)} to Task{job}
}

// defining multiple OneToMany relationships with comments
relationship OneToMany {
	Employee to Job{employee}
	/**
	* A relationship
	*/
	Department to
	/**
	* Another side of the same relationship
	*/
	Employee{department}
}

relationship ManyToOne {
	Employee{manager} to Employee
}

// defining multiple oneToOne relationships
relationship OneToOne {
	JobHistory{job} to Job
	JobHistory{department} to Department
	JobHistory{employee} to Employee
}

// Set pagination options
paginate JobHistory, Employee with infinite-scroll
paginate Job with pagination

// Use Data Transfer Objects (DTO)
// dto * with mapstruct

// Set service options to all except few
service all with serviceImpl except Employee, Job

// Set an angular suffix
// angularSuffix * with mySuffix
`;

export const JDLtemplates = [
  {
    key: "default sample",
    val: defaultSource,
  },
  {
    key: "simple monolith",
    val: `
application {
  config {
    baseName myApp
    applicationType monolith
    packageName com.myapp
    authenticationType jwt
    prodDatabaseType mysql
    clientFramework angularX
  }
  entities *
}

entity A {}

entity B {}

relationship OneToMany {
  A to B
}
`,
  },
  {
    key: "simple microservice",
    val: `
application {
  config {
    baseName myApp
    applicationType gateway
    packageName com.myapp
    authenticationType jwt
    prodDatabaseType mysql
    clientFramework react
  }
  entities *
}

application {
  config {
    baseName myApp1
    applicationType microservice
    packageName com.myapp
    authenticationType jwt
    prodDatabaseType mysql
  }
  entities A, B
}

application {
  config {
    baseName myApp2
    applicationType microservice
    packageName com.myapp
    authenticationType jwt
    prodDatabaseType mysql
  }
  entities C
}

entity A {}

entity B {}

entity C {}

entity D {}

relationship OneToMany {
  A to B
}
`,
  },
];
