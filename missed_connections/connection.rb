require 'active_record'

ActiveRecord::Base.establish_connection ({
	:adapter => 'postgresql',
	:database => 'mc'
})
ActiveRecord::Base.logger = Logger.new(STDOUT)