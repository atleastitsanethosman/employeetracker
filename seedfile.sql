USE employeetrackerDB;

INSERT INTO department
VALUES  (1,"EXECUTIVE"), (2,"SALES"), (3,"OPERATIONS"), (4,"ENGINEERING"), (5,"FINANCE");

INSERT INTO role
VALUES  (1,"CEO",150000, 1), (2,"SALES MANAGER",125000, 2), (3,"OPERATIONS MANAGER",125000, 3), (4,"ENGINEERING MANAGER",125000, 4), (5,"FINANCE MANAGER",125000, 5), (6,"SALES REP 1",75000, 2), (7,"SALES REP 2",75000, 2), (8,"MATERIALS MANAGER",100000, 3), (9,"PRODUCTION MANAGER",100000, 3), (10,"OPERATOR 1",50000, 3), (11,"OPERATOR 2",60000, 3), (12,"ENGINEER 1",85000, 4), (13,"ENGINEER 2",90000, 4), (14,"CONTROLLER",100000, 5), (15,"ACCOUNTANT",75000, 5)
;

INSERT INTO employee 
VALUES (1,"Damon","Clay",1,NULL), (2,"Shamar","Blake",2,1), (3,"Addyson","Silva",3,1), (4,"Noe","Hurst",4,1), (5,"Theresa","Ortega",5,1), (6,"Mikayla","Hogan",8,3), (7,"Anna","Leon",9,3), (8,"Raiden","York",9,3), (9,"Judith","Guzman",10,7), (10,"Todd","Cherry",11,8), (11,"Aurora","Robles",10,7), (12,"Nash","Rodriguez",11,8), (13,"Anton","Silva",10,7), (14,"Dustin","Patton",11,8), (15,"Rodrigo","Cannon",10,7), (16,"Douglas","Harper",11,8), (17,"Jaden","Galloway",10,7), (18,"Alfred","Mccarty",11,8), (19,"Eli","Wilkinson",10,7), (20,"Chaz","Davidson",11,8), (21,"Deshawn","Osborn",10,7), (22,"Jessica","Velazquez",11,8), (23,"Raven","Ritter",10,7), (24,"Terrence","Farmer",12,4), (25,"Leonel","Bentley",13,4), (26,"Rayna","Barrera",12,4), (27,"Jillian","Rose",13,4), (28,"Jonathon","Tran",12,4), (29,"Jovani","Pierce",13,4), (30,"Shyanne","Osborne",12,4), (31,"Mya","Mcknight",13,4), (32,"Josh","Blackburn",12,4), (33,"Beatrice","Petty",13,4), (34,"Xander","Maldonado",12,4), (35,"Aidan","Holder",13,4), (36,"Kristin","Gaines",14,5), (37,"Orlando","Davies",15,5), (38,"Xiomara","Harding",15,5), (39,"Aditya","Rhodes",15,5), (40,"Cael","Dunlap",15,5), (41,"Jadyn","Larsen",6,2), (42,"Noah","Small",7,2), (43,"Willow","Barry",6,2), (44,"Gisselle","Erickson",7,2), (45,"Finn","Zamora",6,2), (46,"Kody","Guerrero",7,2), (47,"Kamren","Richards",6,2), (48,"Jean","Richards",7,2), (49,"Esperanza","Li",6,2), (50,"Yuliana","Edwards",7,2)
;
