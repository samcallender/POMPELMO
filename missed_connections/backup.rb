require 'pry'
require 'pg'
require 'csv'

date_time = Time.now.to_s.gsub(' ', '_')

# file_name = 'backup-'+date_time+'.csv'.to_s

file_name = 'backup.csv'

file_path = '/Users/samcallender/src/missed_connections/'+file_name

CSV.open(file_name, 'wb')

init_backup = <<-SQL
	COPY missed_connections(
		id, 
		post_id,
		headline,
		post_date,
		page_url,
		borough,
		preference, 
		place,
		body_text,
		latitude,
		longitude,
		created_at,
		updated_at,
		location_source) 

	TO '#{file_path}'

	WITH DELIMITER ',' CSV HEADER;
SQL

db = PG.connect(dbname: 'mc')

Pry.start(binding)

db.exec(init_backup)


