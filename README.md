                ---------------------------------
                    Online Tutor Bot System
                ---------------------------------

1. Installation setup
---------------------
---------------------

Online Tutor Bot System requires:
a) mongoDB -- for database
b) NodeJs  -- for back end development

After installing above setups open the project in vscod and open terminal  or open terminal in project folder directly  and run "npm install" to install dependencies and then run project using "node app.js" or "nodemon app". To restore database use command "mongorestore -d online_tutor_bot ./online_tutor_bot"

Go to the your chosen browser and type URL: "localhost:3000/".

2. Description
---------------
---------------

Online Tutor Bot System is a web-based project assigned by Sir Fahad Samad from National University of Computer and Emerging Sciences - Karachi Pakistan. This project utilizes nodejs as back-end, mongoDB as main NOSQL database and other common web tools and technologies. 

Online Tutor Bot System project is a platform where students can hire tutors on demand with respect to their subjects otherwise they can also use public group which is created when student posts some problem and it automates the process of adding relevant tutors in group chat. This all process uses socket programming concepts, ajax, bootstrap and other relevants. However, this all process requires accounts seperate for students and tutors and has best encryption methods provided by nodejs packages.  It also uses payment process after >=5 conversation by student to tutor in private chatbox, however its too naive implementation of payment since it has no validation or other commerical nature.This project also uses notification at real time to notify users about new messages within group or private chatbox.
