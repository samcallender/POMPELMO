require 'Pry'

class MissedConnection
	def initialize(id, title, location)
		@connection_id = id
		@connection_title = title
		@connection_location = location		
	end

	def title
		puts @connection_title
	end
end

connection_1 = MissedConnection.new(1, "Thick Asian Girl on Q train", "Manhattan")
connection_2 = MissedConnection.new("2", "Walking Your Dog", "Clinton Hill")

Pry.start(binding)