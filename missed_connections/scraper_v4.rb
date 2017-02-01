# STEP 1: require dependencies
require 'HTTParty'
require 'Nokogiri'
require 'active_record'
require 'Pry'

# connects to the database
require_relative 'connection.rb'
# missed connecction model
require_relative 'missed_connection.rb'

# google places api key
# api_key = 'AIzaSyALLZ3VXoyVYMYlgXocK-3mK5fvFquC2r8'
# old

# new api key
api_key = 'AIzaSyAhrxCd4B-f_KcDUHdBAi40uoHBNbkkEnQ'

# STEP 2: target page/section, parse page determine additional pages to be scraped
page = HTTParty.get('https://newyork.craigslist.org/search/mis')

parse_page = Nokogiri::HTML(page)

page_count = parse_page.css('.totalcount').text.to_i / 100000

# STEP 3: creates an array of missed connections as nokogiri objects
connections_array = []

i = 0
while i <= page_count do
	page = HTTParty.get('https://newyork.craigslist.org/search/mis'+'?s='+i.to_s+'00')

	parse_page = Nokogiri::HTML(page)
	parse_page.css('.content').css('.result-row').map do |a|
		post = a
		connections_array.push(post)
	end
	i += 1
end

# Number of missed connections
total_connections = connections_array.length
puts "there are #{total_connections} missed connections"

# STEP 4: Iterate through connections array and create MissecConnection objects
# connections_array.each 
mc_array = []
n = 0
total_api_requests = 0
zero_results = 0
nil_results = 0
connections_array.each do |m|
	n += 1
	puts "Creating missed connection number #{n}"

	# headline = m.css('.hdrlnk').text
	headline = m.css('.hdrlnk').text.gsub(/;/, "")
	post_id = m.css('.hdrlnk').xpath('@data-id').text
	post_date = m.css('time').xpath('@datetime').text
	page_url = m.css('.hdrlnk').xpath('@href').text
	borough = m.css('.hdrlnk').xpath('@href').text[1..3]
	last_index = m.css('.hdrlnk').text.length - 1
	preference = m.css('.hdrlnk').text[last_index - 2..last_index]
	place = m.css('.result-hood').text.gsub(/[()]/, "").gsub(/>/, "").gsub(/</, "").gsub(/pic/, "").gsub(/map/, "").gsub(/"/,'').lstrip.rstrip.gsub("\\", "")
	# This scrapes the body from the post's detail page
	detail_page = HTTParty.get('https://newyork.craigslist.org'+ page_url)
	parse_detail_page = Nokogiri::HTML(detail_page)
	body_text = parse_detail_page.css('#postingbody').text.gsub(/\n/, '').gsub('QR Code Link to This Post', '').lstrip
	# This assigns latitude and longitude.
	latitude = parse_detail_page.css('#map').xpath('@data-latitude').text
	longitude = parse_detail_page.css('#map').xpath('@data-longitude').text

	location_source = 'detail page'

	# This establishes a search radius for boroughs if an Google Places API request is made
	if borough == 'mnh'
		api_radius = '10300'
		api_latitude = '40.786340'
		api_longitude = '-73.963053'
		api_location = api_latitude+','+api_longitude
	elsif borough == 'brx'
		api_radius = '70000'
		api_latitude = '40.849309'
		api_longitude = '-73.876979'
		api_location = api_latitude+','+api_longitude
	elsif borough == 'brk'
		api_radius = '10000'
		api_latitude = '40.649912'
		api_longitude = '-73.949806'
		api_location = api_latitude+','+api_longitude
	elsif borough == 'que'
		api_radius = '13200'
		api_latitude = '40.849886'
		api_longitude = '-73.875116'
		api_location = api_latitude+','+api_longitude
	elsif borough == 'stn'
		api_radius = '10500'
		api_latitude = '40.578015'
		api_longitude = '-74.153858'
		api_location = api_latitude+','+api_longitude
	elsif borough == 'fct'
		api_radius = '20000'
		api_latitude = '41.180054'
		api_longitude = '-73.270910'
		api_location = api_latitude+','+api_longitude 
	elsif borough == 'lgi'
		api_radius = '20000'
		api_latitude = '40.761772'
		api_longitude = '40.761772'
		api_location = api_latitude+','+api_longitude
	elsif borough == 'jsy'
		api_radius = '15000'
		api_latitude = '40.800621'
		api_longitude = '-74.158792'
		api_location = api_latitude+','+api_longitude
	elsif borough == 'wch'
		api_radius = '24000'
		api_latitude = '41.087956'
		api_longitude = '-73.749552'
		api_location = api_latitude+','+api_longitude
	else
		api_radius = '50000'
		api_latitude ='40.758765'
		api_longitude = '-73.985206'
		api_location = api_latitude+','+api_longitude
	end

	# This requests a longitude and latitude from Google Places API if there was not location data on the detail page
	if latitude == ""
		location_source = 'Google Places API'
		puts "Google Places API"
		total_api_requests += 1
		keyword = place.lstrip.rstrip.gsub(/ /, "+")

		# http://stackoverflow.com/questions/1268289/how-to-get-rid-of-non-ascii-characters-in-ruby
		encoding_options = {
		  :invalid           => :replace,  # Replace invalid byte sequences
		  :undef             => :replace,  # Replace anything not defined in ASCII
		  :replace           => '',        # Use a blank for those replacements
		  :universal_newline => true       # Always break lines with \n
		}

		request_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+api_location+'&radius='+api_radius+'&keyword='+keyword+'&key='+api_key

		request_url = request_url.encode(Encoding.find('ASCII'), encoding_options)

		result = HTTParty.get(request_url)
		
		if result['status'] == nil
			puts "nil result"
			nil_results += 1
			latitude = "nil"
			longitude = "nil"
			location_source = 'none'
		elsif result['status'] == "ZERO_RESULTS"
			zero_results += 1
			puts "zero_results"
			latitude = api_latitude
			longitude = api_longitude
		else
		latitude = result['results'][0]['geometry']['location']['lat']
		longitude = result['results'][0]['geometry']['location']['lng']
		end

		puts "#{place}"
		puts "#{headline}"
	end



	# This creates a new missed connection in the DB
	mc = MissedConnection.create({
		post_id: post_id,
		headline: headline,
		post_date: post_date,
		page_url: page_url,
		borough: borough,
		preference: preference,
		place: place,
		body_text:	body_text,
		latitude: latitude,
		longitude: longitude,
		location_source: location_source
		})

	# just pushing all the objects into an array so I can look at them in pry
	mc_array.push(mc)

	# Pry.start(binding)

	puts "total api requests: #{total_api_requests}"
	puts "total zero results: #{zero_results}"
	puts "total nil results: #{nil_results}"
end

Pry.start(binding)


