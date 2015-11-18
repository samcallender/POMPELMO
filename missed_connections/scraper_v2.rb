require 'HTTParty'
require 'Nokogiri'
# require 'active_record'
require 'Pry'
# require 'csv'

# require_relative 'connection.rb'
# require_relative 'missed_connection.rb'

api_key = 'AIzaSyALLZ3VXoyVYMYlgXocK-3mK5fvFquC2r8'

# Step 1: Create MissedConnection Class
class MissedConnection
	attr_reader :headline, :post_id, :post_date, :page_url, :borough, :preference, :place, :body_text

	def initialize(headline, post_id, post_date, page_url, borough, preference, place, body_text, latitude, longitude)
		@headline = headline
		@post_id = post_id
		@post_date = post_date
		@page_url = page_url
		@borough =  borough 
		@preference = preference
		@place = place
		@body_text = body_text
		@latitude = latitude
		@longitude = longitude
	end

end

# STEP 2: target page/section, parse page determine additional pages to be scraped
page = HTTParty.get('https://newyork.craigslist.org/search/mis')

parse_page = Nokogiri::HTML(page)

# page_count = parse_page.css('.totalcount').text.to_i / 100000

page_count = 1

# STEP 3: creates an array of missed connections as nokogir objects
connections_array = []

i = 0
while i <= page_count do
	page = HTTParty.get('https://newyork.craigslist.org/search/mis'+'?s='+i.to_s+'00')

	parse_page = Nokogiri::HTML(page)

	parse_page.css('.content').css('.row').map do |a|
		post = a
		connections_array.push(post)
	end
	
	i += 1
end

# Pry.start(binding)


# STEP 4: Iterate through connections array and create MissecConnection objects
# connections_array.each 

mc_object_array = []
n = 0
connections_array.each do |m|
	n += 1
	puts "#{n}"

	headline = m.css('.hdrlnk').text
	post_id = m.css('.hdrlnk').xpath('@data-id').text
	post_date = m.css('time').xpath('@datetime').text
	page_url = m.css('.i').xpath('@href').text
	borough = m.css('.i').xpath('@href').text[1..3]
	last_index = m.css('.hdrlnk').text.length - 1
	preference = m.css('.hdrlnk').text[last_index - 2..last_index]
	place = m.css('.pnr').text.gsub(/[()]/, "").lstrip.rstrip

	detail_page = HTTParty.get('https://newyork.craigslist.org'+ page_url)
	# detail_page = HTTParty.get('https://newyork.craigslist.org/que/mis/5295448667.html')

	parse_detail_page = Nokogiri::HTML(detail_page)
	body_text = parse_detail_page.css('#postingbody').text.gsub(/\n/, '')

	latitude = parse_detail_page.css('#map').xpath('@data-latitude').text
	longitude = parse_detail_page.css('#map').xpath('@data-longitude').text

	if borough == 'mnh'
		api_radius = '10300'
		api_location = '40.786340,-73.963053'
	elsif borough == 'brx'
		api_radius = '70000'
		api_location = '40.849309,-73.876979'
	elsif borough == 'brk'
		api_radius = '10000'
		api_location = '40.649912,-73.949806'
	elsif borough == 'que'
		api_radius = '13200'
		api_location = '40.849886,-73.875116'
	elsif borough == 'stn'
		api_radius = '10500'
		api_location = '40.578015, -74.153858'
	else
		api_radius = '50000'
		api_location = '40.758765,-73.985206'	
	end

	if latitude == ""
		puts "Google Places Api Request"
		keyword = place.lstrip.rstrip.gsub(/ /, "+")
		result = HTTParty.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+api_location+'&radius='+api_radius+'&keyword='+keyword+'&key='+api_key)
		latitude = result['results'][0]['geometry']['location']['lat']
		longitude = result['results'][0]['geometry']['location']['lng']

		puts "#{place}"
		puts "latitude: #{latitude}"
		puts "longitude: #{longitude}"
	end
Pry.start(binding)

	# keyword = place.gsub(/ /, "+")
	# result = HTTParty.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.758765,-73.985206&radius=10000&keyword='+keyword+'&key='+api_key)
	# latitude = result['results'][0]['geometry']['location']['lat']
	# longitude = result['results'][0]['geometry']['location']['lng']


	# mc = MissedConnection.create({
	# 	post_id: post_id,
	# 	headline: headline,
	# 	post_date: post_date,
	# 	page_url: page_url,
	# 	borough: borough,
	# 	preference: preference,
	# 	place: place,
	# 	body_text:	body_text	
	# 	})

	  mc = MissedConnection.new(
		@headline = headline,
		@post_id = post_id,
		@post_date = post_date,
		@page_url = page_url,
		@borough =  borough,
		@preference = preference,
		@place = place,
		@body_text = body_text,
		@latitude = latitude,
		@longitude = longitude
		)

	mc_object_array.push(mc)


	end


# APPENDIX A: PARSING
test_connection = connections_array[1]
# 1) Get Headline: Indian guy at Barnes and Noble Union Square - m4m - string
test_connection_headline = test_connection.css('.hdrlnk').text
# 2) Get Post ID: 5268453825 - integer
test_connection_post_id = test_connection.css('.hdrlnk').xpath('@data-id').text.to_i
# 3) Get Date Time: 2015-10-14 21:36 - string
test_connection_post_date = test_connection.css('time').xpath('@datetime').text
# 4) Get Detail Page URL: /brk/mis/5268540247.html - string
test_connection_page_url = test_connection.css('.i').xpath('@href').text
# 5) Get borough: brk - string
test_connection_borough = test_connection.css('.i').xpath('@href').text[1..3]
# 6) Get Sexual Preference: m4m - string
last_index = test_connection.css('.hdrlnk').text.length - 1
test_connection_preference = test_connection.css('.hdrlnk').text[last_index - 2..last_index]

# 7) Get Place:   Bushwick    - string
test_connection_place = test_connection.css('.pnr').text.gsub(/[()]/, "")

# 8) Get Detail Page Body Text: 
detail_page = HTTParty.get('https://newyork.craigslist.org'+test_connection_page_url)
parse_detail_page = Nokogiri::HTML(detail_page)
detail_page_body_text = parse_detail_page.css('#postingbody').text.gsub(/\n/, '')

# APPENDIX B - OPTIONAL PARSING
# 9) Get Age: 26 - string
test_connection_age = test_connection.css('.age').text

# APPENDIX C - test objects

# testy = MissedConnection.new(
# 		@headline = test_connection_headline,
# 		@post_id = test_connection_post_id,
# 		@post_date = test_connection_post_date,
# 		@page_url = test_connection_page_url,
# 		@borough =  test_connection_borough,
# 		@preference = test_connection_preference,
# 		@place = test_connection_place,
# 		@body_text = detail_page_body_text
# 	)

# sam = MissedConnection.new(
# 		@headline = "dude with slurpy in bk",
# 		@post_id = 5,
# 		@post_date = "10/21",
# 		@page_url = "/brk/mis/5268540247.html",
# 		@borough =  "brk",
# 		@preference = "m4m",
# 		@place = "Williamsburgh",
# 		@body_text = "I saw you with a slurpy heading to the L train and you winked at me.  What flavor slurpy did you have?"
# 	)


# APPENDIX CSV
# this will push your array into a CSV file
# CSV.open('pets.csv', 'w') do |csv|
# 	csv << pets_array
# end
