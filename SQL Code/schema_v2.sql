CREATE DATABASE IF NOT EXISTS master_chef;

USE master_chef;

CREATE TABLE IF NOT EXISTS theme (
	theme_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    theme VARCHAR(45) NOT NULL UNIQUE,
    descr VARCHAR(100) NOT NULL,
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS cuisine (
	cuisine_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cuisine VARCHAR(45) NOT NULL UNIQUE,
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS recipe (
	recipe_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(45) NOT NULL,
    descr TEXT NOT NULL,
    cuisine_id INT UNSIGNED NOT NULL,
    theme_id INT UNSIGNED NOT NULL,
    difficulity INT UNSIGNED NOT NULL CHECK (difficulity BETWEEN 1 AND 5),
    quantity INT UNSIGNED NOT NULL CHECK(quantity > 0),
    category VARCHAR(45) NOT NULL,                     -- vegan if the main ingredient is vegetables, or see food if its fish and etc..
    steps TEXT NOT NULL,
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL,
    CONSTRAINT fk_Recipe_Theme FOREIGN KEY(theme_id)
		REFERENCES theme (theme_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Recipe_Cuisine FOREIGN KEY(cuisine_id)
		REFERENCES cuisine (cuisine_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS mealType (                        -- mealType like lunch, breakfast etc..
	mealType_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mealType VARCHAR(45) NOT NULL UNIQUE,
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS mealType_recipe (               -- a recipe can belong to many mealTypes and a Mealtype has a lot of recipes
	mealType_id INT UNSIGNED NOT NULL,
    recipe_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(mealType_id,recipe_id),
    CONSTRAINT fk_Meal_Recipe FOREIGN KEY(mealType_id)
		REFERENCES mealType (mealType_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Recipe_Meal FOREIGN KEY(recipe_id)
		REFERENCES recipe (recipe_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;

	    
CREATE TABLE IF NOT EXISTS tag (                  
	tag_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	category VARCHAR(45) NOT NULL,                  -- like brunch, quick lunch etc.
    tip1 VARCHAR(100),                              -- if a recipe has more than 3 tips then more tags could be made
    tip2 VARCHAR(100),
    tip3 VARCHAR(100),
    recipe_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_Recipe_Tag FOREIGN KEY(recipe_id)
		REFERENCES recipe (recipe_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS tool (
	tool_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tool_name VARCHAR(45) NOT NULL,
    manual TEXT NOT NULL,                          -- usage instruction
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS step (
	step_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    step_descr VARCHAR(100) NOT NULL,
    step_order INT UNSIGNED NOT NULL CHECK(step_order > 0))
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS recipe_tool (
	recipe_id INT UNSIGNED NOT NULL,
    tool_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(recipe_id,tool_id),
    CONSTRAINT fk_Recipe_Tool FOREIGN KEY(recipe_id)
		REFERENCES recipe (recipe_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Tool_Recipe FOREIGN KEY(tool_id)
		REFERENCES tool (tool_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS recipe_step (
    recipe_id INT UNSIGNED NOT NULL,
    step_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (recipe_id , step_id),
    CONSTRAINT fk_Recipe_Step FOREIGN KEY (recipe_id)
        REFERENCES recipe (recipe_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Step_Recipe FOREIGN KEY (step_id)
        REFERENCES step (step_id)
        ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS foodGroup (
	foodGroup_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,    -- consult wikipidea, i think there might be 12 different food groups
    foodGroup VARCHAR(45),
    descr TEXT,
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS ingredient (
	ingredient_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ingredient VARCHAR(45),
    calories INT UNSIGNED NOT NULL,                        -- per 100g for foods that get weighet in gr, per 100ml for liquid, pepper,salt have 0 , per quantity for things like eggs etc.
    foodGroup_id INT UNSIGNED NOT NULL,
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL,
    CONSTRAINT fk_Ingredient_FoodGroup FOREIGN KEY(foodGroup_id)
		REFERENCES foodGroup (foodGroup_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
    

    
CREATE TABLE IF NOT EXISTS recipe_ingredient (
	recipe_id INT UNSIGNED NOT NULL,
    ingredient_id INT UNSIGNED NOT NULL,
    amount VARCHAR(45) NOT NULL,                        -- per 100gr/100ml/quantity
    main_ingredient BOOLEAN NOT NULL DEFAULT FALSE,     -- based on that ingredient we set the category attribute in the recipe table
    PRIMARY KEY(recipe_id, ingredient_id),
    CONSTRAINT fk_Recipe_Ingredient FOREIGN KEY(recipe_id)
		REFERENCES recipe (recipe_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Ingredient_Recipe FOREIGN KEY(ingredient_id)
		REFERENCES ingredient (ingredient_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS nutrition (
	recipe_id INT UNSIGNED NOT NULL,
    calories_per_serving INT UNSIGNED NOT NULL CHECK(calories_per_serving > 0),    -- this one shouldnt be included in the mock data but instead calculated dynamically by the sum of all ingredients multiplied byy their calories of the recipe
    carbs_per_servning DECIMAL(5,2) NOT NULL,     -- THERE IS A TYPO, CARBS PER ****SERVNING**** 
    fat_per_serving DECIMAL(5,2) NOT NULL,
    protein_per_serving DECIMAL(5,2) NOT NULL,
    CONSTRAINT fk_Recipe_Nutrition FOREIGN KEY(recipe_id)
		REFERENCES recipe (recipe_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;


    
CREATE TABLE IF NOT EXISTS cook (
	cook_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    birth DATE NOT NULL,
    age INT UNSIGNED NOT NULL CHECK(age >= 18),
    phone VARCHAR(45) NOT NULL,
    years_of_experience INT UNSIGNED NOT NULL,
    class ENUM('C','B','A','chef assistant','chef'),
    image VARCHAR(100) NOT NULL,
    caption VARCHAR(60) NOT NULL,
    CHECK(class in ('C','B','A','chef assistant','chef')))
ENGINE = InnoDB;
    

CREATE TABLE IF NOT EXISTS cuisine_cook (
	cuisine_id INT UNSIGNED NOT NULL,
    cook_id INT UNSIGNED NOT NULL,
    PRIMARY KEY(cuisine_id,cook_id),
    CONSTRAINT fk_Cuisine_Cook FOREIGN KEY(cuisine_id)
		REFERENCES cuisine (cuisine_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Cook_Cuisine FOREIGN KEY(cook_id)
		REFERENCES cook (cook_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
    
    
CREATE TABLE IF NOT EXISTS episode (
	episode_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    episode INT UNSIGNED NOT NULL,
    year_filmed INT UNSIGNED NOT NULL)
ENGINE = InnoDB;
    
CREATE TABLE IF NOT EXISTS episode_recipe_cook (
	episode_id INT UNSIGNED NOT NULL,
    recipe_id INT UNSIGNED NOT NULL,
    cook_id INT UNSIGNED NOT NULL,
    cuisine_id INT UNSIGNED NOT NULL,
    grade1 INT UNSIGNED NOT NULL CHECK(grade1 >= 1 and grade1 <=5),
    grade2 INT UNSIGNED NOT NULL CHECK(grade2 >= 1 and grade2 <=5),
    grade3 INT UNSIGNED NOT NULL CHECK(grade3 >= 1 and grade3 <=5),
    winner BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(episode_id, recipe_id, cook_id),
    CONSTRAINT fk_Recipe_Episode FOREIGN KEY(recipe_id)
		REFERENCES recipe (recipe_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Cook_Episode FOREIGN KEY(cook_id)
		REFERENCES cook (cook_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Cuisine_Episode FOREIGN KEY(cuisine_id)
		REFERENCES cuisine (cuisine_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Episode_Recipe_Cook FOREIGN KEY(episode_id)
		REFERENCES episode (episode_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;
        
        
CREATE TABLE IF NOT EXISTS judge (
	episode_id INT UNSIGNED NOT NULL,
    cook_id INT UNSIGNED NOT NULL,
    position ENUM('1', '2', '3') NOT NULL,
    PRIMARY KEY(episode_id,cook_id),
    CHECK(position IN ('1', '2', '3')),
    CONSTRAINT fk_Judge_Episode FOREIGN KEY(episode_id)
		REFERENCES episode (episode_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_Judge_Cook FOREIGN KEY(cook_id)
		REFERENCES cook (cook_id) ON DELETE RESTRICT ON UPDATE CASCADE)
ENGINE = InnoDB;




CREATE INDEX idx_year_filmed ON episode (year_filmed);  -- used with GROUP and JOIN and ORDER BY in some queries

CREATE INDEX idx_age_cook ON cook (age);                -- used in filtering with WHERE

-- no need for more indexes as most of our queries utilize primary and unique indexes that got created automatically from InnoDB





DELIMITER //
CREATE TRIGGER atmost_one_mainIngredient
BEFORE INSERT ON recipe_ingredient
FOR EACH ROW
BEGIN
    DECLARE counter_mainIngredient INT;
    IF NEW.main_ingredient = TRUE THEN
        SELECT COUNT(*) INTO counter_mainIngredient
        FROM recipe_ingredient
        WHERE recipe_id = NEW.recipe_id AND main_ingredient = TRUE;
        IF counter_mainIngredient > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A recipe can have at most one main ingredient';
        END IF;
    END IF;
END //
DELIMITER ;

-- update instead of insert
DELIMITER //
CREATE TRIGGER atmost_one_mainIngredient1
BEFORE UPDATE ON recipe_ingredient
FOR EACH ROW
BEGIN
    DECLARE counter_mainIngredient INT;
    IF NEW.main_ingredient = TRUE THEN
        SELECT COUNT(*) INTO counter_mainIngredient
        FROM recipe_ingredient
        WHERE recipe_id = NEW.recipe_id AND main_ingredient = TRUE AND ingredient_id != NEW.ingredient_id;
        IF counter_mainIngredient > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A recipe can have at most one main ingredient';
        END IF;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER famous_judge
BEFORE INSERT  ON judge
FOR EACH ROW
BEGIN
	DECLARE nbrOfParticipation INT;
    
    IF (NEW.episode_id % 10) >= 4 THEN
		SELECT COUNT(*) INTO nbrOfParticipation
		FROM judge
		WHERE episode_id BETWEEN  NEW.episode_id - 3 AND NEW.episode_id
		AND cook_id = NEW.cook_id;
	END IF;
    
    IF nbrOfParticipation >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A Judge cannot be present in more than 3 consecutive episodes';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER cook_or_judge
BEFORE INSERT  ON judge
FOR EACH ROW
BEGIN
	DECLARE nbrOfParticipation INT;
    
    SELECT COUNT(*) INTO nbrofParticipation
    FROM episode_recipe_cook
    WHERE episode_id = NEW.episode_id  AND cook_id = NEW.cook_id;
    
    IF nbrOfParticipation > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A Judge cannot be cooking as well';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER cook_cuisine_ability
BEFORE INSERT  ON episode_recipe_cook
FOR EACH ROW
BEGIN
	DECLARE canCook INT;
    
    SELECT COUNT(*) INTO canCook
    FROM cuisine_cook
    WHERE cuisine_id = NEW.cuisine_id
    AND cook_id = NEW.cook_id;
    
    IF canCook < 1 THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A cook can only cook cuisine in his expertice';
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER cook_overuse
BEFORE INSERT ON episode_recipe_cook
FOR EACH ROW
BEGIN
	DECLARE nbrOfParticipation INT;
    
    IF (NEW.episode_id % 10) >= 4 THEN
		SELECT COUNT(*) INTO nbrOfParticipation
		FROM episode_recipe_cook
		WHERE episode_id BETWEEN NEW.episode_id - 3 AND NEW.episode_id
		AND cook_id = NEW.cook_id;
	END IF;
    
    IF nbrOfParticipation >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A Cook cannot be present in more than  3 consecutive episodes';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER recipe_overuse
BEFORE INSERT ON episode_recipe_cook
FOR EACH ROW
BEGIN
	DECLARE nbrOfParticipation INT;

    IF (NEW.episode_id % 10) >= 4 THEN
		SELECT COUNT(*) INTO nbrOfParticipation
		FROM episode_recipe_cook 
		WHERE episode_id BETWEEN NEW.episode_id - 3 AND NEW.episode_id
		AND recipe_id = NEW.recipe_id;
	END IF;
    
    IF nbrOfParticipation >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A Recipe cannot be present in more than 3 consecutive episodes';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER cuisine_overuse
BEFORE INSERT ON episode_recipe_cook
FOR EACH ROW
BEGIN
	DECLARE nbrOfParticipation INT;
    
    IF (NEW.episode_id % 10) >= 4 THEN
		SELECT COUNT(*) INTO nbrOfParticipation
		FROM episode_recipe_cook 
		WHERE episode_id BETWEEN NEW.episode_id - 3 AND NEW.episode_id
		AND cuisine_id = NEW.cuisine_id;
	END IF;
    
    IF nbrOfParticipation >= 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A Cuisine cannot be present in more than 3 consecutive episodes';
    END IF;
END //
DELIMITER ;

DELIMITER //

DELIMITER //

CREATE PROCEDURE updateEpisodeWinner(IN episodeId INT UNSIGNED)
BEGIN
    DECLARE max_grade INT UNSIGNED;
    DECLARE max_grade_cook_id INT UNSIGNED;

    -- Find the cook_id with the highest total grades in the given episode
    SELECT cook_id, (grade1 + grade2 + grade3) AS total_grade 
    INTO max_grade_cook_id, max_grade
    FROM episode_recipe_cook
    WHERE episode_id = episodeId
    ORDER BY total_grade DESC
    LIMIT 1;

    -- Reset previous winners in this episode
    UPDATE episode_recipe_cook
    SET winner = FALSE
    WHERE episode_id = episodeId;

    -- Update the winner column to TRUE for the cook with the highest total grade
    UPDATE episode_recipe_cook
    SET winner = TRUE
    WHERE episode_id = episodeId AND cook_id = max_grade_cook_id;
END //

DELIMITER ;

DELIMITER //
CREATE TRIGGER atmost_one_winner
BEFORE INSERT ON episode_recipe_cook
FOR EACH ROW
BEGIN
    DECLARE counter_winner INT;
    IF NEW.winner = TRUE THEN
        SELECT COUNT(*) INTO counter_winner
        FROM episode_recipe_cook
        WHERE episode_id = NEW.episode_id AND winner = TRUE AND cook_id != new.cook_id;
        IF counter_winner > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'There can only be one winner in a single episode';
        END IF;
    END IF;
END //
DELIMITER ;