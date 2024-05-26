## Cooking-competition-DBMS
Management System for a cooking competition

**Entity-Relationship Diagram:**
![Alt text](https://github.com/Yassin1-prog/cooking-competition-DBMS/blob/main/documentation/diagrams/ER_light.png?raw=true)

**Relational Diagram:**
![Alt text](https://github.com/Yassin1-prog/cooking-competition-DBMS/blob/main/documentation/diagrams/relational.png?raw=true)

**Installation Guide:**
- Clone this repository using `git clone https://github.com/Yassin1-prog/cooking-competition-DBMS.git`
- Have MariaDB server installed and connect to it with the following command `./mysql -u root -p`
- Create the database by running `source < path to db_schema.sql >`
- Fill the database with mock data through `source < path to insert_data.sql >`
- Make sure you have Python version 3.11.2 (at least) and establish connection to mysql via `pip install mysql-connector`
- To materialize the competition run `python < path to add_episodes.py >`
- Finally to handle User Authentication execute the following command `source < path to applicationUsers.sql >`





