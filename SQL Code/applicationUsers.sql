-- Application Users

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_password';      -- admin of the database

CREATE USER 'cook_1'@'localhost' IDENTIFIED BY 'cook_1_password';    -- creating just one instance of a cook to showcase the method

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cook_id INT UNSIGNED,
    FOREIGN KEY (cook_id) REFERENCES cook(cook_id)
);

-- sample for our 2 users
INSERT INTO users (username, password, cook_id) VALUES 
('admin@localhost', 'admin_password', NULL),
('cook_1@localhost', 'cook_1_password', 1);

-- has the personal info for the current logged in user, if the user isnt a cook then it will be empty
CREATE VIEW personal_info AS         
SELECT c.* FROM cook c
INNER JOIN users u
ON u.cook_id = c.cook_id
WHERE u.username = 'cook_1@localhost';

-- has all the recipes assigned in an episode to the current logged in user, if the user isnt a cook then it will be empty
CREATE VIEW assigned_recipes AS
SELECT r.* FROM recipe r
INNER JOIN episode_recipe_cook erc
ON erc.recipe_id = r.recipe_id
INNER JOIN users u
ON erc.cook_id = u.cook_id
WHERE u.username = 'cook_1@localhost';

-- Admin has all priveleges so he can backup/restore the database and modify everything in it
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;

-- a cook can see and update his personal info
GRANT SELECT, UPDATE ON master_chef.personal_info TO 'cook_1'@'localhost';

-- a cook can see and update recipes assigned to him as well as add new ones
GRANT SELECT, UPDATE, INSERT ON master_chef.assigned_recipes TO 'cook_1'@'localhost';
