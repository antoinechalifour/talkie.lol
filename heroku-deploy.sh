# To run this script, make sure you have installed:
# - the heroku CLI

# More info:
# - Heroku deploys https://devcenter.heroku.com/articles/container-registry-and-runtime

heroku container:login
heroku container:push web
heroku container:release web
