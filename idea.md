Setup a simple next js project (with typescript and tailwind css) with sqlite database
 
create schema for 
    - users (id, name, age, photo, short-bio, city, intersts)
    - liked (id, liked_by, liked_to, created_at)
    - disliked(id, disliked_by, disliked_to, created_at)

Create a seed function to seed atleast 30 fake user profile where like 4 to 8 users have previously liked or disliked each other,

create an api to fetch user profile data , also create a user profile card component (an attractive card component design like we see in tinder, hinge, bumble etc). For card swiping animation use a react-tinder-card npm package. create a dashboard page where u will find the discover route in the sidebar component of dashboard laout, the user profile should be on top of each other. like hinge or other dating app. keep responsiveness in mind for both screen.

for swiping logic keep in mind.
- Smooth card animations and clear feedback on each swipe.
- A profile that has been swiped on must never appear again.
- A clear empty state when there are no profiles left.
- A match happens only when both users have liked each other. Show an “It’s a match!”
screen at that moment.
- A “Matches” view listing all mutual matches.
- Never reveal who has liked the user unless it is mutual
