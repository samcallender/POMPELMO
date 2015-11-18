require 'Pry'
require 'mechanize'
require 'Nokogiri'

agent = Mechanize.new
page = agent.get('https://www.google.com/maps')

form = page.forms.first

Pry.start(binding)

# pp page

