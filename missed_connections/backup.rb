require 'pry'
require 'pg'
require 'csv'

# gets current date and time
date_time = Time.now.to_s.gsub(' ', '_')

# sets the file name our csv backup
file_name = 'backup-'+date_time+'.csv'.to_s

# location of our CSV backup for the init_backup variable
file_path = '/Users/Sam/src/POMPELMO/missed_connections/'+file_name

# creates new csv backup file with the file name
CSV.open(file_name, 'wb')

# sql that will copy the missed_connections table to a csv
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

# establishes the database connection
db = PG.connect(dbname: 'mc')

# executes our backup
db.exec(init_backup)


