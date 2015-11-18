require 'Pry'
require 'HTTParty'

# PLACES GEOCODING API

# api_key = 'AIzaSyALLZ3VXoyVYMYlgXocK-3mK5fvFquC2r8'

# result = HTTParty.get('https://maps.googleapis.com/maps/api/geocode/json?address=+Brooklyn+Landlord+Tenant+Court+Help+Room&key='+api_key)

# location = result["results"][0]["geometry"]["location"]

# latitude = result["results"][0]["geometry"]["location"]["lat"]
# longitude = result["results"][0]["geometry"]["location"]["lng"]

# Pry.start(binding)

# PLACES API WEB SERVICES
api_key = 'AIzaSyALLZ3VXoyVYMYlgXocK-3mK5fvFquC2r8'

result = HTTParty.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.650970,-73.962547&radius=1000&keyword=lsdkjflkdjfklj&key='+api_key)
Pry.start(binding)

latitude = result['results'][0]['geometry']['location']['lat']

longitude = result['results'][0]['geometry']['location']['lng']
