import mysql.connector
import random

# Connect to the database

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="master_chef"
)

cursor = db.cursor()

def get_data(query):
    cursor.execute(query)
    return cursor.fetchall()

cuisines = [x[0] for x in get_data("SELECT cuisine_id FROM cuisine")]
recipes_cuisines = {x[0]:x[1] for x in get_data("SELECT recipe_id, cuisine_id FROM recipe WHERE recipe_id < 69")}
cc_data = get_data("SELECT cook_id, cuisine_id FROM cuisine_cook")
cook_cuisines = {x[0]:[] for x in cc_data}
for x in cc_data:
    cook_cuisines[x[0]].append(x[1])

cuisine_app = {x:0 for x in cuisines}
recipes_app = {x:0 for x in recipes_cuisines.keys()}
cook_app = {x:0 for x in cook_cuisines.keys()}
judge_app = {x:0 for x in cook_cuisines.keys()}

prev_cuisine_app = {x:0 for x in cuisines}
prev_recipes_app = {x:0 for x in recipes_cuisines.keys()}
prev_cook_app = {x:0 for x in cook_cuisines.keys()}
prev_judge_app = {x:0 for x in cook_cuisines.keys()}

ep_data = get_data("SELECT MAX(year_filmed) FROM episode")
flag=False
while(not flag):
    try:
        start_year = int(input("Insert valid start year: "))
    except:
        continue
    ep_data = get_data("SELECT MAX(year_filmed) FROM episode")
    max_year_filmed = ep_data[0][0]
    if max_year_filmed!=None and max_year_filmed>=start_year:
        continue
    if start_year>=2024:
        flag = True
flag=False
while(not flag):
    try:
        end_year = int(input("Insert valid end year: "))
    except:
        continue
    if end_year>=start_year:
        flag = True

random_year = random.randint(start_year,end_year)

ep_data = get_data("SELECT MAX(episode_id) FROM episode")
try:
    episode_id = ep_data[0][0] + 1
except:
    episode_id=1
flag=False
for year in range(start_year,end_year+1):
    episode = 1
    while (episode<11):
        if flag:
            flag = False
            for x in cuisine_app:
                cuisine_app[x] = prev_cuisine_app[x]
            for x in cook_app:
                cook_app[x] = prev_cook_app[x]
            for x in recipes_app:
                recipes_app[x] = prev_recipes_app[x]
            for x in judge_app:
                judge_app[x] = prev_judge_app[x]
        #episode config
        ep_recipes = []
        ep_cooks = []
        ep_cuisines = []
        #cuisine select
        for i in range(10):
            cuisine = 0
            while(cuisine == 0):
                available_cuisines = [c for c in cuisines if c not in ep_cuisines]
                try:
                    cuisine = random.choice(available_cuisines)
                except:
                    flag=True
                    break
                #print("cuisine: "+str(cuisine))
                if cuisine_app[cuisine] == 3:
                    cuisine = 0
                    continue
                cuisine_app[cuisine]+=1
                ep_cuisines.append(cuisine)
            if flag:
                break
        if flag:
            continue
        for x in cuisine_app.keys():
            if x not in ep_cuisines:
                cuisine_app[x] = 0
        #10 cooks select
        for i in range(10):
            cook = 0
            while(cook == 0):
                available_cooks = [c for c in cook_cuisines.keys() if c not in ep_cooks and (ep_cuisines[i] in cook_cuisines[c])]
                try:
                    cook = random.choice(available_cooks)
                except:
                    flag=True
                    break
                if cook_app[cook] == 3:
                    cook = 0
                    continue
                cook_app[cook]+=1
                ep_cooks.append(cook)
            if flag:
                break
        if flag:
            continue
        for x in cook_app.keys():
            if x not in ep_cooks:
                cook_app[x] = 0
        #10 recipes select
        for i in range(10):
            recipe = 0
            while(recipe == 0):
                available_recipes = [r for r in recipes_cuisines.keys() if (r not in ep_recipes) and (recipes_cuisines[r] == ep_cuisines[i])]
                try:
                    recipe = random.choice(available_recipes)
                except:
                    flag=True
                    break
                if recipes_app[recipe] == 3:
                    recipe = 0
                    continue
                recipes_app[recipe]+=1
                ep_recipes.append(recipe)
            if flag:
                break
        if flag:
            continue
        for x in recipes_app.keys():
            if x not in ep_recipes:
                recipes_app[x] = 0
        ep_judges = set()
        for position in range(3):
            judge = 0
            while(judge == 0):
                if year != random_year:
                    available_judges = [j for j in cook_cuisines.keys() if (j not in ep_judges) and (j not in ep_cooks)]
                else:
                    available_judges = [j for j in list(cook_cuisines.keys())[:10] if (j not in ep_judges) and (j not in ep_cooks)]
                try:
                    judge = random.choice(available_judges)
                except:
                    flag=True
                    break
                if judge_app[judge] == 3:
                    judge = 0
                    continue
                judge_app[judge]+=1
                ep_judges.add(judge)
            if flag:
                break
        if flag:
            continue
        for x in judge_app.keys():
            if x not in ep_judges:
                judge_app[x] = 0
        #insert episode to database
        cursor.execute("INSERT INTO episode (episode, year_filmed) VALUES (%s, %s)", (episode, year))
        episode_id = cursor.lastrowid
        for i in range(10):
            cursor.execute("INSERT INTO episode_recipe_cook (episode_id, recipe_id, cook_id, cuisine_id, grade1, grade2, grade3) VALUES (%s, %s, %s, %s, %s, %s, %s)", (episode_id, ep_recipes[i], ep_cooks[i],ep_cuisines[i], random.randint(1, 5), random.randint(1, 5), random.randint(1, 5)))
        #insert judges
        for position in range(1,4):
            cursor.execute("INSERT INTO judge (episode_id, cook_id, position) VALUES (%s, %s, %s)", (episode_id, ep_judges.pop(), str(position)))
        for x in cuisine_app:
                prev_cuisine_app[x] = cuisine_app[x]
        for x in cook_app:
            prev_cook_app[x] = cook_app[x]
        for x in recipes_app:
            prev_recipes_app[x] = recipes_app[x]
        for x in judge_app:
            prev_judge_app[x] = judge_app[x]
        episode+=1
        episode_id+=1
        db.commit()
#close the connection
cursor.close()
db.close()