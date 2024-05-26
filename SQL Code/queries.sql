/*3.1*/
SELECT c.cook_id, concat(c.first_name, " ", c.last_name) cook_name, cu.cuisine, AVG((ep_rc.grade1+ep_rc.grade2+ep_rc.grade3)/3) avg_grade
FROM episode_recipe_cook ep_rc
INNER JOIN cook c
ON ep_rc.cook_id = c.cook_id
INNER JOIN cuisine cu
ON ep_rc.cuisine_id = cu.cuisine_id
GROUP BY ep_rc.cook_id,ep_rc.cuisine_id;

/*3.2*/
SELECT ep.year_filmed, ep.episode, cu.cuisine, concat(c.first_name," ",c.last_name) cook_name, c.cook_id
FROM episode ep 
INNER JOIN episode_recipe_cook ep_rc
ON ep.episode_id = ep_rc.episode_id
INNER JOIN cuisine cu
ON ep_rc.cuisine_id = cu.cuisine_id
INNER JOIN cook c
ON ep_rc.cook_id = c.cook_id;

/*3.3*/
SELECT c.cook_id, concat(c.first_name, " ", c.last_name) as cook, c.age, COUNT(erc.cook_id) as recipe_count FROM cook c
INNER JOIN episode_recipe_cook erc ON erc.cook_id = c.cook_id 
WHERE c.age < 30
GROUP BY erc.cook_id
ORDER  BY COUNT(erc.cook_id) DESC;

/*3.4*/
SELECT c.cook_id, concat(c.first_name, " ", c.last_name) not_judge FROM cook c 
WHERE c.cook_id NOT IN (SELECT j.cook_id FROM judge j);

/*3.5*/
WITH JudgeAppearances AS (
    SELECT 
        j.cook_id,
        e.year_filmed,
        COUNT(j.episode_id) AS appearances
    FROM 
        judge j
    JOIN 
        episode e ON j.episode_id = e.episode_id
    GROUP BY 
        j.cook_id, e.year_filmed
    HAVING 
        COUNT(j.episode_id) > 3
),
JudgeSameAppearances AS (
    SELECT 
        ja1.cook_id AS judge1_id,
        ja2.cook_id AS judge2_id,
        ja1.year_filmed,
        ja1.appearances
    FROM 
        JudgeAppearances ja1
    JOIN 
        JudgeAppearances ja2 
    ON 
        ja1.year_filmed = ja2.year_filmed AND ja1.appearances = ja2.appearances AND ja1.cook_id < ja2.cook_id
)
SELECT 
    concat(j1.first_name," ",j1.last_name) as judge_1,
    concat(j2.first_name," ",j2.last_name) as judge_2,
    jsa.year_filmed,
    jsa.appearances
FROM 
    JudgeSameAppearances jsa
JOIN 
    cook j1 ON jsa.judge1_id = j1.cook_id
JOIN 
    cook j2 ON jsa.judge2_id = j2.cook_id
ORDER BY 
    jsa.year_filmed, jsa.appearances DESC;

/*3.6*/
WITH pairs AS (
    SELECT t1.category category1, t2.category category2, ep_rc.recipe_id
    FROM tag t1
    INNER JOIN tag t2
    ON t1.recipe_id = t2.recipe_id
    INNER JOIN episode_recipe_cook ep_rc
    ON t1.recipe_id = ep_rc.recipe_id
    WHERE t1.tag_id<t2.tag_id)
SELECT count(recipe_id) as appearances, category1, category2 FROM pairs
GROUP BY category1,category2
ORDER BY count(recipe_id) DESC
LIMIT 3;

-- Alternative query plan with ignore index (execute with explain to see the traces)
WITH pairs AS (
    SELECT t1.category AS category1, t2.category AS category2, ep_rc.recipe_id
    FROM tag t1 IGNORE INDEX (PRIMARY)
    INNER JOIN tag t2 IGNORE INDEX (fk_Recipe_Tag)
    ON t1.recipe_id = t2.recipe_id
    INNER JOIN episode_recipe_cook ep_rc IGNORE INDEX (fk_Recipe_Episode)
    ON t1.recipe_id = ep_rc.recipe_id
    WHERE t1.tag_id < t2.tag_id
)
SELECT COUNT(recipe_id), category1, category2 
FROM pairs
GROUP BY category1, category2
ORDER BY COUNT(recipe_id) DESC
LIMIT 3;



/*3.7*/
SELECT c.cook_id, concat(c.first_name, " ", c.last_name) cook_name, COUNT(x.cook_id) AS participations FROM
cook c INNER JOIN episode_recipe_cook x
ON c.cook_id = x.cook_id
GROUP BY cook_id
HAVING ((SELECT COUNT(cook_id) FROM episode_recipe_cook GROUP BY(cook_id) ORDER BY COUNT(cook_id) DESC LIMIT 1) - participations ) >= 5
ORDER BY participations DESC;

/*3.8 taking into account equal scores*/
WITH amountTool AS (
    SELECT COUNT(rt.recipe_id) as amount, rt.recipe_id FROM recipe_tool rt GROUP BY recipe_id
),
ToolsPerEpisode AS (
    SELECT SUM(att.amount) as total, e.episode, erc.episode_id, e.year_filmed FROM amountTool att 
    INNER JOIN episode_recipe_cook erc ON erc.recipe_id = att.recipe_id
    INNER JOIN episode e ON e.episode_id = erc.episode_id
    GROUP BY erc.episode_id
),
MaxTools AS (
    SELECT tpe.episode, tpe.year_filmed, tpe.total, MAX(tpe.total) as app
    FROM ToolsPerEpisode tpe
)
SELECT tpe.episode, tpe.year_filmed, tpe.total
FROM MaxTools mt, ToolsPerEpisode tpe WHERE tpe.total = mt.app; 

-- Alternative query plan with force index
WITH amountTool AS (
    SELECT COUNT(rt.recipe_id) as amount, rt.recipe_id 
    FROM recipe_tool rt 
    FORCE INDEX (PRIMARY) 
    GROUP BY rt.recipe_id
),
ToolsPerEpisode AS (
    SELECT SUM(att.amount) as total, e.episode, erc.episode_id, e.year_filmed 
    FROM amountTool att 
    INNER JOIN episode_recipe_cook erc FORCE INDEX (PRIMARY) 
    ON erc.recipe_id = att.recipe_id
    INNER JOIN episode e FORCE INDEX (PRIMARY) 
    ON e.episode_id = erc.episode_id
    GROUP BY erc.episode_id
),
MaxTools AS (
    SELECT tpe.episode, tpe.year_filmed, tpe.total, MAX(tpe.total) as app
    FROM ToolsPerEpisode tpe
)
SELECT tpe.episode, tpe.year_filmed, tpe.total
FROM MaxTools mt, ToolsPerEpisode tpe 
WHERE tpe.total = mt.app;


/*3.9*/
SELECT AVG(n.carbs_per_servning) AS "average gramms of carbs", e.year_filmed FROM
episode e INNER JOIN episode_recipe_cook x
ON e.episode_id = x.episode_id
INNER JOIN nutrition n
ON n.recipe_id = x.recipe_id
GROUP BY e.year_filmed;

/*3.10*/
WITH cuisineIncluded AS (
    SELECT COUNT(c.cuisine) as entries, c.cuisine, e.year_filmed, c.cuisine_id
    FROM cuisine c INNER JOIN episode_recipe_cook erc ON erc.cuisine_id = c.cuisine_id
    INNER JOIN episode e ON e.episode_id = erc.episode_id
    GROUP BY c.cuisine_id, e.year_filmed
    HAVING entries >= 3
),
consecutive_years AS (
    SELECT 
        ci1.cuisine_id, 
        ci1.cuisine,
        ci1.year_filmed AS year1, 
        ci1.entries AS entries1, 
        ci2.year_filmed AS year2, 
        ci2.entries AS entries2
    FROM 
        cuisineIncluded ci1
    INNER JOIN 
        cuisineIncluded ci2 
        ON ci1.cuisine_id = ci2.cuisine_id 
        AND ci2.year_filmed = ci1.year_filmed + 1
)
SELECT cy1.cuisine, cy2.cuisine, (cy1.entries1 + cy1.entries2) as entries, cy1.year1, cy1.year2
FROM consecutive_years cy1, consecutive_years cy2 WHERE
cy1.year1 = cy2.year1 AND cy1.year2 = cy2.year2 AND cy1.entries1 + cy1.entries2 = cy2.entries1 + cy2.entries2 AND cy1.cuisine_id < cy2.cuisine_id;

/*3.11*/
SELECT 
    j.cook_id AS judge_id,
    concat(judge_cook.first_name, " ", judge_cook.last_name) as judge,
    erc.cook_id AS cook_id,
    concat(cook.first_name, cook.last_name) as cook,
    SUM(CASE
        WHEN j.position = '1' THEN erc.grade1
        WHEN j.position = '2' THEN erc.grade2
        WHEN j.position = '3' THEN erc.grade3
    END) AS total_score
FROM 
    judge j
JOIN 
    episode_recipe_cook erc ON j.episode_id = erc.episode_id
JOIN 
    cook judge_cook ON j.cook_id = judge_cook.cook_id
JOIN 
    cook cook ON erc.cook_id = cook.cook_id
GROUP BY 
    j.cook_id, erc.cook_id
ORDER BY 
    total_score DESC
LIMIT 5;

/*3.12*/
WITH episode_difficulity as (
    SELECT SUM(r.difficulity) as level, erc.episode_id as episode,  e.year_filmed as year FROM recipe r
    INNER JOIN episode_recipe_cook erc ON r.recipe_id = erc.recipe_id
    INNER JOIN episode e ON e.episode_id = erc.episode_id
    GROUP BY erc.episode_id
    ORDER BY SUM(r.difficulity) DESC
)
SELECT ed.episode, ed.year, MAX(ed.level) as relative_level_indicator  FROM episode_difficulity ed
GROUP BY ed.year
ORDER BY ed.year;

/*3.13*/
WITH cook_experience AS (
    SELECT 
        cook_id, 
        CASE class
            WHEN 'chef' THEN 5
            WHEN 'chef assistant' THEN 4
            WHEN 'A' THEN 3
            WHEN 'B' THEN 2
            WHEN 'C' THEN 1
            ELSE 0
        END AS experience
    FROM cook
),
episode_cook_experience AS (
    SELECT 
        erc.episode_id, 
        ep.episode,
        ep.year_filmed,
        SUM(ce.experience) AS total_cook_experience
    FROM 
        episode_recipe_cook erc
    JOIN 
        cook_experience ce ON erc.cook_id = ce.cook_id
    JOIN
        episode ep ON ep.episode_id = erc.episode_id
    GROUP BY 
        erc.episode_id
),
episode_judge_experience AS (
    SELECT 
        j.episode_id, 
        ep.episode,
        ep.year_filmed,
        SUM(ce.experience) AS total_judge_experience
    FROM 
        judge j
    JOIN 
        cook_experience ce ON j.cook_id = ce.cook_id
    JOIN
        episode ep ON ep.episode_id = j.episode_id
    GROUP BY 
        j.episode_id
),
episode_total_experience AS (
    SELECT 
        ece.episode_id,
        ece.episode,
        ece.year_filmed, 
        (ece.total_cook_experience + eje.total_judge_experience) AS total_experience
    FROM 
        episode_cook_experience ece
    JOIN 
        episode_judge_experience eje ON ece.episode_id = eje.episode_id
)
SELECT 
    ete.episode,
    ete.year_filmed, 
    ete.total_experience as relative_experience_indicator
FROM 
    episode_total_experience ete
ORDER BY 
    ete.total_experience ASC
LIMIT 1;

/*3.14*/
SELECT t.theme, COUNT(t.theme) as appearances FROM theme t
INNER JOIN recipe r ON r.theme_id = t.theme_id
INNER JOIN episode_recipe_cook erc ON erc.recipe_id = r.recipe_id
GROUP BY t.theme_id
ORDER BY COUNT(t.theme) DESC
LIMIT 1;

/*3.15*/
SELECT f.foodGroup unused_food_groups
FROM foodGroup f
WHERE f.foodGroup_id NOT IN (
    SELECT f.foodGroup_id
    FROM foodGroup f
    INNER JOIN ingredient i
    ON f.foodGroup_id = i.foodGroup_id
    INNER JOIN recipe_ingredient ri
    ON i.ingredient_id = ri.ingredient_id
    INNER JOIN episode_recipe_cook ep_rc
    ON ri.recipe_id = ep_rc.recipe_id
);